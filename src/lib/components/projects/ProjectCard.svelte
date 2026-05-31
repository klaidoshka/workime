<script lang="ts">
    import { Pin } from "@lucide/svelte";
    import instance from "$lib/stores/ProjectStore.svelte";
    import type { Project } from "$lib/representation/project";

    let props: {
        project: Project;
    } = $props();

    function selectProject(id: string) {
        instance.selectedId = id;
    }
</script>

<div class="relative w-full group">
    <button
        type="button"
        class="w-full text-left p-2 rounded-lg text-sm transition-all flex flex-row items-center justify-between pr-10 cursor-pointer focus:outline-none
                            {instance.selectedId === props.project.id
            ? 'bg-white shadow-sm font-semibold border border-gray-200/60 text-gray-800'
            : 'hover:bg-gray-200/60 text-gray-600'}"
        onclick={() => selectProject(props.project.id)}
    >
        <span class="truncate">{props.project.label}</span>
    </button>

    <button
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-300/50 transition-colors z-10
                            opacity-0 group-hover:opacity-100 {props.project
            .pinned
            ? 'opacity-100 text-amber-500'
            : 'text-gray-400'}"
        onclick={() => instance.togglePin(props.project.id)}
    >
        <Pin class="w-3.5 h-3.5 fill-current" />
    </button>
</div>
