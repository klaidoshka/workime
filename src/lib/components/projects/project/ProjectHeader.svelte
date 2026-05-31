<script lang="ts">
    import { Search } from "@lucide/svelte";
    import instance from "$lib/stores/ProjectStore.svelte";
    import type { Project } from "$lib/representation/project";

    let {
        noteSearch = $bindable(),
        ...props
    }: {
        noteSearch: string;
        project: Project;
    } = $props();
</script>

<div
    class="w-full bg-gray-100/80 border border-gray-200/50 p-3 rounded-xl flex items-center justify-between animate-fade-in"
>
    <div class="flex items-center gap-3">
        <h1 class="text-lg font-bold text-gray-800">{props.project.label}</h1>
        <button
            type="button"
            onclick={() => instance.toggleProjectFinished(instance.selectedId)}
            class="text-xs px-2 py-0.5 font-semibold rounded-full border transition-all cursor-pointer select-none
            {props.project.finished
                ? 'bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300'
                : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100/70'}"
        >
            {props.project.finished ? "✓ Finished" : "● Active"}
        </button>
    </div>

    <div class="relative w-64">
        <Search class="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" />
        <input
            type="text"
            placeholder="Search..."
            bind:value={noteSearch}
            class="w-full text-sm border border-gray-200 rounded-lg py-1.5 pl-8 pr-2 focus:outline-none focus:ring-1 focus:ring-gray-300 bg-white"
        />
    </div>
</div>
