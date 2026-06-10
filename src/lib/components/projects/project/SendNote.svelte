<script lang="ts">
  import TimeRangePicker from "$lib/components/common/time/TimeRangePicker.svelte";
  import type { NoteAttachment } from "$lib/representation/note";
  import instance from "$lib/stores/projectStore.svelte";
  import { Paperclip, Send, X } from "@lucide/svelte";

  let props: { projectId: number } = $props();
  let newNoteText = $state("");
  let timeFrom = $state<Date | undefined>(undefined);
  let timeTo = $state<Date | undefined>(undefined);
  let pendingAttachments = $state<NoteAttachment[]>([]);
  let fileInput = $state<HTMLInputElement | null>(null);

  const canSend = $derived(
    newNoteText.trim().length > 0 || pendingAttachments.length > 0,
  );

  function onFilesSelected(e: Event) {
    const files = (e.target as HTMLInputElement).files;

    if (!files?.length) {
      return;
    }

    const added = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
    }));

    pendingAttachments = [...pendingAttachments, ...added];

    if (fileInput) {
      fileInput.value = "";
    }
  }

  function removeAttachment(index: number) {
    pendingAttachments = pendingAttachments.filter((_, i) => i !== index);
  }

  function sendNote() {
    if (!canSend) {
      return;
    }

    instance.addNote(
      props.projectId,
      newNoteText,
      timeFrom,
      timeTo,
      pendingAttachments,
    );

    newNoteText = "";
    timeFrom = undefined;
    timeTo = undefined;
    pendingAttachments = [];
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendNote();
    }
  }
</script>

<div class="island w-full p-3.5 flex flex-col gap-3">
  <textarea
    rows="3"
    placeholder="Write a note… (Enter to send, Shift+Enter for newline)"
    bind:value={newNoteText}
    onkeydown={handleKeyDown}
    class="w-full py-2.5 px-3 input-field min-h-18 max-h-40 text-tx-dim focus:text-tx resize-none">
  </textarea>

  {#if pendingAttachments.length > 0}
    <div class="flex flex-wrap gap-1.5 px-0.5">
      {#each pendingAttachments as file, i (file.name + i)}
        <span
          class="inline-flex items-center gap-1.5 max-w-48 pl-2.5 pr-1 py-1 rounded-lg bg-s2 border border-bd-dim text-xs text-tx-dim">
          <Paperclip class="w-3 h-3 shrink-0 text-tx-faint" />
          <span class="truncate font-mono">{file.name}</span>
          <span class="text-tx-faint shrink-0 text-[10px] font-mono">
            {FileUtils.formatFileSize(file.size)}
          </span>
          <button
            type="button"
            title="Remove attachment"
            onclick={() => removeAttachment(i)}
            class="p-0.5 rounded-md hover:bg-s3 text-tx-faint hover:text-err-br transition-colors cursor-pointer">
            <X class="w-3.5 h-3.5" />
          </button>
        </span>
      {/each}
    </div>
  {/if}

  <div
    class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-bd-dim">
    <div class="flex flex-wrap items-center gap-2.5">
      <TimeRangePicker bind:timeFrom bind:timeTo showDifference />
    </div>

    <div class="flex items-center gap-2 shrink-0">
      <input
        bind:this={fileInput}
        type="file"
        multiple
        class="sr-only"
        onchange={onFilesSelected} />

      <button
        type="button"
        title="Attach file"
        onclick={() => fileInput?.click()}
        class="h-8.5 w-8.5 flex items-center justify-center rounded-xl cursor-pointer border border-bd bg-s3 text-tx-faint hover:text-tx hover:border-bd-str hover:bg-s4 transition-colors">
        <Paperclip class="w-4 h-4" />
      </button>

      <button
        type="button"
        onclick={sendNote}
        disabled={!canSend}
        class="h-8.5 px-4 flex items-center justify-center gap-1.5 cursor-pointer btn-primary
               disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-ac-br transition-opacity">
        <Send class="w-3.5 h-3.5" />
        Send
      </button>
    </div>
  </div>
</div>
