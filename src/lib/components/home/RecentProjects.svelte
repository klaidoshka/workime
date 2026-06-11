<script lang="ts">
  import { getProjectIconAndColor } from "$lib/components/projects/project/iconColorPicker/IconColorPicker";
  import type { Project } from "$lib/representation/project";
  import TimeUtils from "$lib/utils/time";

  export interface RecentProject extends Project {
    loggedMinutes: number;
    budgetHours?: number;
    lastEntryLabel: string;
  }

  let { projects }: { projects: RecentProject[] } = $props();

  function budgetPct(minutes: number, budgetHours: number): number {
    return Math.min(100, Math.round((minutes / (budgetHours * 60)) * 100));
  }
</script>

<div class="flex flex-col divide-y divide-bd-dim">
  {#each projects as project (project.id)}
    {@const { IconComp, colorValue } = getProjectIconAndColor(project)}
    <a
      href="/projects/{project.id}"
      class="flex items-center gap-3 py-3 group no-underline first:pt-0 last:pb-0">
      <div
        class="shrink-0 w-7 h-7 rounded-md flex items-center justify-center transition-transform group-hover:scale-105"
        style="background-color: {colorValue}20; color: {colorValue}">
        <IconComp class="w-4 h-4" />
      </div>

      <div class="flex flex-col gap-0.5 flex-1 min-w-0">
        <span
          class="text-sm font-medium text-tx group-hover:text-ac-br transition-colors truncate">
          {project.label}
        </span>
        <div class="flex items-center gap-2">
          <span class="text-2xs text-tx-faint">
            Last entry {project.lastEntryLabel}
          </span>
        </div>
      </div>

      <div class="flex flex-col items-end gap-1.5 shrink-0 min-w-22.5">
        <span class="font-mono text-sm font-medium text-tx tabular-nums">
          {TimeUtils.formatMinutesToHoursShort(project.loggedMinutes)}
        </span>
        {#if project.budgetHours}
          <div class="w-20 bg-s3/80 rounded-full h-1 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              style="width:{budgetPct(
                project.loggedMinutes,
                project.budgetHours,
              )}%; background:{colorValue}">
            </div>
          </div>
          <span class="text-2xs text-tx-faint">
            of {project.budgetHours}h budget
          </span>
        {:else}
          <span class="text-2xs text-tx-faint">no budget set</span>
        {/if}
      </div>
    </a>
  {/each}
</div>
