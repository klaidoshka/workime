<script lang="ts">
  import type { Project } from "$lib/representation/project";
  import instance from "$lib/stores/projectStore.svelte";
  import { Pin } from "@lucide/svelte";
  let { project }: { project: Project } = $props();
</script>

<div class="relative w-full group">
  <button
    type="button"
    class="w-full text-left p-2 text-sm flex items-center pr-9 cursor-pointer focus:outline-none rounded-xl border
           transition-[background-color,color,border-color] duration-100
           {instance.selectedId === project.id
      ? 'bg-s2 text-tx border-bd font-medium'
      : 'text-tx-dim border-transparent hover:bg-s2 hover:text-tx'}"
    onclick={() => (instance.selectedId = project.id)}>
    {#if instance.selectedId === project.id}
      <span
        class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-ac-br rounded-r-full">
      </span>
    {/if}
    <span class="truncate pl-1">
      {project.label}
    </span>
  </button>

  <button
    type="button"
    class="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded transition-all z-10
           {project.pinned
      ? 'opacity-100 text-ac-br'
      : 'opacity-0 group-hover:opacity-100 text-tx-faint'}"
    onclick={() => instance.togglePin(project.id)}>
    <Pin class="w-3.5 h-3.5 fill-current" />
  </button>
</div>
