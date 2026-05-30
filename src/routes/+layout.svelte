<script lang="ts">
    import Sidebar from "../lib/components/app/Sidebar.svelte";

    let { children } = $props();

</script>

<div class="flex flex-row h-screen w-screen">
    <Sidebar />

    <main class="w-full h-full p-4">
        {@render children() }
    </main>
</div>
