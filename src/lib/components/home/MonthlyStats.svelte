<script lang="ts">
  export interface MonthlyStatsData {
    totalMinutes: number;
    targetHours: number;
    workingDaysTotal: number;
    workingDaysActive: number;
    dailyBars: number[];
    byProject: { label: string; color: string; minutes: number }[];
  }

  let {
    stats,
    currentDate = new Date(),
    onMonthChange,
  }: {
    stats: MonthlyStatsData;
    currentDate?: Date;
    onMonthChange: (newDate: Date) => void;
  } = $props();

  const totalHours = $derived(Math.floor(stats.totalMinutes / 60));
  const totalMins = $derived(stats.totalMinutes % 60);
  const dailyAvg = $derived(
    stats.workingDaysActive > 0
      ? (stats.totalMinutes / 60 / stats.workingDaysActive).toFixed(1)
      : "—",
  );

  const maxBarH = $derived(Math.max(...stats.dailyBars, 1));

  const monthLabel = $derived(
    currentDate.toLocaleString("default", { month: "long", year: "numeric" }),
  );

  function changeMonth(direction: number): void {
    const nextDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + direction,
      1,
    );
    onMonthChange(nextDate);
  }

  function projectPct(minutes: number): number {
    const maxMins = Math.max(...stats.byProject.map((p) => p.minutes), 1);
    return Math.round((minutes / maxMins) * 100);
  }

  function fmtMins(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  }
</script>

<div class="flex flex-col gap-5">
  <div
    class="flex items-center justify-between bg-s2 p-2 rounded-lg border border-bd-dim">
    <button
      onclick={() => {
        changeMonth(-1);
      }}
      class="p-1.5 hover:bg-s3 rounded-md transition-colors text-tx-dim hover:text-tx"
      aria-label="Previous month">
      <i class="ti ti-chevron-left text-lg" aria-hidden="true"></i>
    </button>
    <span class="font-semibold text-sm text-tx tracking-wide"
      >{monthLabel}</span>
    <button
      onclick={() => {
        changeMonth(1);
      }}
      class="p-1.5 hover:bg-s3 rounded-md transition-colors text-tx-dim hover:text-tx"
      aria-label="Next month">
      <i class="ti ti-chevron-right text-lg" aria-hidden="true"></i>
    </button>
  </div>

  <div class="grid grid-cols-4 gap-2.5">
    <div class="metric-tile gap-1">
      <span class="metric-label">Total logged</span>
      <p
        class="text-2xl font-semibold font-mono text-ac-br tabular-nums leading-tight">
        {totalHours}h {String(totalMins).padStart(2, "0")}m
      </p>
    </div>
    <div class="metric-tile gap-1">
      <span class="metric-label">Monthly target</span>
      <p
        class="text-2xl font-semibold font-mono text-tx tabular-nums leading-tight">
        {stats.targetHours}h
      </p>
    </div>
    <div class="metric-tile gap-1">
      <span class="metric-label">Daily average</span>
      <p
        class="text-2xl font-semibold font-mono text-tx tabular-nums leading-tight">
        {dailyAvg}h/day
      </p>
    </div>
    <div class="metric-tile gap-1">
      <span class="metric-label">Days active</span>
      <p
        class="text-2xl font-semibold font-mono text-tx tabular-nums leading-tight">
        {stats.workingDaysActive} / {stats.workingDaysTotal} WD
      </p>
    </div>
  </div>

  <div>
    <div class="flex items-end gap-1 h-28 pb-0">
      {#each stats.dailyBars as hours, i}
        {@const pct = Math.round((hours / maxBarH) * 100)}
        {@const isToday = i === stats.dailyBars.length - 1}
        {@const isOff = hours === 0}
        <div class="flex-1 flex flex-col items-center justify-end gap-1 h-full">
          <div
            class="w-full rounded-t transition-all duration-500"
            style="height:{isOff ? 4 : pct}%;
              background:{isOff
              ? 'var(--color-bd-dim)'
              : isToday
                ? 'var(--color-ac-br)'
                : 'var(--color-ac)'};
              opacity:{isOff ? 0.3 : 1};">
          </div>
          <span class="text-[10px] font-mono text-tx-faint">{i + 1}</span>
        </div>
      {/each}
    </div>
    <div class="flex justify-between mt-1">
      <span class="text-2xs text-tx-faint">1st</span>
      <span class="text-2xs text-tx-faint">Today</span>
    </div>
  </div>

  <hr class="border-none border-t border-bd-dim" />

  <div>
    <p
      class="text-2xs text-tx-faint uppercase tracking-wide font-semibold mb-3">
      Hours by project
    </p>
    <div class="flex flex-col gap-3">
      {#each stats.byProject as proj}
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
              {fmtMins(proj.minutes)}
            </span>
          </div>
          <div class="w-full bg-s3/80 rounded-full h-1 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              style="width:{projectPct(
                proj.minutes,
              )}%; background:{proj.color}">
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
