<script lang="ts">
  import { portal } from "$lib/utils/ui";
  import type { Component } from "svelte";
  import { tick } from "svelte";
  import { blur } from "svelte/transition";

  interface Option {
    value: string;
    label: string;
    icon?: Component;
  }

  let {
    value = $bindable(),
    options,
    placeholder = "Select option...",
    onClick,
  }: {
    value?: string;
    options: Option[];
    placeholder?: string;
    onClick?: () => void;
  } = $props();

  let isOpen = $state(false);
  let triggerElement = $state<HTMLButtonElement>();
  let openUpwards = $state(false);
  let coords = $state({ top: 0, left: 0, width: 0 });

  const selectedOption = $derived(options.find((o) => o.value === value));

  async function toggleDropdown(e: MouseEvent) {
    e.stopPropagation();

    onClick?.();

    if (!isOpen) {
      await tick();

      if (triggerElement) {
        const rectangular = triggerElement.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rectangular.bottom;

        openUpwards = spaceBelow < 220;

        coords = {
          top: openUpwards ? rectangular.top - 4 : rectangular.bottom + 4,
          left: rectangular.left,
          width: rectangular.width,
        };
      }
    }

    isOpen = !isOpen;
  }

  function selectOption(optionValue: string) {
    value = optionValue;
    isOpen = false;
    triggerElement?.focus();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      isOpen = false;
    }
  }
</script>

<svelte:window
  onclick={() => (isOpen = false)}
  onkeydown={handleKeyDown}
  onresize={() => (isOpen = false)} />

<div class="w-full select-none">
  <button
    bind:this={triggerElement}
    type="button"
    aria-haspopup="listbox"
    aria-expanded={isOpen}
    onclick={toggleDropdown}
    class="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border border-bd bg-s3
           text-xs font-medium text-tx text-left transition-[border-color,box-shadow] duration-150
           focus:outline-none focus:border-ac-br focus:shadow-[0_0_0_3px_var(--color-ac-bg)]">
    <div class="flex items-center gap-2 min-w-0">
      {#if selectedOption?.icon}
        {@const Icon = selectedOption.icon}
        <Icon class="w-3.5 h-3.5 text-tx-faint shrink-0" />
      {/if}

      <span class="truncate {selectedOption ? 'text-tx' : 'text-tx-faint'}">
        {selectedOption ? selectedOption.label : placeholder}
      </span>
    </div>

    <svg
      class="w-3 h-3 text-tx-faint transition-transform duration-200 shrink-0 {isOpen
        ? 'rotate-180 text-ac-br'
        : ''}"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2.5">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  </button>

  {#if isOpen}
    <div
      use:portal
      role="listbox"
      tabindex="0"
      onkeydown={(e) => e.stopPropagation()}
      onclick={(e) => e.stopPropagation()}
      transition:blur={{ duration: 75 }}
      class="fixed z-9999 p-1 bg-s1 border border-bd rounded-xl shadow-lg
             flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto"
      style="
        left: {coords.left || 0}px;
        width: {coords.width || 240}px;
        {openUpwards
        ? `bottom: ${window.innerHeight - coords.top}px; transform-origin: bottom;`
        : `top: ${coords.top}px; transform-origin: top;`}
      ">
      {#each options as { value: optVal, label, icon: OptionIcon } (optVal)}
        <button
          type="button"
          role="option"
          aria-selected={value === optVal}
          onclick={() => selectOption(optVal)}
          class="w-full px-2 py-1.5 text-xs text-tx text-left flex items-center justify-between gap-2 rounded-lg
                 transition-colors cursor-pointer {value === optVal
            ? 'bg-s2 text-ac-br font-semibold'
            : 'hover:bg-s2/70'}">
          <div class="flex items-center gap-2 min-w-0">
            {#if OptionIcon}
              <OptionIcon
                class="w-3.5 h-3.5 {value === optVal
                  ? 'text-ac-br'
                  : 'text-tx-faint'} shrink-0" />
            {/if}

            <span class="truncate">
              {label}
            </span>
          </div>

          {#if value === optVal}
            <svg
              class="w-3.5 h-3.5 text-ac-br shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="3">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>
