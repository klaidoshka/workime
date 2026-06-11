<script lang="ts">
  import TimeUtils from "$lib/utils/time";

  export interface TimelineEntry {
    label: string;
    projectColor: string;
    from: string;
    to: string;
    minutes: number;
  }

  let {
    entries,
    loggedMinutes,
    targetHours,
  }: {
    entries: TimelineEntry[];
    loggedMinutes: number;
    targetHours: number;
  } = $props();

  const targetMinutes = $derived(targetHours * 60);
  const unloggedMinutes = $derived(Math.max(0, targetMinutes - loggedMinutes));
</script>

<div>
  <p class="text-2xs text-tx-faint uppercase tracking-wide font-semibold mb-2">
    Today's timeline
  </p>
  <div class="flex flex-col divide-y divide-bd-dim">
    {#each entries as entry}
      <div class="flex items-center gap-3 py-2.5">
        <div
          class="w-2 h-2 rounded-full shrink-0"
          style="background:{entry.projectColor}">
        </div>
        <span class="text-sm text-tx-dim flex-1 truncate">{entry.label}</span>
        <span class="font-mono text-2xs text-tx-faint">
          {entry.from} – {entry.to}
        </span>
        <span
          class="text-2xs font-semibold font-mono px-1.5 py-px rounded-md"
          style="background: {entry.projectColor}1f; color: {entry.projectColor}">
          {TimeUtils.formatMinutesToHoursShort(entry.minutes)}
        </span>
      </div>
    {/each}

    {#if unloggedMinutes > 0}
      <div class="flex items-center gap-3 py-2.5 opacity-40">
        <div
          class="w-2 h-2 rounded-full shrink-0 border border-bd-str border-dashed">
        </div>
        <span class="text-sm text-tx-faint italic flex-1">
          Remaining {TimeUtils.formatMinutesToHoursShort(unloggedMinutes)} unlogged
        </span>
      </div>
    {/if}
  </div>
</div>
