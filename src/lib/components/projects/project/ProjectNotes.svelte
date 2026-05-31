<script lang="ts">
    import type { Note } from "$lib/representation/note";
    import { Clock } from "@lucide/svelte";

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

    function formatMinutesToTime(totalMinutes?: number): string {
        if (totalMinutes === undefined) {
            return "";
        }

        const hours = Math.floor(totalMinutes / 60)
            .toString()
            .padStart(2, "0");

        const minutes = (totalMinutes % 60).toString().padStart(2, "0");

        return `${hours}:${minutes}`;
    }

    function getDurationText(from?: number, to?: number): string {
        if (from === undefined || to === undefined) return "";
        let diff = to - from;
        if (diff < 0) diff += 24 * 60;
        const hrs = Math.floor(diff / 60);
        const mins = diff % 60;
        return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
    }
</script>

<div
    bind:this={scrollContainer}
    class="w-full flex-1 bg-gray-100/80 border border-gray-200/50 p-4 rounded-xl overflow-y-auto"
>
    <div
        class="flex flex-col min-h-full relative pl-4 border-l-2 border-gray-200/70"
    >
        {#each props.notes as note (note.id)}
            <div class="flex items-start gap-6 relative py-3 pl-6 group">
                <div
                    class="absolute left-[-25px] top-[26px] w-4 h-4 rounded-full bg-white border-2 border-gray-400 z-10 flex items-center justify-center transition-all duration-200 group-hover:border-emerald-500 group-hover:scale-110 shrink-0 shadow-sm"
                >
                    <div
                        class="w-1.5 h-1.5 bg-gray-300 rounded-full transition-colors duration-200 group-hover:bg-emerald-500"
                    ></div>
                </div>

                <div
                    class="bg-white border border-gray-200/60 rounded-xl p-3 shadow-sm max-w-2xl flex-1 transition-all duration-200 group-hover:border-gray-300 group-hover:shadow-md flex flex-col gap-2"
                >
                    <div>
                        <div
                            class="flex items-baseline justify-between mb-1.5 border-b border-gray-100 pb-1"
                        >
                            <div class="flex items-center gap-2">
                                <span
                                    class="text-xs font-bold text-gray-400 tracking-wide"
                                    >{note.timestamp.toLocaleString()}</span
                                >
                                {#if note.timeTakenFrom !== undefined && note.timeTakenTo !== undefined}
                                    <span
                                        class="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1 font-mono"
                                    >
                                        <Clock class="w-3 h-3" />
                                        {formatMinutesToTime(
                                            note.timeTakenFrom,
                                        )} - {formatMinutesToTime(
                                            note.timeTakenTo,
                                        )}
                                    </span>
                                {/if}
                            </div>
                            {#if note.timeTakenFrom !== undefined && note.timeTakenTo !== undefined}
                                <span
                                    class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-mono"
                                >
                                    +{getDurationText(
                                        note.timeTakenFrom,
                                        note.timeTakenTo,
                                    )}
                                </span>
                            {/if}
                        </div>
                        <p
                            class="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed"
                        >
                            {note.content}
                        </p>
                    </div>

                    {#if note.tags && note.tags.length > 0}
                        <div class="flex flex-wrap gap-1.5 pt-1">
                            {#each note.tags as tag}
                                <span
                                    class="text-[11px] font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200/80 px-2 py-0.5 rounded"
                                    >#{tag}</span
                                >
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
        {:else}
            <div
                class="inset-0 flex flex-col gap-6 h-fit w-fit text-sm text-gray-400 italic pl-2 pt-2"
            >
                <span
                    >Begin your journey within this project by adding your first
                    note below! :)</span
                >
            </div>
        {/each}
    </div>
</div>
