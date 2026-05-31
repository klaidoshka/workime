<script lang="ts">
    import { FileText } from "@lucide/svelte";
    import instance from "$lib/stores/ProjectStore.svelte";
    import type { Project } from "$lib/representation/project";

    let props: { project: Project } = $props();
</script>

<div
    class="flex-1 bg-gray-100/80 border border-gray-200/50 p-3 rounded-xl flex flex-col gap-2.5 overflow-hidden"
>
    <div class="flex items-center gap-2 text-gray-400 px-1 shrink-0">
        <FileText class="w-4 h-4" />
        <h2 class="text-xs font-bold uppercase tracking-wider">
            Project Scratchpad
        </h2>
    </div>

    <textarea
        placeholder="Type persistent details here..."
        value={props.project.scratchPad ?? ""}
        oninput={(e) =>
            instance.updateScratchpad(
                props.project.id,
                (e.target as HTMLTextAreaElement).value,
            )}
        class="w-full flex-1 p-3 text-sm border border-gray-200/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 bg-white shadow-sm resize-none leading-relaxed text-gray-700 placeholder-gray-400/70"
    ></textarea>
</div>
