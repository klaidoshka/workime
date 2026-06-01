<script lang="ts">
  import type { NoteAttachment } from "$lib/representation/note";
  import instance from "$lib/stores/ProjectStore.svelte";
  import { Paperclip, Send, X } from "@lucide/svelte";

  let props: { projectId: string } = $props();
  let newNoteText = $state("");
  let timeFrom = $state("");
  let timeTo = $state("");
  let pendingAttachments = $state<NoteAttachment[]>([]);
  let fileInput = $state<HTMLInputElement | null>(null);

  const livePreviewSpan = $derived.by(() => {
    if (!timeFrom || !timeTo) {
      return "";
    }

    const [fh, fm] = timeFrom.split(":").map(Number);
    const [th, tm] = timeTo.split(":").map(Number);

    let diff = th * 60 + tm - (fh * 60 + fm);

    if (diff < 0) {
      diff += 24 * 60;
    }

    const h = Math.floor(diff / 60);
    const m = diff % 60;

    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  });

  const canSend = $derived(
    newNoteText.trim().length > 0 || pendingAttachments.length > 0,
  );

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function onFilesSelected(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (!files?.length) return;

    const added: NoteAttachment[] = [];
    for (const file of files) {
      added.push({ name: file.name, size: file.size });
    }
    pendingAttachments = [...pendingAttachments, ...added];
    (e.target as HTMLInputElement).value = "";
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
    timeFrom = "";
    timeTo = "";
    pendingAttachments = [];
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendNote();
    }
  }
</script>

<div class="island w-full p-3 flex flex-col gap-2">
  <textarea
    rows="3"
    placeholder="Write a note… (Enter to send, Shift+Enter for newline)"
    bind:value={newNoteText}
    onkeydown={handleKeyDown}
    class="w-full py-2.5 px-3 text-sm leading-relaxed resize-none input-field min-h-18 max-h-40 text-tx-dim focus:text-tx">
  </textarea>

  {#if pendingAttachments.length > 0}
    <div class="flex flex-wrap gap-1.5 px-0.5">
      {#each pendingAttachments as file, i (file.name + i)}
        <span
          class="inline-flex items-center gap-1 max-w-48 pl-2 pr-1 py-0.5 rounded-md
                 bg-s2 border border-bd-dim text-xs text-tx-dim">
          <Paperclip class="w-3 h-3 shrink-0 text-tx-faint" />
          <span class="truncate font-mono">
            {file.name}
          </span>
          <span class="text-tx-faint shrink-0">
            {formatFileSize(file.size)}
          </span>
          <button
            type="button"
            title="Remove"
            onclick={() => removeAttachment(i)}
            class="p-0.5 rounded hover:bg-s3 text-tx-faint hover:text-tx transition-colors">
            <X class="w-3 h-3" />
          </button>
        </span>
      {/each}
    </div>
  {/if}

  <div
    class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-bd-dim">
    <div class="flex flex-wrap items-center gap-3">
      <div class="flex items-center gap-1.5">
        <span class="text-xs text-tx-faint">From</span>
        <input
          type="time"
          bind:value={timeFrom}
          class="px-1.5 py-1 font-mono text-xs input-field" />
      </div>
      <div class="flex items-center gap-1.5">
        <span class="text-xs text-tx-faint">To</span>
        <input
          type="time"
          bind:value={timeTo}
          class="px-1.5 py-1 font-mono text-xs input-field" />
      </div>
      {#if livePreviewSpan}
        <span class="font-semibold font-mono text-xs text-ac-br">
          {livePreviewSpan}
        </span>
      {/if}
    </div>

    <div class="flex items-center gap-1.5 shrink-0">
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
        class="h-9 w-9 flex items-center justify-center rounded-lg cursor-pointer
               border border-bd bg-s2 text-tx-faint
               hover:text-tx hover:border-bd-str hover:bg-s3 transition-colors">
        <Paperclip class="w-4 h-4" />
      </button>
      <button
        type="button"
        onclick={sendNote}
        disabled={!canSend}
        class="h-9 px-4 flex items-center justify-center gap-1.5 rounded-lg cursor-pointer btn-primary
               disabled:opacity-40 disabled:cursor-not-allowed">
        <Send class="w-4 h-4" />
        Send
      </button>
    </div>
  </div>
</div>
