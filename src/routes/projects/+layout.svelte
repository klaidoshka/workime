<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import ProjectCard from "$lib/components/projects/ProjectCard.svelte";
  import instance from "$lib/stores/ProjectStore.svelte";
  import { Search } from "@lucide/svelte";

  let { children } = $props();
  let projectSearch = $state("");

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

  function createNewProject() {
    const name = prompt("Enter project name:");
    if (name) {
      const newId = instance.add(name);
      if (newId) instance.selectedId = newId;
    }
  }
</script>

<div class="h-full w-full flex flex-row gap-3 overflow-hidden">
  <div class="island flex flex-col w-60 h-full p-3 shrink-0 overflow-hidden">
    <h2 class="section-label px-1 shrink-0">Projects</h2>
    <div class="relative mt-3 shrink-0">
      <Search class="w-3.5 h-3.5 absolute left-2.5 top-2 text-tx-faint" />
      <input
        placeholder="Search projects…"
        bind:value={projectSearch}
        class="w-full py-1.5 pl-8 pr-2 text-sm input-field" />
    </div>
    <div
      class="flex flex-col gap-0.5 overflow-y-auto flex-1 min-h-0 mt-3 pr-0.5">
      {#each filteredProjects as project (project.id)}
        <ProjectCard {project} />
      {/each}
    </div>
    <button
      onclick={createNewProject}
      class="w-full mt-2 py-1.5 px-3 rounded-lg border border-dashed border-bd bg-transparent cursor-pointer shrink-0
             text-sm font-medium text-tx-faint text-center
             hover:border-ac-bd hover:text-ac-br hover:bg-s2
             transition-[border-color,color,background-color] duration-150">
      + New Project
    </button>
  </div>
  <div class="flex-1 h-full flex flex-row gap-3 overflow-hidden">
    {@render children()}
  </div>
</div>
