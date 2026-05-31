<script lang="ts">
    import Sidebar from "../lib/components/app/Sidebar.svelte";
    let { children } = $props();
</script>

<div class="flex flex-row h-screen w-screen bg-white text-gray-800 antialiased overflow-hidden select-none">
    <Sidebar />

    <main class="flex-1 h-full p-4 overflow-hidden">
        {@render children() }
    </main>
</div>