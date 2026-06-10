<script lang="ts">
  import { Clock } from "@lucide/svelte";
  import {
      calculateDuration
  } from "../time/TimeRangePicker";
  import TimePicker from "./TimePicker.svelte";

  let {
    timeFrom = $bindable(undefined),
    timeTo = $bindable(undefined),
    showDifference,
  } = $props<{
    timeFrom: Date | undefined;
    timeTo: Date | undefined;
    showDifference?: boolean;
  }>();

  const durationText = $derived(calculateDuration(timeFrom, timeTo));
</script>

<div
  class="inline-flex items-center gap-3 bg-s2 p-1.5 rounded-xl border border-bd-dim select-none">
  <Clock class="w-3.5 h-3.5 text-tx-faint ml-1" />

  <TimePicker bind:time={timeFrom} label="From" />

  <span class="text-tx-faint text-xs">→</span>

  <TimePicker bind:time={timeTo} label="To" />

  {#if showDifference && durationText}
    <span
      class="font-semibold font-mono text-xs text-ac-br bg-ac-bg border border-ac-bd px-2 py-0.5 rounded-lg pr-1.5 ml-0.5">
      +{durationText}
    </span>
  {/if}
</div>
