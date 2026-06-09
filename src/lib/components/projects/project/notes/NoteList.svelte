<script lang="ts">
  import ConfirmDialog from "$lib/components/common/ConfirmDialog.svelte";
  import ContextMenu from "$lib/components/common/ContextMenu.svelte";
  import type { Note } from "$lib/representation/note";
  import instance from "$lib/stores/projectStore.svelte";
  import NoteCard from "./NoteCard.svelte";

  let {
    notes,
    projectId,
  }: {
    notes: Note[];
    projectId: number;
  } = $props();

  let scrollContainer = $state<HTMLDivElement | null>(null);

  let activeMenuNoteId = $state<number | null>(null);
  let menuPos = $state({ top: 0, left: 0 });

  let cardRefs = $state<Record<number, NoteCard>>({});

  let showDeleteConfirm = $state(false);
  let targetDeleteNoteId = $state<number | null>(null);

  $effect(() => {
    if (notes && scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  });

  function handleMenuOpen(e: MouseEvent, noteId: number) {
    e.stopPropagation();

    if (activeMenuNoteId === noteId) {
      activeMenuNoteId = null;
      return;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

    menuPos = {
      top: rect.bottom + window.scrollY + 4,
      left: rect.right + window.scrollX - 140,
    };

    activeMenuNoteId = noteId;
  }

  function handleEdit() {
    if (activeMenuNoteId !== null) {
      cardRefs[activeMenuNoteId]?.startEdit();
      activeMenuNoteId = null;
    }
  }

  function handleDeleteRequest() {
    if (activeMenuNoteId !== null) {
      targetDeleteNoteId = activeMenuNoteId;
      activeMenuNoteId = null;
      showDeleteConfirm = true;
    }
  }

  async function executeDeletion() {
    if (targetDeleteNoteId !== null) {
      await instance.deleteNote(targetDeleteNoteId);

      targetDeleteNoteId = null;
    }
  }
</script>

<svelte:window
  onclick={() => {
    activeMenuNoteId = null;
  }} />

<div
  bind:this={scrollContainer}
  class="island w-full flex-1 p-4 overflow-y-auto min-h-0">
  {#if notes.length > 0}
    <div class="flex flex-col min-h-0 relative pl-0 timeline-rail">
      {#each notes as note (note.id)}
        <NoteCard
          bind:this={cardRefs[note.id]}
          {note}
          onMenuOpen={handleMenuOpen}
          onDeleteRequest={(id) => {
            targetDeleteNoteId = id;
            showDeleteConfirm = true;
          }} />
      {/each}
    </div>
  {:else}
    <p class="text-sm text-tx-faint">
      Begin your journey within this project by adding your first note below.
    </p>
  {/if}
</div>

{#if activeMenuNoteId !== null}
  <ContextMenu
    top={menuPos.top}
    left={menuPos.left}
    editLabel="Edit Log"
    deleteLabel="Delete Log"
    onEdit={handleEdit}
    onDelete={handleDeleteRequest}
    onClose={() => {
      activeMenuNoteId = null;
    }} />
{/if}

<ConfirmDialog
  bind:open={showDeleteConfirm}
  title="Delete Project's Note"
  message="Are you sure you want to delete this note permanently from the project? This action cannot be undone."
  confirmLabel="Delete"
  onConfirm={executeDeletion}
  onClose={() => {
    targetDeleteNoteId = null;
  }} />
