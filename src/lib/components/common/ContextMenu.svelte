<script lang="ts">
  import { portal } from "$lib/utils/ui";
  import type { Component } from "svelte";

  export type ContextMenuAction = {
    label: string;
    icon: Component;
    onClick: () => void;
  };

  let {
    top,
    left,
    actions,
    onClose,
  }: {
    top: number;
    left: number;
    actions: ContextMenuAction[];
    onClose: () => void;
  } = $props();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
    }
  }
</script>

<svelte:window onclick={onClose} onkeydown={handleKeydown} />

<div
  use:portal
  role="presentation"
  class="fixed z-9999 w-40 bg-s1 border border-bd rounded-xl shadow-lg p-1 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100"
  style="top: {top}px; left: {left}px;"
  onclick={(e) => {
    e.stopPropagation();
  }}>
    {#each actions as { label, icon: Icon, onClick }, i (label)}
      {@render contextMenuButton(onClick, onClose, Icon, label)}

      {#if i < actions.length - 1}
        <div class="h-px bg-bd my-0.5"></div>
      {/if}
    {/each}
</div>

{#snippet contextMenuButton(onClick: () => void, onClose: () => void, Icon: Component, label: string)}
  <button
    type="button"
    onclick={() => {
      onClick();
      onClose();
    }}
    class="w-full px-2 py-1.5 text-xs text-tx text-left flex items-center gap-2 rounded-lg hover:bg-s2 transition-colors">
      <Icon class="w-3.5 h-3.5 text-tx-faint" />
    {label}
  </button>
{/snippet}