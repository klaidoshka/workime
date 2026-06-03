<script lang="ts">
  import { Search } from "@lucide/svelte";
  import ColorPicker from "svelte-awesome-color-picker";
  import {
      DEFAULT_COLOR,
      ICON_MAP,
      PROJECT_COLORS,
      PROJECT_ICON_NAMES,
      type ProjectIconName,
      getColorValue,
  } from "./iconColorPicker";

  let {
    icon = "Folder",
    color = DEFAULT_COLOR,
    onchange,
    onclose,
  }: {
    icon?: string;
    color?: string;
    onchange?: (icon: string, color: string) => void;
    onclose?: () => void;
  } = $props();

  let iconSearch = $state("");
  let currentIcon = $state(icon);
  let currentColor = $state(color);
  let showCustomPicker = $state(false);
  let customHex = $state<string | null>(null);

  const currentHex = $derived(getColorValue(currentColor));
  const isCustomColor = $derived(
    !PROJECT_COLORS.some((c) => c.id === currentColor),
  );

  const filteredIcons = $derived(
    iconSearch.trim()
      ? PROJECT_ICON_NAMES.filter((n) =>
          n.toLowerCase().includes(iconSearch.toLowerCase()),
        )
      : PROJECT_ICON_NAMES,
  );

  function selectColor(colorValue: string) {
    currentColor = colorValue;
    onchange?.(currentIcon, currentColor);
  }

  function selectIcon(name: string) {
    currentIcon = name;
    onchange?.(currentIcon, currentColor);
  }

  function toggleCustomPicker() {
    showCustomPicker = !showCustomPicker;

    if (showCustomPicker) {
      customHex = currentHex;
    }
  }

  $effect(() => {
    function handler(e: MouseEvent) {
      const t = e.target as HTMLElement;

      if (!document.contains(t)) return;

      if (
        showCustomPicker &&
        !t.closest("[data-custom-picker]") &&
        !t.closest("[data-custom-trigger]")
      ) {
        showCustomPicker = false;
      }

      if (!t.closest("[data-icon-color-picker]")) {
        onclose?.();
      }
    }

    const id = setTimeout(() => document.addEventListener("click", handler), 0);

    return () => {
      clearTimeout(id);
      document.removeEventListener("click", handler);
    };
  });
</script>

<div
  data-icon-color-picker
  class="relative z-10 w-60 rounded-xl border border-bd bg-s1 shadow-2xl p-3 flex flex-col gap-3 select-none">
  <div>
    <p class="section-label mb-2">Color</p>

    <div class="flex flex-wrap gap-1.5 mb-2">
      {#each PROJECT_COLORS as c}
        <button
          type="button"
          onclick={() => selectColor(c.id)}
          title={c.id}
          class="w-5 h-5 rounded-full shrink-0 transition-transform duration-100 outline-offset-2
                 {currentColor === c.id
            ? 'scale-110 outline-2'
            : 'opacity-60 hover:opacity-100 hover:scale-110 outline-none'}"
          style="background-color: {c.value}; outline-color: {c.value};">
        </button>
      {/each}
    </div>

    <div class="relative flex items-center gap-2 pt-2 border-t border-bd/50">
      <button
        data-custom-trigger
        type="button"
        onclick={toggleCustomPicker}
        title="Custom color"
        class="relative w-5 h-5 rounded-full shrink-0 cursor-pointer border transition-transform hover:scale-110 active:scale-95 outline-offset-2
               {showCustomPicker || isCustomColor
          ? 'outline-2 outline-ac-br border-ac-br'
          : 'border-bd'}"
        style="background: {isCustomColor
          ? currentHex
          : 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)'}">
      </button>

      <span class="text-xs text-tx-dim flex-1 truncate">
        {isCustomColor ? currentHex : "Custom…"}
      </span>
    </div>
  </div>

  <div>
    <p class="section-label mb-2">Icon</p>

    <div class="relative mb-2">
      <Search
        class="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-tx-faint pointer-events-none" />
      <input
        placeholder="Search icons..."
        bind:value={iconSearch}
        class="w-full py-1 pl-6 pr-2 text-xs input-field" />
    </div>

    <div class="grid grid-cols-7 gap-0.5 max-h-36 overflow-y-auto pr-0.5">
      {#each filteredIcons as name}
        {@const IconComp = ICON_MAP[name as ProjectIconName]}
        <button
          type="button"
          onclick={() => selectIcon(name)}
          title={name}
          class="w-7 h-7 flex items-center justify-center rounded-lg transition-colors duration-100 focus:outline-none
                 {currentIcon === name
            ? 'text-white'
            : 'text-tx-dim hover:bg-s2 hover:text-tx'}"
          style={currentIcon === name ? `background-color: ${currentHex}` : ""}>
          <IconComp class="w-3.5 h-3.5" />
        </button>
      {/each}
      {#if filteredIcons.length === 0}
        <p class="col-span-7 text-xs text-tx-faint text-center py-3">
          No icons found
        </p>
      {/if}
    </div>
  </div>

  {#if showCustomPicker}
    <div
      data-custom-picker
      onclick={(e) => e.stopPropagation()}
      class="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-50 rounded-xl border border-bd bg-s1 shadow-2xl p-2 flex flex-col gap-2 custom-picker-wrap color-picker-theme">
      <button
        type="button"
        onclick={() => (showCustomPicker = false)}
        class="self-start flex items-center gap-1 text-2xs text-tx-faint hover:text-tx transition-colors mb-1">
        <svg
          class="w-3 h-3"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round">
          <path d="M8 6H1M4 3L1 6l3 3" />
        </svg>
        Close
      </button>

      <ColorPicker
        bind:hex={customHex}
        isAlpha={false}
        isDialog={false}
        textInputModes={["hex"]}
        position="responsive"
        onInput={(e) => {
          if (e.hex) selectColor(e.hex);
        }} />
    </div>
  {/if}
</div>

<style>
  :global(.color-picker-theme) {
    --cp-bg-color: #1c1c1c;
    --cp-border-color: #333333;
    --cp-text-color: #ffffff;
    --cp-input-color: #2a2a2a;
    --cp-button-hover-color: #333333;
    --focus-color: #e68a6e;
    --picker-height: 150px;
    --picker-width: 160px;
    --slider-width: 18px;
    --picker-indicator-size: 8px;
    --input-size: 18px;
  }
</style>
