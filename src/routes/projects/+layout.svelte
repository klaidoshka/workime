<script lang="ts">
    import { Search, Pin } from "@lucide/svelte";
    import instance from "$lib/stores/ProjectStore.svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import ProjectCard from "$lib/components/projects/ProjectCard.svelte";

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

            if (newId) {
                instance.selectedId = newId;
            }
        }
    }
</script>

<div class="h-full w-full flex flex-row gap-4 overflow-hidden bg-white">
    <div
        class="flex flex-col w-64 h-full p-3 rounded-xl bg-gray-100/80 border border-gray-200/50 justify-between shrink-0"
    >
        <div class="flex flex-col gap-3 overflow-hidden">
            <h2
                class="text-xs font-bold uppercase tracking-wider text-gray-400 px-1"
            >
                Projects
            </h2>

            <div class="relative">
                <Search
                    class="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400"
                />
                <input
                    placeholder="Search Projects..."
                    bind:value={projectSearch}
                    class="w-full text-sm border border-gray-200 rounded-lg py-1.5 pl-8 pr-2 focus:outline-none focus:ring-1 focus:ring-gray-300 bg-white"
                />
            </div>

            <div class="flex flex-col gap-1 overflow-y-auto pr-1">
                {#each filteredProjects as project (project.id)}
                    <ProjectCard {project} />
                {/each}
            </div>
        </div>

        <button
            onclick={createNewProject}
            class="w-full mt-2 py-2 px-3 rounded-lg border border-dashed border-gray-300 hover:border-gray-400 hover:bg-white text-sm font-medium text-gray-600 transition-all cursor-pointer text-center"
        >
            + New Project
        </button>
    </div>

    <div class="flex-1 h-full flex flex-row gap-4 overflow-hidden">
        {@render children()}
    </div>
</div>
