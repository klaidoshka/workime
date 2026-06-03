<script lang="ts">
  import type { Note } from "$lib/representation/note";
  import { Clock, Paperclip } from "@lucide/svelte";
  let props: { notes: Note[] } = $props();
  let scrollContainer = $state<HTMLDivElement | null>(null);

  $effect(() => {
    if (props.notes && scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  });

  function formatMinutesToTime(date?: Date): string {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "";
    }

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  function getDurationText(from?: Date, to?: Date): string {
    if (!from || !to || !(from instanceof Date) || !(to instanceof Date)) {
      return "";
    }

    let diffInMinutes = Math.floor(
      (to.getTime() - from.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 0) {
      diffInMinutes += 24 * 60;
    }

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

<div
  bind:this={scrollContainer}
  class="island w-full flex-1 p-4 overflow-y-auto min-h-0"
>
  {#if props.notes.length > 0}
    <div class="flex flex-col min-h-0 relative pl-0 timeline-rail">
      {#each props.notes as note (note.id)}
        <div class="group flex items-start gap-6 relative py-3 pl-6">
          <div
            class="absolute left-0 -translate-x-1/2 top-6.5 w-3.5 h-3.5 rounded-full z-10 shrink-0
            bg-s1 border-2 border-bd-str
            transition-[border-color,transform] duration-200
            group-hover:border-ac-br group-hover:scale-110"
          >
            <div
              class="absolute inset-1 rounded-full bg-bd-str group-hover:bg-ac-br transition-colors"
            ></div>
          </div>

          <div
            class="bg-s2 border border-bd-dim rounded-2xl p-3 max-w-2xl flex-1 flex flex-col gap-2
            transition-[border-color] duration-150 group-hover:border-bd"
          >
            <div>
              <div
                class="flex items-baseline justify-between mb-2 pb-1.5 border-b border-bd-dim"
              >
                <div class="flex items-center gap-2">
                  <span
                    class="text-2xs font-medium uppercase tracking-wide text-tx-faint font-mono"
                  >
                    {note.createdAt.toLocaleString()}
                  </span>
                  {#if note.timeTakenFrom !== undefined && note.timeTakenTo !== undefined}
                    <span
                      class="inline-flex items-center gap-1 bg-s3 border border-bd text-tx-dim rounded-md font-mono text-2xs px-1.5 py-px"
                    >
                      <Clock class="w-3 h-3 text-tx-faint" />
                      {formatMinutesToTime(note.timeTakenFrom)} – {formatMinutesToTime(
                        note.timeTakenTo,
                      )}
                    </span>
                  {/if}
                </div>
                {#if note.timeTakenFrom !== undefined && note.timeTakenTo !== undefined}
                  <span
                    class="bg-ac-bg text-ac-br border border-ac-bd font-semibold font-mono text-xs px-2 py-px rounded-full"
                  >
                    +{getDurationText(note.timeTakenFrom, note.timeTakenTo)}
                  </span>
                {/if}
              </div>
              {#if note.content}
                <p
                  class="text-sm text-tx-dim whitespace-pre-wrap leading-relaxed"
                >
                  {note.content}
                </p>
              {/if}
              {#if note.attachments && note.attachments.length > 0}
                <div class="flex flex-col gap-1.5 {note.content ? 'pt-2' : ''}">
                  {#each note.attachments as file (file.name + file.size)}
                    <span
                      class="inline-flex items-center gap-2 w-fit max-w-full pl-2.5 pr-3 py-1.5 rounded-md
                             bg-s3 border border-bd text-xs text-tx-dim"
                    >
                      <Paperclip class="w-3.5 h-3.5 shrink-0 text-tx-faint" />
                      <span class="truncate font-mono">{file.name}</span>
                      <span class="text-tx-faint font-mono shrink-0">
                        {formatFileSize(file.size)}
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
                    class="bg-s3 text-tx-dim border border-bd text-2xs font-medium rounded-md px-1.75 py-px"
                  >
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
