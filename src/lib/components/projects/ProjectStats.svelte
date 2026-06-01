<script lang="ts">
  import type { Note } from "$lib/representation/note";
  import type { Project } from "$lib/representation/project";
  import instance from "$lib/stores/ProjectStore.svelte";

  let props: { project: Project; notes: Note[] } = $props();

  type DetailRow = {
    label: string;
    value: string;
    hint?: string;
  };

  function formatMinutes(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  function formatRelativeDate(date: Date): string {
    const diffMs = Date.now() - date.getTime();
    const diffDays = Math.floor(diffMs / 86_400_000);

    if (diffDays < 0) return "Just now";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  const stats = $derived.by(() => {
    let totalMinutes = 0;
    let timedNoteCount = 0;

    props.notes.forEach((n) => {
      if (n.timeTakenFrom !== undefined && n.timeTakenTo !== undefined) {
        let diff = n.timeTakenTo - n.timeTakenFrom;
        if (diff < 0) diff += 24 * 60;
        totalMinutes += diff;
        timedNoteCount += 1;
      }
    });

    const noteCount = props.notes.length;
    const avgSessionMinutes =
      timedNoteCount > 0 ? Math.round(totalMinutes / timedNoteCount) : 0;

    let daysActive = 1;

    if (props.project) {
      const start = new Date(props.project.createdAt).getTime();
      const end = props.project.finished
        ? new Date(props.project.modifiedAt).getTime()
        : Date.now();

      daysActive = Math.max(
        1,
        Math.ceil(Math.max(0, end - start) / 86_400_000),
      );
    }

    const dailyAvgMinutes = Math.round(totalMinutes / daysActive);
    const targetHours = props.project.expectedFinishHours ?? 0;
    const loggedHours = totalMinutes / 60;
    const progressPercentage =
      targetHours > 0
        ? Math.max(0, Math.round((loggedHours / targetHours) * 100))
        : 0;
    const remainingHours = Math.max(0, targetHours - loggedHours);
    const remainingFormatted =
      remainingHours >= 1
        ? `${remainingHours.toFixed(1)}h`
        : `${Math.round(remainingHours * 60)}m`;

    const lastActivity = props.notes.length
      ? new Date(Math.max(...props.notes.map((n) => n.timestamp.getTime())))
      : new Date(props.project.modifiedAt);

    return {
      totalFormatted: formatMinutes(totalMinutes),
      dailyAvgFormatted: formatMinutes(dailyAvgMinutes),
      avgSessionFormatted: formatMinutes(avgSessionMinutes),
      noteCount,
      timedNoteCount,
      daysActive,
      daysLabel: daysActive === 1 ? "day" : "days",
      progressPercentage,
      targetHours,
      remainingFormatted,
      lastActivityLabel: formatRelativeDate(lastActivity),
      hasTimedNotes: timedNoteCount > 0,
    };
  });

  const detailRows = $derived.by((): DetailRow[] => [
    {
      label: "Project Lifespan",
      value: `${stats.daysActive} ${stats.daysLabel}`,
    },
    {
      label: "Last Activity",
      value: stats.lastActivityLabel,
    },
    {
      label: "Total Notes",
      value: String(stats.noteCount),
      hint:
        stats.timedNoteCount > 0
          ? `${stats.timedNoteCount} with time logged`
          : undefined,
    },
    {
      label: "Avg Session",
      value: stats.hasTimedNotes ? stats.avgSessionFormatted : "—",
      hint: stats.hasTimedNotes ? "Per timed note" : "No timed notes yet",
    },
  ]);

  function handleExpectedHoursInput(e: Event) {
    const hours = parseFloat((e.target as HTMLInputElement).value) || 0;
    instance.updateExpectedHours(props.project.id, hours);
  }

  const progressBarColor = $derived(
    stats.progressPercentage > 125
      ? "bg-err-br"
      : stats.progressPercentage > 100
        ? "bg-warn-br"
        : "bg-ac-br",
  );
  const progressTextColor = $derived(
    stats.progressPercentage > 125
      ? "text-err-br"
      : stats.progressPercentage > 100
        ? "text-warn-br"
        : "text-tx-dim",
  );
</script>

<aside class="island shrink-0 w-full p-5 flex flex-col gap-5 font-sans">
  <header class="flex flex-col gap-1">
    <h2 class="section-label">Time Dashboard</h2>
    <p class="text-xs text-tx-faint leading-relaxed">
      {props.project.finished ? "Completed project" : "Active project"} · {stats.noteCount}
      {stats.noteCount === 1 ? "note" : "notes"}
    </p>
  </header>

  <div class="metric-tile gap-2 py-4">
    <span class="metric-label">Time Logged</span>
    <p
      class="text-3xl font-semibold font-mono text-ac-br leading-tight tabular-nums">
      {stats.totalFormatted}
    </p>
    {#if stats.hasTimedNotes}
      <p class="text-xs text-tx-faint leading-relaxed">
        ~<span class="font-mono tabular-nums">{stats.dailyAvgFormatted}</span> per
        day on average
      </p>
    {:else}
      <p class="text-xs text-tx-faint leading-relaxed">
        Add time ranges on notes to track hours
      </p>
    {/if}
  </div>

  <div class="metric-tile gap-3">
    <div class="flex items-start justify-between gap-4">
      <div class="flex flex-col gap-1 min-w-0">
        <span class="metric-label">Expected Budget</span>
        {#if stats.targetHours > 0}
          <p class="text-xs text-tx-faint leading-relaxed">
            <span class="font-mono tabular-nums">
              {stats.remainingFormatted}
            </span> remaining
          </p>
        {/if}
      </div>
      <div class="flex items-baseline gap-1.5 shrink-0 pt-0.5">
        <input
          type="number"
          min="0"
          step="0.1"
          placeholder="0"
          value={stats.targetHours || ""}
          oninput={handleExpectedHoursInput}
          class="input-budget w-14" />
        <span class="text-sm text-tx-faint font-mono">hrs</span>
      </div>
    </div>
    {#if stats.targetHours > 0}
      <div class="flex flex-col gap-2 pt-1">
        <div class="w-full bg-s3/80 rounded-full h-1.5 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500 max-w-full {progressBarColor}"
            style="width: {stats.progressPercentage}%">
          </div>
        </div>
        <div class="flex justify-between text-2xs font-mono tabular-nums">
          <span class="text-tx-faint uppercase tracking-wide font-sans">
            Budget used
          </span>
          <span class="font-semibold {progressTextColor}">
            {stats.progressPercentage}%
          </span>
        </div>
      </div>
    {/if}
  </div>

  <div class="stat-sheet">
    {#each detailRows as row (row.label)}
      <div class="stat-row">
        <span class="text-sm text-tx-dim shrink-0">{row.label}</span>
        <div class="flex flex-col items-end gap-0.5 min-w-0 text-right">
          <span
            class="text-sm font-medium font-mono text-tx tabular-nums leading-snug">
            {row.value}
          </span>
          {#if row.hint}
            <span class="text-2xs text-tx-faint leading-snug">
              {row.hint}
            </span>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</aside>
