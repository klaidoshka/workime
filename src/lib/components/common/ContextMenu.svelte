<script lang="ts">
  import { portal } from "$lib/utils/ui";
  import { Pen, Trash2 } from "@lucide/svelte";

  let {
    top,
    left,
    editLabel = "Edit Log",
    deleteLabel = "Delete Log",
    onEdit,
    onDelete,
    onClose,
  }: {
    top: number;
    left: number;
    editLabel?: string;
    deleteLabel?: string;
    onEdit: () => void;
    onDelete: () => void;
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
  <button
    type="button"
    onclick={() => {
      onEdit();
      onClose();
    }}
    class="w-full px-2 py-1.5 text-xs text-tx text-left flex items-center gap-2 rounded-lg hover:bg-s2 transition-colors">
    <Pen class="w-3.5 h-3.5 text-tx-faint" />
    {editLabel}
  </button>

  <div class="h-px bg-bd my-0.5"></div>

  <button
    type="button"
    onclick={() => {
      onDelete();
      onClose();
    }}
    class="w-full px-2 py-1.5 text-xs text-re text-left flex items-center gap-2 rounded-lg hover:bg-re/10 transition-colors">
    <Trash2 class="w-3.5 h-3.5 text-re" />
    {deleteLabel}
  </button>
</div>
