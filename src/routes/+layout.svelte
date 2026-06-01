<script lang="ts">
  import Sidebar from "../lib/components/app/Sidebar.svelte";

  let { children } = $props();
</script>

<div
  class="flex flex-row h-screen w-screen antialiased overflow-hidden select-none bg-s0 text-tx p-3 gap-3">
  <Sidebar />
  <main class="flex-1 h-full overflow-hidden">
    {@render children()}
  </main>
</div>
