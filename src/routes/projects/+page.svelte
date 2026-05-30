<script lang="ts">
    import { Pin } from "@lucide/svelte";

  let projects = [
    { label: "Project 1" , isPinned: true},
    { label: "Project 2" , isPinned: false},
    { label: "Project 3" , isPinned: false},
  ]
</script>

<div class="h-full w-full flex flex-col gap-4">
    <header class="h-fit w-full">
        <h1 class="text-2xl font-bold">Projects</h1>
    </header>
    <div class="flex flex-row gap-4 h-full">
        <div class="flex flex-col gap-4 w-48 h-full p-2 rounded-lg bg-gray-100">
            <input type="text" placeholder="Search..." class="w-full border border-gray-200 rounded-md py-1 px-2 focus:outline-none" />
            <ul class="flex flex-col h-full gap-0.5">
                {#each projects as project}
                    <li class="p-1.5 rounded-md border-b border-gray-200 hover:bg-gray-200 cursor-pointer flex flex-row justify-between items-center">
                        {project.label}

                        {#if project.isPinned}
                            <Pin class="w-4 h-4" />
                        {/if}
                    </li>
                {/each}
            </ul>
            <button class="w-full p-1 rounded-md border-b border-gray-200 hover:bg-gray-200 cursor-pointer">
                New Project
            </button>
        </div>
        <div class="h-full w-full bg-gray-100 p-2 rounded-lg">
            ...
        </div>
    </div>
</div>