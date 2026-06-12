<script lang="ts">
  import TimeUtils from "$lib/utils/time";

  let {
    byProject,
  }: {
    byProject: { label: string; color: string; minutes: number }[];
  } = $props();

  function projectPct(minutes: number): number {
    const maxMins = Math.max(...byProject.map((p) => p.minutes), 1);

    return Math.round((minutes / maxMins) * 100);
  }
</script>

<div>
  <p class="text-2xs text-tx-faint uppercase tracking-wide font-semibold mb-3">
    Hours by project
  </p>
  <div class="flex flex-col gap-3">
    {#each byProject as proj}
      <div>
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center gap-2">
            <div
              class="w-2 h-2 rounded-full shrink-0"
              style="background:{proj.color}">
            </div>
            <span class="text-sm text-tx-dim">{proj.label}</span>
          </div>
          <span class="font-mono text-2xs text-tx-faint tabular-nums">
            {TimeUtils.formatMinutesToHoursShort(proj.minutes)}
          </span>
        </div>
        <div class="w-full bg-s3/80 rounded-full h-1 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            style="width:{projectPct(proj.minutes)}%; background:{proj.color}">
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
