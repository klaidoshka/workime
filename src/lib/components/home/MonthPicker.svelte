<script lang="ts">
  import { ChartColumnIncreasingIcon, ChartLineIcon } from "@lucide/svelte";

  let {
    currentDate,
    chartMode = $bindable("bar"),
    onMonthChange,
  }: {
    currentDate: Date;
    chartMode?: "bar" | "line";
    onMonthChange: (newDate: Date) => void;
  } = $props();

  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const MONTHS_SHORT = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const TODAY = new Date();
  TODAY.setHours(0, 0, 0, 0);

  let pickerOpen = $state(false);
  let pickerYear = $derived(currentDate.getFullYear());

  const monthLabel = $derived(
    `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
  );

  const canGoNext = $derived.by(() => {
    const next = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1,
    );

    return !isFutureMonth(next);
  });

  function isFutureMonth(d: Date): boolean {
    if (d.getFullYear() > TODAY.getFullYear()) {
      return true;
    }

    if (
      d.getFullYear() === TODAY.getFullYear() &&
      d.getMonth() > TODAY.getMonth()
    ) {
      return true;
    }

    return false;
  }

  function changeMonth(direction: number): void {
    const next = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + direction,
      1,
    );

    if (isFutureMonth(next)) {
      return;
    }

    onMonthChange(next);
  }

  function selectMonthFromPicker(month: number): void {
    const d = new Date(pickerYear, month, 1);

    if (isFutureMonth(d)) {
      return;
    }

    onMonthChange(d);
    pickerOpen = false;
  }

  function handlePickerKeydown(e: KeyboardEvent): void {
    if (e.key === "Escape") {
      pickerOpen = false;
    }
  }
</script>

<svelte:window on:keydown={handlePickerKeydown} />

<div
  class="flex items-center justify-between bg-s2 p-2 rounded-lg border border-bd-dim gap-2">
  <div class="flex items-center gap-1">
    <button
      onclick={() => {
        changeMonth(-1);
      }}
      class="p-1.5 hover:bg-s3 rounded-md transition-colors text-tx-dim hover:text-tx"
      aria-label="Previous month">
      <i class="ti ti-chevron-left text-lg" aria-hidden="true"></i>
    </button>
    <div class="flex gap-0.5 ml-0.5">
      <button
        onclick={() => {
          chartMode = "bar";
        }}
        class="p-1.5 rounded-md transition-colors {chartMode === 'bar'
          ? 'bg-s1 text-tx'
          : 'text-tx-faint hover:bg-s3 hover:text-tx-dim'}"
        aria-pressed={chartMode === "bar"}
        aria-label="Column chart">
        <ChartColumnIncreasingIcon class="w-3.5 h-3.5" />
      </button>
      <button
        onclick={() => {
          chartMode = "line";
        }}
        class="p-1.5 rounded-md transition-colors {chartMode === 'line'
          ? 'bg-s1 text-tx'
          : 'text-tx-faint hover:bg-s3 hover:text-tx-dim'}"
        aria-pressed={chartMode === "line"}
        aria-label="Line chart">
        <ChartLineIcon class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>

  <div class="relative">
    <button
      onclick={() => {
        pickerOpen = !pickerOpen;
        pickerYear = currentDate.getFullYear();
      }}
      class="font-semibold text-sm text-tx tracking-wide px-2 py-1 rounded-md hover:bg-s3 transition-colors flex items-center gap-1"
      aria-haspopup="dialog"
      aria-expanded={pickerOpen}>
      {monthLabel}
      <i class="ti ti-selector text-tx-faint text-xs" aria-hidden="true"></i>
    </button>

    {#if pickerOpen}
      <div
        class="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-s1 border border-bd-str rounded-xl p-4 w-64"
        role="dialog"
        aria-label="Month and year picker">
        <div class="flex items-center justify-between mb-3">
          <button
            onclick={() => {
              pickerYear -= 1;
            }}
            class="p-1 hover:bg-s3 rounded-md text-tx-dim hover:text-tx transition-colors"
            aria-label="Previous year">
            <i class="ti ti-chevron-left" aria-hidden="true"></i>
          </button>
          <span class="text-sm font-semibold text-tx">{pickerYear}</span>
          <button
            onclick={() => {
              pickerYear += 1;
            }}
            class="p-1 hover:bg-s3 rounded-md text-tx-dim hover:text-tx transition-colors"
            aria-label="Next year">
            <i class="ti ti-chevron-right" aria-hidden="true"></i>
          </button>
        </div>
        <div class="grid grid-cols-4 gap-1.5">
          {#each MONTHS_SHORT as mon, i}
            {@const d = new Date(pickerYear, i, 1)}
            {@const isActive =
              i === currentDate.getMonth() &&
              pickerYear === currentDate.getFullYear()}
            {@const isFuture = isFutureMonth(d)}
            <button
              onclick={() => {
                selectMonthFromPicker(i);
              }}
              disabled={isFuture}
              class="text-xs py-1.5 rounded-md transition-colors font-medium {isActive
                ? 'bg-ac-br text-white'
                : isFuture
                  ? 'text-tx-faint opacity-30 cursor-not-allowed'
                  : 'text-tx-dim hover:bg-s3 hover:text-tx'}">
              {mon}
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <button
    onclick={() => {
      changeMonth(1);
    }}
    disabled={!canGoNext}
    class="p-1.5 rounded-md transition-colors {canGoNext
      ? 'hover:bg-s3 text-tx-dim hover:text-tx'
      : 'text-tx-faint opacity-30 cursor-not-allowed'}"
    aria-label="Next month">
    <i class="ti ti-chevron-right text-lg" aria-hidden="true"></i>
  </button>
</div>
