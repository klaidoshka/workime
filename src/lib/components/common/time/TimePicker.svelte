<script lang="ts">
  import { Clock } from "@lucide/svelte";
  import {
      applyStringToDate,
      autocompleteTime,
      dateToTimeString,
      formatInputString,
  } from "./TimeRangePicker";

  let {
    label,
    time = $bindable(),
    showIcon,
  } = $props<{
    label?: string;
    time: Date | undefined;
    showIcon?: boolean;
  }>();

  let localTime = $state(dateToTimeString(time));
  let inputElement = $state<HTMLInputElement | null>(null);

  $effect(() => {
    localTime = dateToTimeString(time);
  });

  $effect(() => {
    if (inputElement) {
      inputElement.value = localTime;
    }
  });

  function handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const formatted = formatInputString(input.value);
    input.value = formatted;
  }

  function handleBlur() {
    let timeString = autocompleteTime(time);
    time = applyStringToDate(timeString, time);
  }
</script>

{#if showIcon}
  <Clock class="w-3.5 h-3.5 text-tx-faint mr-0.5" />
{/if}

<div class="flex items-center gap-1.5">
  {#if label}
    <span class="text-xs font-medium mt-0.5 text-tx-faint">
      {label}
    </span>
  {/if}
  <input
    bind:this={inputElement}
    type="text"
    maxlength="5"
    placeholder="00:00"
    bind:value={time}
    oninput={(e) => handleInput(e)}
    onblur={() => handleBlur()}
    class="w-14 px-1.5 py-0.5 text-center font-mono text-xs rounded-lg border border-bd bg-s3 text-tx placeholder:text-tx-faint focus:outline-none focus:border-ac-br focus:shadow-[0_0_0_2px_var(--color-ac-bg)] transition-colors" />
</div>
