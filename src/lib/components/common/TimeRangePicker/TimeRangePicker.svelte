<script lang="ts">
  import TimeUtils from "$lib/utils/time";
  import {
      autocompleteTime,
      calculateDuration,
      formatInputString,
  } from "./TimeRangePicker";

  let { timeFrom = $bindable(""), timeTo = $bindable("") } = $props<{
    timeFrom: string;
    timeTo: string;
  }>();

  let fromInputEl = $state<HTMLInputElement | null>(null);
  let toInputEl = $state<HTMLInputElement | null>(null);

  $effect(() => {
    if (fromInputEl) {
      fromInputEl.value = timeFrom;
    }
  });

  $effect(() => {
    if (toInputEl) {
      toInputEl.value = timeTo;
    }
  });

  function handleInput(e: Event, target: "from" | "to") {
    const input = e.target as HTMLInputElement;
    const formatted = formatInputString(input.value);

    if (target === "from") {
      timeFrom = formatted;
    }

    if (target === "to") {
      timeTo = formatted;
    }

    input.value = formatted;
  }

  function handleBlur(target: "from" | "to") {
    if (target === "from") timeFrom = autocompleteTime(timeFrom);
    if (target === "to") timeTo = autocompleteTime(timeTo);

    const start = TimeUtils.stringToMinutes(timeFrom);
    const end = TimeUtils.stringToMinutes(timeTo);

    if (start !== undefined && end !== undefined && end < start) {
      timeTo = timeFrom;
    }
  }

  const durationText = $derived(calculateDuration(timeFrom, timeTo));
</script>

<div
  class="inline-flex items-center gap-3 bg-s2 p-1.5 rounded-xl border border-bd-dim select-none">
  <div class="flex items-center gap-1.5 pl-1">
    <span class="text-xs font-medium text-tx-faint">From</span>
    <input
      bind:this={fromInputEl}
      type="text"
      maxlength="5"
      placeholder="09:00"
      bind:value={timeFrom}
      oninput={(e) => handleInput(e, "from")}
      onblur={() => handleBlur("from")}
      class="w-14 px-1.5 py-0.5 text-center font-mono text-xs rounded-lg border border-bd bg-s3 text-tx placeholder:text-tx-faint focus:outline-none focus:border-ac-br focus:shadow-[0_0_0_2px_var(--color-ac-bg)] transition-colors" />
  </div>

  <span class="text-tx-faint text-xs">→</span>

  <div class="flex items-center gap-1.5">
    <span class="text-xs font-medium text-tx-faint">To</span>
    <input
      bind:this={toInputEl}
      type="text"
      maxlength="5"
      placeholder="17:00"
      bind:value={timeTo}
      oninput={(e) => handleInput(e, "to")}
      onblur={() => handleBlur("to")}
      class="w-14 px-1.5 py-0.5 text-center font-mono text-xs rounded-lg border border-bd bg-s3 text-tx placeholder:text-tx-faint focus:outline-none focus:border-ac-br focus:shadow-[0_0_0_2px_var(--color-ac-bg)] transition-colors" />
  </div>

  {#if durationText}
    <span
      class="font-semibold font-mono text-xs text-ac-br bg-ac-bg border border-ac-bd px-2 py-0.5 rounded-lg pr-1.5 ml-0.5">
      +{durationText}
    </span>
  {/if}
</div>
