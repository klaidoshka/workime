<script lang="ts">
  import ProjectStats from "$lib/components/projects/ProjectStats.svelte";
  import ProjectHeader from "$lib/components/projects/project/ProjectHeader.svelte";
  import ProjectNotes from "$lib/components/projects/project/ProjectNotes.svelte";
  import ProjectScratchPad from "$lib/components/projects/project/ProjectScratchPad.svelte";
  import SendNote from "$lib/components/projects/project/SendNote.svelte";
  import instance from "$lib/stores/ProjectStore.svelte";

  let noteSearch = $state("");

  const filteredNotes = $derived(
    instance.currentNotes.filter((n) =>
      n.content.toLowerCase().includes(noteSearch.toLowerCase()),
    ),
  );

  const project = $derived(instance.currentProject);
</script>

{#if project}
  <div class="flex-1 h-full flex flex-col gap-3 overflow-hidden">
    <ProjectHeader {project} bind:noteSearch />
    <ProjectNotes notes={filteredNotes} />
    <SendNote projectId={project.id} />
  </div>
  <aside
    class="w-80 h-full flex flex-col gap-3 shrink-0 overflow-hidden min-h-0">
    <ProjectStats {project} notes={instance.currentNotes} />
    <ProjectScratchPad {project} />
  </aside>
{:else}
  <div
    class="flex-1 h-full flex items-center justify-center text-sm italic text-tx-faint">
    Loading project details…
  </div>
{/if}
