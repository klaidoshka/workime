<script lang="ts">
  import type { Note } from "$lib/representation/note";
  import type { Project } from "$lib/representation/project";
  import instance from "$lib/stores/projectStore.svelte";
  import { calculateDashboardStats } from "./ProjectStats";

  let {
    project,
    notes,
  }: {
    project: Project;
    notes: Note[];
  } = $props();

  const stats = $derived(calculateDashboardStats(project, notes));

  const detailRows = $derived([
    {
      label: "Project Lifespan",
      value: `${stats.daysActive} ${stats.daysLabel}`,
    },
    { label: "Last Activity", value: stats.lastActivityLabel },
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
    instance.updateExpectedHours(project.id, hours);
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
      {project.completed ? "Completed project" : "Active project"} · {stats.noteCount}
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
    <div class="flex items-center justify-between gap-4">
      <div class="flex flex-col gap-0.5 min-w-0">
        <span class="metric-label">Expected Budget</span>
        {#if stats.targetHours > 0}
          <p class="text-xs text-tx-faint leading-relaxed">
            <span class="font-mono tabular-nums">
              {stats.remainingFormatted}
            </span> remaining
          </p>
        {/if}
      </div>

      <div class="flex items-center gap-1.5 shrink-0">
        <input
          type="number"
          min="0"
          step="0.1"
          placeholder="0"
          value={stats.targetHours || ""}
          oninput={handleExpectedHoursInput}
          class="input-budget w-14 text-center" />
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
          <span class="text-tx-faint uppercase tracking-wide font-sans"
            >Budget used</span>
          <span class="font-semibold {progressTextColor}"
            >{stats.progressPercentage}%</span>
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
            class="text-sm font-medium font-mono text-tx tabular-nums leading-snug"
            >{row.value}</span>
          {#if row.hint}
            <span class="text-2xs text-tx-faint leading-snug">{row.hint}</span>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</aside>
