<script lang="ts">
  import ProjectSidebar from "$lib/components/projects/ProjectSidebar.svelte";

  let { children } = $props();
</script>

<div class="h-full w-full flex flex-row gap-3 overflow-hidden">
  <ProjectSidebar />

  <div class="flex-1 h-full flex flex-row gap-3 overflow-hidden">
    {@render children()}
  </div>
</div>
