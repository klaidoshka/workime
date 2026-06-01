<script lang="ts">
  import ProjectSiderbar from "$lib/components/projects/ProjectSidebar.svelte";

  let { children } = $props();
</script>

<div class="h-full w-full flex flex-row gap-3 overflow-hidden">
  <ProjectSiderbar />

  <div class="flex-1 h-full flex flex-row gap-3 overflow-hidden">
    {@render children()}
  </div>
</div>
