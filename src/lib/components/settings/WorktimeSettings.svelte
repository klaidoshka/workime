<script lang="ts">
  import TimePicker from "../common/time/TimePicker.svelte";
  import TimeRangePicker from "../common/time/TimeRangePicker.svelte";

  let {
    workStart = $bindable(),
    workEnd = $bindable(),
    lunchStart = $bindable(),
    lunchEnd = $bindable(),
    minWorkHours = $bindable(),
  }: {
    workStart: Date;
    workEnd: Date;
    lunchStart: Date;
    lunchEnd: Date;
    minWorkHours: Date;
  } = $props();
</script>

<div class="flex flex-col gap-2">
  <h2 class="section-label px-1">Worktime</h2>
  <div class="stat-sheet">
    <div class="stat-row">
      <div class="flex-1">
        <span class="text-sm font-medium text-tx block"> Work Shift </span>
        <span class="text-2xs text-tx-faint block mt-0.5">
          Define your work start and completion times
        </span>
      </div>

      <TimeRangePicker bind:timeFrom={workStart} bind:timeTo={workEnd} />
    </div>

    <div class="stat-row">
      <div class="flex-1">
        <span class="text-sm font-medium text-tx block"> Lunch Break </span>
        <span class="text-2xs text-tx-faint block mt-0.5">
          Time of your lunch break within work day
        </span>
      </div>

      <TimeRangePicker bind:timeFrom={lunchStart} bind:timeTo={lunchEnd} />
    </div>

    <div class="stat-row">
      <div class="flex-1">
        <span class="text-sm font-medium text-tx block">
          Minimum Work Hours
        </span>
        <span class="text-2xs text-tx-faint block mt-0.5">
          Minimum quota you must work per day
        </span>
      </div>
      <div
        class="inline-flex items-center gap-2 bg-s2 p-1.5 rounded-xl border border-bd-dim select-none">
        <div class="flex items-center gap-1.5 pl-1">
          <TimePicker bind:time={minWorkHours} showIcon />
        </div>
      </div>
    </div>
  </div>
</div>
