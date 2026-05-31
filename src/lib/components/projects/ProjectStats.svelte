<script lang="ts">
    import { ChartBar } from "@lucide/svelte";
    import type { Project } from "$lib/representation/project";
    import type { Note } from "$lib/representation/note";
    import instance from "$lib/stores/ProjectStore.svelte";

    let props: {
        project: Project;
        notes: Note[];
    } = $props();

    const stats = $derived.by(() => {
        let totalMinutes = 0;

        props.notes.forEach((n) => {
            if (n.timeTakenFrom !== undefined && n.timeTakenTo !== undefined) {
                let diff = n.timeTakenTo - n.timeTakenFrom;
                if (diff < 0) diff += 24 * 60;
                totalMinutes += diff;
            }
        });

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const totalFormatted = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

        let daysActive = 0;

        if (props.project) {
            const start = new Date(props.project.createdAt).getTime();

            const end = props.project.finished
                ? new Date(props.project.modifiedAt).getTime()
                : new Date().getTime();

            const diffTime = Math.max(0, end - start);

            daysActive = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        const targetHours = props.project.expectedFinishHours ?? 0;
        const loggedHoursTotal = totalMinutes / 60;

        const progressPercentage =
            targetHours > 0
                ? Math.max(
                      0,
                      Math.round((loggedHoursTotal / targetHours) * 100),
                  )
                : 0;

        return {
            totalFormatted,
            hasData: totalMinutes > 0,
            count: props.notes.length,
            daysActive,
            progressPercentage,
            targetHours,
        };
    });

    function handleExpectedHoursInput(e: Event) {
        const hours = parseFloat((e.target as HTMLInputElement).value) || 0;

        instance.updateExpectedHours(props.project.id, hours);
    }
</script>

<div
    class="bg-gray-100/80 border border-gray-200/50 p-3 rounded-xl flex flex-col gap-2.5"
>
    <div class="flex items-center gap-2 text-gray-400 px-1">
        <ChartBar class="w-4 h-4" />
        <h2 class="text-xs font-bold uppercase tracking-wider">
            Time Dashboard
        </h2>
    </div>

    <div class="flex flex-col gap-2">
        <div
            class="bg-white border border-gray-200/60 p-3 rounded-lg shadow-sm flex flex-col gap-2"
        >
            <div class="flex items-center justify-between">
                <span
                    class="text-[10px] uppercase font-bold text-gray-400 tracking-wide"
                    >Expected Budget</span
                >
                <div class="flex items-center gap-1 font-mono text-xs">
                    <input
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="0"
                        value={stats.targetHours || ""}
                        oninput={handleExpectedHoursInput}
                        class="w-16 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 text-center text-gray-700 font-bold focus:outline-none"
                    />
                    <span class="text-gray-400 font-sans">hours</span>
                </div>
            </div>

            {#if stats.targetHours > 0}
                <div class="flex flex-col gap-1 mt-0.5">
                    <div
                        class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden"
                    >
                        <div
                            class="h-1.5 rounded-full transition-all duration-300 max-w-full
                                    {stats.progressPercentage > 125
                                ? 'bg-red-500'
                                : stats.progressPercentage > 100
                                  ? 'bg-orange-500'
                                  : 'bg-emerald-500'}"
                            style="width: {stats.progressPercentage}%"
                        ></div>
                    </div>
                    <div
                        class="flex justify-between items-center text-[10px] font-bold text-gray-400 font-mono"
                    >
                        <span>Usage Target</span>
                        <span
                            class={stats.progressPercentage > 125
                                ? "text-red-500"
                                : stats.progressPercentage > 100
                                  ? "text-orange-500"
                                  : "text-emerald-600"}
                        >
                            {stats.progressPercentage}%
                        </span>
                    </div>
                </div>
            {/if}
        </div>

        <div
            class="bg-white border border-gray-200/60 p-3 rounded-lg shadow-sm flex items-center justify-between"
        >
            <div class="flex flex-col gap-0.5">
                <span
                    class="text-[10px] uppercase font-bold text-gray-400 tracking-wide"
                    >Project Lifespan</span
                >
                <span class="text-base font-bold font-mono text-gray-800">
                    {stats.daysActive}
                    {stats.daysActive === 1 ? "Day" : "Days"}
                </span>
            </div>
            <span
                class="text-xs px-2 py-0.5 font-medium rounded-full {props
                    .project.finished
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-emerald-50 text-emerald-600 animate-pulse'}"
            >
                {props.project.finished ? "Finished" : "Active"}
            </span>
        </div>

        <div class="grid grid-cols-2 gap-2">
            <div
                class="bg-white border border-gray-200/60 p-3 rounded-lg shadow-sm flex flex-col gap-0.5"
            >
                <span
                    class="text-[10px] uppercase font-bold text-gray-400 tracking-wide"
                    >Time Logged</span
                >
                <span class="text-base font-bold font-mono text-gray-800"
                    >{stats.totalFormatted}</span
                >
            </div>
            <div
                class="bg-white border border-gray-200/60 p-3 rounded-lg shadow-sm flex flex-col gap-0.5"
            >
                <span
                    class="text-[10px] uppercase font-bold text-gray-400 tracking-wide"
                    >Notes Count</span
                >
                <span class="text-base font-bold font-mono text-gray-800"
                    >{stats.count}</span
                >
            </div>
        </div>
    </div>
</div>
