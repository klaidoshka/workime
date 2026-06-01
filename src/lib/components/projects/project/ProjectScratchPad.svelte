<script lang="ts">
  import type { Project } from "$lib/representation/project";
  import instance from "$lib/stores/ProjectStore.svelte";
  import { Bold, Italic, List } from "@lucide/svelte";

  let props: { project: Project } = $props();

  let text = $state("");
  let saveState = $state<"saved" | "pending">("saved");
  let textareaEl = $state<HTMLTextAreaElement | null>(null);
  let saveTimer: ReturnType<typeof setTimeout> | undefined;

  const charCount = $derived(text.length);

  $effect(() => {
    const id = props.project.id;
    void id;
    text = props.project.scratchPad ?? "";
    saveState = "saved";
  });

  function scheduleSave(value: string) {
    saveState = "pending";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      instance.updateScratchpad(props.project.id, value);
      saveState = "saved";
    }, 450);
  }

  function handleInput(e: Event) {
    const value = (e.target as HTMLTextAreaElement).value;
    text = value;
    scheduleSave(value);
  }

  function insertAtCursor(prefix: string, suffix = "") {
    const el = textareaEl;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = text.slice(start, end);
    const next =
      text.slice(0, start) + prefix + selected + suffix + text.slice(end);
    text = next;
    scheduleSave(next);

    queueMicrotask(() => {
      el.focus();
      const cursor = start + prefix.length + selected.length;
      el.setSelectionRange(cursor, cursor);
    });
  }
</script>

<section class="island flex-1 min-h-0 w-full flex flex-col overflow-hidden">
  <header
    class="flex items-center justify-between gap-2 px-4 pt-3 pb-2 shrink-0">
    <h2 class="section-label">Scratchpad</h2>
    <span class="text-2xs font-mono text-tx-faint">
      {saveState === "saved" ? "Saved" : "Saving…"}
    </span>
  </header>

  <textarea
    bind:this={textareaEl}
    placeholder="Persistent notes, context, links…"
    value={text}
    oninput={handleInput}
    class="scratch-editor"
  ></textarea>

  <footer
    class="flex items-center justify-between gap-2 px-3 py-2 border-t border-bd-dim shrink-0 bg-s2/30">
    <div class="flex items-center gap-0.5">
      <button
        type="button"
        title="Bold"
        onclick={() => insertAtCursor("**", "**")}
        class="p-1.5 rounded-lg text-tx-faint hover:text-tx hover:bg-s3/80 transition-colors">
        <Bold class="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        title="Italic"
        onclick={() => insertAtCursor("_", "_")}
        class="p-1.5 rounded-lg text-tx-faint hover:text-tx hover:bg-s3/80 transition-colors">
        <Italic class="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        title="Bullet list"
        onclick={() => insertAtCursor("\n- ")}
        class="p-1.5 rounded-lg text-tx-faint hover:text-tx hover:bg-s3/80 transition-colors">
        <List class="w-3.5 h-3.5" />
      </button>
    </div>
    <span class="text-2xs font-mono text-tx-faint tabular-nums">
      {charCount} {charCount === 1 ? "char" : "chars"}
    </span>
  </footer>
</section>
