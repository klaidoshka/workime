<script lang="ts">
  import { Search } from "@lucide/svelte";
  import {
      ICON_MAP,
      PROJECT_COLORS,
      PROJECT_ICON_NAMES,
      type ProjectIconName,
      getColorValue,
  } from "./iconColorPicker";

  let {
    icon = "Folder",
    color = "blue",
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

  const filteredIcons = $derived(
    iconSearch.trim()
      ? PROJECT_ICON_NAMES.filter((n) =>
          n.toLowerCase().includes(iconSearch.toLowerCase()),
        )
      : PROJECT_ICON_NAMES,
  );

  function selectColor(colorId: string) {
    currentColor = colorId;
    onchange?.(currentIcon, currentColor);
  }

  function selectIcon(name: string) {
    currentIcon = name;
    onchange?.(currentIcon, currentColor);
  }

  $effect(() => {
    function handler(e: MouseEvent) {
      const t = e.target as HTMLElement;

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
  class="w-60 rounded-xl border border-bd bg-s1 shadow-2xl p-3 flex flex-col gap-3">
  <div>
    <p class="section-label mb-2">Color</p>

    <div class="flex flex-wrap gap-1.5">
      {#each PROJECT_COLORS as c}
        <button
          type="button"
          onclick={() => selectColor(c.id)}
          title={c.id}
          class="w-5 h-5 rounded-full shrink-0 transition-transform duration-100 bg-(--c-bg) outline-offset-2
                 {currentColor === c.id
            ? 'scale-110 outline-2 outline-(--c-bg)'
            : 'opacity-60 hover:opacity-100 hover:scale-110 outline-none'}"
          style="--c-bg: {c.value}">
        </button>
      {/each}
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
          class="w-7 h-7 flex items-center justify-center rounded-lg
                 transition-colors duration-100 focus:outline-none
                 {currentIcon === name
            ? 'text-white bg-(--icon-bg)'
            : 'text-tx-dim hover:bg-s2 hover:text-tx'}"
          style="--icon-bg: {getColorValue(currentColor)}">
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
</div>
