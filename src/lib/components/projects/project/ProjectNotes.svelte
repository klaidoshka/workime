<script lang="ts">
  import ConfirmDialog from "$lib/components/common/ConfirmDialog.svelte";
  import TimeRangePicker from "$lib/components/common/timeRangePicker/TimeRangePicker.svelte";
  import type { Note } from "$lib/representation/note";
  import instance from "$lib/stores/projectStore.svelte";
  import { portal } from "$lib/utils/ui";
  import {
      Check,
      Clock,
      MoreVertical,
      Paperclip,
      Pen,
      Trash2,
      X,
  } from "@lucide/svelte";
  import { tick } from "svelte";

  let props: { notes: Note[]; projectId: number } = $props();
  let scrollContainer = $state<HTMLDivElement | null>(null);

  let activeMenuNoteId = $state<number | null>(null);
  let menuPos = $state({ top: 0, left: 0 });

  let editingNoteId = $state<number | null>(null);
  let editTextValue = $state("");
  let editTimeFrom = $state<Date | undefined>(undefined);
  let editTimeTo = $state<Date | undefined>(undefined);
  let editInputEl = $state<HTMLTextAreaElement | null>(null);

  let showDeleteConfirm = $state(false);
  let targetDeleteNoteId = $state<number | null>(null);
  let isSaving = $state(false);

  $effect(() => {
    if (props.notes && scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  });

  function toggleMenu(e: MouseEvent, noteId: number) {
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

  async function startEdit(note: Note) {
    activeMenuNoteId = null;
    editTextValue = note.content;
    editTimeFrom = note.timeTakenFrom;
    editTimeTo = note.timeTakenTo;
    editingNoteId = note.id;
    await tick();
    editInputEl?.focus();
  }

  async function saveEdit(noteId: number) {
    const trimmed = editTextValue.trim();
    if (!trimmed || isSaving) return;

    const timeFrom = editTimeFrom && editTimeTo ? editTimeFrom : undefined;
    const timeTo = editTimeFrom && editTimeTo ? editTimeTo : undefined;

    isSaving = true;
    try {
      await instance.editNote(noteId, trimmed, timeFrom, timeTo);
      editingNoteId = null;
    } finally {
      isSaving = false;
    }
  }

  function cancelEdit() {
    editingNoteId = null;
  }

  function promptDelete(noteId: number) {
    activeMenuNoteId = null;
    targetDeleteNoteId = noteId;
    showDeleteConfirm = true;
  }

  async function executeDeletion() {
    if (targetDeleteNoteId !== null) {
      await instance.deleteNote(targetDeleteNoteId);
      targetDeleteNoteId = null;
    }
  }

  function handleWindowClick() {
    activeMenuNoteId = null;
  }

  function formatMinutesToTime(date?: Date): string {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "";
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  }

  function getDurationText(from?: Date, to?: Date): string {
    if (!from || !to || !(from instanceof Date) || !(to instanceof Date))
      return "";
    let diffInMinutes = Math.floor(
      (to.getTime() - from.getTime()) / (1000 * 60),
    );
    if (diffInMinutes < 0) diffInMinutes += 24 * 60;
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
</script>

<svelte:window onclick={handleWindowClick} />

<div
  bind:this={scrollContainer}
  class="island w-full flex-1 p-4 overflow-y-auto min-h-0">
  {#if props.notes.length > 0}
    <div class="flex flex-col min-h-0 relative pl-0 timeline-rail">
      {#each props.notes as note (note.id)}
        <div class="group flex items-start gap-6 relative py-3 pl-6">
          <div
            class="absolute left-0 -translate-x-1/2 top-6.5 w-3.5 h-3.5 rounded-full z-10 shrink-0
            bg-s1 border-2 border-bd-str
            transition-[border-color,transform] duration-200
            group-hover:border-ac-br group-hover:scale-110">
            <div
              class="absolute inset-1 rounded-full bg-bd-str group-hover:bg-ac-br transition-colors">
            </div>
          </div>

          <div
            class="bg-s2 border border-bd-dim rounded-2xl p-3 max-w-2xl flex-1 flex flex-col gap-2 relative
            transition-[border-color] duration-150 group-hover:border-bd">
            <div
              class="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                type="button"
                onclick={(e) => toggleMenu(e, note.id)}
                class="p-1 rounded-lg text-tx-faint hover:text-tx hover:bg-s3 transition-colors focus:outline-none">
                <MoreVertical class="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div
                class="flex items-baseline justify-between mb-2 pb-1.5 border-b border-bd-dim pr-6">
                <div class="flex items-center gap-2">
                  <span
                    class="text-2xs font-medium uppercase tracking-wide text-tx-faint font-mono">
                    {note.createdAt.toLocaleString()}
                  </span>
                  {#if note.timeTakenFrom !== undefined && note.timeTakenTo !== undefined}
                    <span
                      class="inline-flex items-center gap-1 bg-s3 border border-bd text-tx-dim rounded-md font-mono text-2xs px-1.5 py-px">
                      <Clock class="w-3 h-3 text-tx-faint" />
                      {formatMinutesToTime(note.timeTakenFrom)} – {formatMinutesToTime(
                        note.timeTakenTo,
                      )}
                    </span>
                  {/if}
                </div>
                {#if note.timeTakenFrom !== undefined && note.timeTakenTo !== undefined}
                  <span
                    class="bg-ac-bg text-ac-br border border-ac-bd font-semibold font-mono text-xs px-2 py-px rounded-full">
                    +{getDurationText(note.timeTakenFrom, note.timeTakenTo)}
                  </span>
                {/if}
              </div>

              {#if editingNoteId === note.id}
                <div class="flex flex-col gap-2 w-full mt-1">
                  <textarea
                    bind:this={editInputEl}
                    bind:value={editTextValue}
                    onkeydown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        saveEdit(note.id);
                      } else if (e.key === "Escape") {
                        cancelEdit();
                      }
                    }}
                    rows="3"
                    class="w-full bg-s1 border border-bd rounded-xl p-2 text-sm text-tx focus:outline-none focus:border-ac-br resize-none leading-relaxed">
                  </textarea>

                  <TimeRangePicker
                    bind:timeFrom={editTimeFrom}
                    bind:timeTo={editTimeTo} />

                  <div class="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onclick={cancelEdit}
                      class="p-1.5 text-xs font-medium text-tx-dim bg-s3 border border-bd rounded-lg hover:text-tx hover:bg-s4 transition-colors">
                      <X class="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onclick={() => saveEdit(note.id)}
                      disabled={isSaving}
                      class="p-1.5 text-xs font-medium text-white bg-ac hover:bg-ac-br rounded-lg transition-colors disabled:opacity-50">
                      <Check class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              {:else if note.content}
                <p
                  class="text-sm text-tx-dim whitespace-pre-wrap leading-relaxed pr-2">
                  {note.content}
                </p>
              {/if}

              {#if note.attachments && note.attachments.length > 0}
                <div
                  class="flex flex-col gap-1.5 {note.content &&
                  editingNoteId !== note.id
                    ? 'pt-2'
                    : ''}">
                  {#each note.attachments as file (file.name + file.size)}
                    <span
                      class="inline-flex items-center gap-2 w-fit max-w-full pl-2.5 pr-3 py-1.5 rounded-md bg-s3 border border-bd text-xs text-tx-dim">
                      <Paperclip class="w-3.5 h-3.5 shrink-0 text-tx-faint" />
                      <span class="truncate font-mono">{file.name}</span>
                      <span class="text-tx-faint font-mono shrink-0"
                        >{formatFileSize(file.size)}</span>
                    </span>
                  {/each}
                </div>
              {/if}
            </div>

            {#if note.tags && note.tags.length > 0}
              <div class="flex flex-wrap gap-1.5 pt-1">
                {#each note.tags as tag}
                  <span
                    class="bg-s3 text-tx-dim border border-bd text-2xs font-medium rounded-md px-1.75 py-px">
                    #{tag}
                  </span>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <p class="text-sm text-tx-faint">
      Begin your journey within this project by adding your first note below.
    </p>
  {/if}
</div>

{#if activeMenuNoteId !== null}
  {@const currentNoteObj = props.notes.find((n) => n.id === activeMenuNoteId)}
  <div
    use:portal
    class="fixed z-9999 w-36 bg-s1 border border-bd rounded-xl shadow-lg p-1 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100"
    style="top: {menuPos.top}px; left: {menuPos.left}px;"
    onclick={(e) => e.stopPropagation()}>
    {#if currentNoteObj}
      <button
        type="button"
        onclick={() => startEdit(currentNoteObj)}
        class="w-full px-2 py-1.5 text-xs text-tx text-left flex items-center gap-2 rounded-lg hover:bg-s2 transition-colors">
        <Pen class="w-3.5 h-3.5 text-tx-faint" />
        Edit Log
      </button>

      <div class="h-px bg-bd my-0.5"></div>

      <button
        type="button"
        onclick={() => promptDelete(activeMenuNoteId!)}
        class="w-full px-2 py-1.5 text-xs text-re text-left flex items-center gap-2 rounded-lg hover:bg-re/10 transition-colors">
        <Trash2 class="w-3.5 h-3.5 text-re" />
        Delete Log
      </button>
    {/if}
  </div>
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
