<script lang="ts">
  import jsonStateStore from "$lib/stores/jsonStateStore.svelte";
  import projectStore from "$lib/stores/projectStore.svelte";
  import Sidebar from "../lib/components/app/Sidebar.svelte";

  let { children } = $props();

  // Initialize stores
  jsonStateStore.init();

  projectStore.init();

  let isLoading = $derived(jsonStateStore.isLoading);
</script>

<div
  class="flex flex-row h-screen w-screen antialiased overflow-hidden select-none bg-s0 text-tx p-3 gap-3">
  <Sidebar />
  <main class="flex-1 h-full overflow-hidden">
    {#if isLoading}
      <div class="w-full h-full flex items-center justify-center">
        <p class="text-tx-dim text-sm">Loading...</p>
      </div>
    {:else}
      {@render children()}
    {/if}
  </main>
</div>
