<script lang="ts">
    import { Send } from "@lucide/svelte";
    import instance from "$lib/stores/ProjectStore.svelte";

    let props: {
        projectId: string;
    } = $props();

    let newNoteText = $state("");
    let timeFrom = $state("");
    let timeTo = $state("");

    const livePreviewSpan = $derived.by(() => {
        if (!timeFrom || !timeTo) {
            return ""
        };

        const [fromHours, fromMinutes] = timeFrom.split(":").map(Number);
        const [toHours, toMinutes] = timeTo.split(":").map(Number);
        
        let diff = toHours * 60 + toMinutes - (fromHours * 60 + fromMinutes);

        if (diff < 0) {
            diff += 24 * 60;
        }

        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;

        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    });

    function sendNote() {
        if (!newNoteText.trim()) {
            return;
        }

        instance.addNote(props.projectId, newNoteText, timeFrom, timeTo);

        newNoteText = "";
        timeFrom = "";
        timeTo = "";
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendNote();
        }
    }
</script>

<div
    class="w-full bg-gray-100/80 border border-gray-200/50 p-3 rounded-xl flex flex-col gap-2"
>
    <div class="flex gap-2 items-end w-full">
        <textarea
            rows="1"
            placeholder="Send note..."
            bind:value={newNoteText}
            onkeydown={handleKeyDown}
            class="w-full text-sm border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-gray-300 bg-white resize-none max-h-32 min-h-[38px]"
        ></textarea>

        <div
            class="flex grow items-center gap-4 text-xs text-gray-500 bg-white border border-gray-200/40 p-2 rounded-lg w-fit shadow-sm shrink-0"
        >
            <div class="flex items-center gap-1.5">
                <span>From:</span>
                <input
                    type="time"
                    bind:value={timeFrom}
                    class="bg-gray-50 border border-gray-200 rounded px-1 py-0.5 font-mono"
                />
            </div>

            <div class="flex items-center gap-1.5">
                <span>To:</span>
                <input
                    type="time"
                    bind:value={timeTo}
                    class="bg-gray-50 border border-gray-200 rounded px-1 py-0.5 font-mono"
                />
            </div>

            {#if livePreviewSpan}
                <span class="text-emerald-600 font-bold px-1 font-mono"
                    >{livePreviewSpan}</span
                >
            {/if}
        </div>

        <button
            onclick={sendNote}
            class="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg h-[38px] w-[38px] shrink-0 flex items-center justify-center"
        >
            <Send class="w-4 h-4" />
        </button>
    </div>
</div>
