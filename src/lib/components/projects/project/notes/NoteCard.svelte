<script lang="ts">
  import TimeRangePicker from "$lib/components/common/timeRangePicker/TimeRangePicker.svelte";
  import type { Note } from "$lib/representation/note";
  import instance from "$lib/stores/projectStore.svelte";
  import TextUtils from "$lib/utils/text";
  import TimeUtils from "$lib/utils/time";
  import { Check, Clock, EllipsisVertical, Paperclip, X } from "@lucide/svelte";
  import { tick } from "svelte";

  let {
    note,
    onMenuOpen,
    onDeleteRequest,
  }: {
    note: Note;
    onMenuOpen: (e: MouseEvent, noteId: number) => void;
    onDeleteRequest: (noteId: number) => void;
  } = $props();

  let editingNoteId = $state<number | null>(null);
  let editTextValue = $state("");
  let editTimeFrom = $state<Date | undefined>(undefined);
  let editTimeTo = $state<Date | undefined>(undefined);
  let editInputEl = $state<HTMLTextAreaElement | null>(null);
  let isSaving = $state(false);

  export async function startEdit() {
    editTextValue = note.content;
    editTimeFrom = note.timeTakenFrom;
    editTimeTo = note.timeTakenTo;
    editingNoteId = note.id;

    await tick();

    editInputEl?.focus();
  }

  async function saveEdit() {
    const trimmedContent = editTextValue.trim();

    if (!trimmedContent || isSaving) {
      return;
    }

    const timeFrom = editTimeFrom && editTimeTo ? editTimeFrom : undefined;
    const timeTo = editTimeFrom && editTimeTo ? editTimeTo : undefined;

    isSaving = true;

    try {
      await instance.editNote(note.id, {
        content: trimmedContent,
        tags: TextUtils.parseTagsFromText(trimmedContent),
        timeTakenFrom: timeFrom,
        timeTakenTo: timeTo,
      });

      editingNoteId = null;
    } finally {
      isSaving = false;
    }
  }

  function cancelEdit() {
    editingNoteId = null;
  }
</script>

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
        onclick={(e) => onMenuOpen(e, note.id)}
        class="p-1 rounded-lg text-tx-faint hover:text-tx hover:bg-s3 transition-colors focus:outline-none">
        <EllipsisVertical class="w-3.5 h-3.5" />
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
              {TimeUtils.formatMinutesToTime(note.timeTakenFrom)} – {TimeUtils.formatMinutesToTime(
                note.timeTakenTo,
              )}
            </span>
          {/if}
        </div>
        {#if note.timeTakenFrom !== undefined && note.timeTakenTo !== undefined}
          <span
            class="bg-ac-bg text-ac-br border border-ac-bd font-semibold font-mono text-xs px-2 py-px rounded-full">
            +{TimeUtils.getDurationText(note.timeTakenFrom, note.timeTakenTo)}
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
                saveEdit();
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
              onclick={saveEdit}
              disabled={isSaving}
              class="p-1.5 text-xs font-medium text-white bg-ac hover:bg-ac-br rounded-lg transition-colors disabled:opacity-50">
              <Check class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      {:else if note.content}
        <p class="text-sm text-tx-dim whitespace-pre-wrap leading-relaxed pr-2">
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
              <span class="text-tx-faint font-mono shrink-0">
                {TextUtils.formatFileSize(file.size)}
              </span>
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
