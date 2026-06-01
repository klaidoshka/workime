<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import instance from "$lib/stores/ProjectStore.svelte";
  import { Search } from "@lucide/svelte";
  import ProjectCard from "./ProjectCard.svelte";

  let projectSearch = $state("");

  let isCreating = $state(false);
  let newName = $state("");

  const filteredProjects = $derived(
    instance.projects.filter((p) =>
      p.label.toLowerCase().includes(projectSearch.toLowerCase()),
    ),
  );

  $effect(() => {
    if (instance.selectedId && page.params.slug !== instance.selectedId) {
      goto(`/projects/${instance.selectedId}`, { replaceState: true });
    }
  });

  function focusOnMount(node: HTMLInputElement) {
    node.focus();
  }

  function submitProject() {
    const trimmed = newName.trim();
    if (trimmed) {
      const newId = instance.add(trimmed);

      if (newId) {
        instance.selectedId = newId;
      }
    }
    cancelCreation();
  }

  function cancelCreation() {
    isCreating = false;
    newName = "";
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      submitProject();
    } else if (e.key === "Escape") {
      cancelCreation();
    }
  }
</script>

<div class="island flex flex-col w-60 h-full p-3 shrink-0 overflow-hidden">
  <h2 class="section-label px-1 shrink-0">Projects</h2>
  <div class="relative mt-3 shrink-0">
    <Search class="w-3.5 h-3.5 absolute left-2.5 top-2 text-tx-faint" />
    <input
      placeholder="Search projects…"
      bind:value={projectSearch}
      class="w-full py-1.5 pl-8 pr-2 text-sm input-field"
      disabled={isCreating} />
  </div>

  <div class="flex flex-col gap-0.5 overflow-y-auto flex-1 min-h-0 mt-3 pr-0.5">
    {#if isCreating}
      <div
        class="w-full p-2 text-sm flex items-center rounded-xl border border-dashed border-ac-bd bg-s2/40">
        <div class="flex-1 min-w-0 pl-0.5">
          <input
            use:focusOnMount
            type="text"
            placeholder="Project name..."
            bind:value={newName}
            onkeydown={handleKeyDown}
            onblur={submitProject}
            class="w-full bg-transparent border-0 p-0 text-sm font-medium text-tx placeholder:text-tx-faint focus:outline-none focus:ring-0" />
        </div>
      </div>
    {/if}

    {#each filteredProjects as project (project.id)}
      <ProjectCard {project} />
    {/each}
  </div>

  <button
    onclick={() => (isCreating = true)}
    disabled={isCreating}
    class="w-full mt-2 py-1.5 px-3 rounded-lg border border-dashed border-bd bg-transparent cursor-pointer shrink-0
           text-sm font-medium text-tx-faint text-center
           disabled:opacity-40 disabled:cursor-not-allowed
           hover:border-ac-bd hover:text-ac-br hover:bg-s2
           transition-[border-color,color,background-color,opacity] duration-150">
    {isCreating ? "Naming project..." : "+ New Project"}
  </button>
</div>
