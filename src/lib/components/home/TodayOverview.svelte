<script lang="ts">
  import TimeUtils from "$lib/utils/time";

  let {
    loggedMinutes,
    targetHours,
    lunchTime,
    workEndTime,
  }: {
    loggedMinutes: number;
    targetHours: number;
    lunchTime: { h: number; m: number };
    workEndTime: { h: number; m: number };
  } = $props();

  const targetMinutes = $derived(targetHours * 60);
  const leftMinutes = $derived(Math.max(0, targetMinutes - loggedMinutes));
  const progressPct = $derived(
    Math.min(100, Math.round((loggedMinutes / targetMinutes) * 100)),
  );
</script>

{#snippet metricWithProgress(
  icon: string,
  label: string,
  minutes: number,
  pct: number,
  barClass: string,
  textClass: string,
  footer: string,
)}
  <div class="metric-tile gap-1">
    <span class="metric-label flex items-center">
      <i class="{icon} ti-fw" aria-hidden="true"></i>
      {label}
    </span>
    <p
      class="text-3xl font-semibold font-mono leading-tight tabular-nums {textClass}">
      {TimeUtils.formatMinutesToHoursShort(minutes)}
    </p>
    <div class="w-full bg-s3/80 rounded-full h-1 overflow-hidden mt-1">
      <div
        class="h-full rounded-full transition-all duration-500 {barClass}"
        style="width:{pct}%">
      </div>
    </div>
    <span class="text-2xs text-tx-faint mt-0.5">{footer}</span>
  </div>
{/snippet}

{#snippet metricWithTime(
  icon: string,
  label: string,
  timeObj: { h: number; m: number },
)}
  <div class="metric-tile gap-1">
    <span class="metric-label flex items-center">
      <i class="{icon} ti-fw" aria-hidden="true"></i>
      {label}
    </span>
    <p
      class="text-3xl font-semibold font-mono text-tx leading-tight tabular-nums">
      {String(timeObj.h).padStart(2, "0")}:{String(timeObj.m).padStart(2, "0")}
    </p>
    <span class="text-2xs text-tx-faint mt-1">
      {TimeUtils.getCountdown(timeObj.h, timeObj.m)}
    </span>
  </div>
{/snippet}

<div class="grid grid-cols-4 gap-2.5">
  {@render metricWithProgress(
    "ti ti-clock-play",
    "Hours logged",
    loggedMinutes,
    progressPct,
    "bg-ac-br",
    "text-ac-br",
    `of ${targetHours} h target`,
  )}
  {@render metricWithProgress(
    "ti ti-hourglass-half",
    "Hours left",
    leftMinutes,
    100 - progressPct,
    "bg-bd-str",
    "text-tx",
    `to hit ${targetHours} h`,
  )}
  {@render metricWithTime("ti ti-salad", "Lunch break", lunchTime)}
  {@render metricWithTime("ti ti-door-exit", "Work ends", workEndTime)}
</div>
