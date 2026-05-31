<script lang="ts">
  import type { Project } from "$lib/representation/project";
  import instance from "$lib/stores/projectStore.svelte";
  import { Search } from "@lucide/svelte";

  let {
    noteSearch = $bindable(),
    ...props
  }: {
    noteSearch: string;
    project: Project;
  } = $props();
</script>

<div
  class="island w-full p-3 flex items-center justify-between animate-fade-in">
  <div class="flex items-center gap-3">
    <h1 class="text-lg font-semibold font-sans text-tx tracking-tight">
      {props.project.label}
    </h1>
    <button
      type="button"
      onclick={() => instance.toggleProjectFinished(props.project.id)}
      class="cursor-pointer select-none rounded-full text-xs font-semibold px-2.5 py-0.5 transition-all
             {props.project.finished
        ? 'bg-s3 text-tx-dim border border-bd'
        : 'bg-ac-br text-s0 border border-transparent hover:bg-ac'}">
      {props.project.finished ? "Completed" : "Active"}
    </button>
  </div>
  <div class="relative w-60">
    <Search class="w-3.5 h-3.5 absolute left-2.5 top-2 text-tx-faint" />
    <input
      type="text"
      placeholder="Search notes…"
      bind:value={noteSearch}
      class="w-full py-1.5 pl-8 pr-3 text-sm input-field" />
  </div>
</div>
