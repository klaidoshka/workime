<script lang="ts">
  import MonthBreakdown from "./MonthBreakdown.svelte";
  import MonthChart from "./MonthChart.svelte";
  import MonthPicker from "./MonthPicker.svelte";

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

  let chartMode = $state<"bar" | "line">("bar");

  const totalHours = $derived(Math.floor(stats.totalMinutes / 60));
  const totalMins = $derived(stats.totalMinutes % 60);
  const dailyAvg = $derived(
    stats.workingDaysActive > 0
      ? (stats.totalMinutes / 60 / stats.workingDaysActive).toFixed(1)
      : "—",
  );
</script>

<div class="flex flex-col gap-5">
  <MonthPicker {currentDate} {onMonthChange} bind:chartMode />

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

  <MonthChart bars={stats.dailyBars} {chartMode} {currentDate} />

  <hr class="border-none border-t border-bd-dim" />

  <MonthBreakdown byProject={stats.byProject} />
</div>
