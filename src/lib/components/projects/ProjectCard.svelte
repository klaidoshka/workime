<script lang="ts">
  import { DEFAULT_COLOR, DEFAULT_ICON } from "$lib/constants/projects";
  import type { Project } from "$lib/representation/project";
  import instance from "$lib/stores/projectStore.svelte";
  import { Pin } from "@lucide/svelte";
  import { getProjectIconAndColor } from "./project/iconColorPicker/IconColorPicker";
  import IconColorPicker from "./project/iconColorPicker/IconColorPicker.svelte";

  let { project }: { project: Project } = $props();
  let showPicker = $state(false);
  let triggerBtn = $state() as HTMLButtonElement;

  const { IconComp, colorValue } = $derived(getProjectIconAndColor(project));

  let pickerPos = $state({ top: 0, left: 0 });

  function handleIconColorChange(icon: string, color: string) {
    instance.updateIconAndColor(project.id, icon, color);
  }

  function togglePicker(e: MouseEvent) {
    e.stopPropagation();

    const rect = triggerBtn.getBoundingClientRect();

    pickerPos = {
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX,
    };
    showPicker = true;
  }

  function portal(node: HTMLElement) {
    document.body.appendChild(node);

    return {
      destroy() {
        node.remove();
      },
    };
  }
</script>

<div class="relative w-full group">
  <div
    class="w-full p-2 text-sm flex items-center gap-2 rounded-xl border
           transition-[background-color,color,border-color] duration-100
           {instance.selectedId === project.id
      ? 'bg-s2 text-tx border-bd font-medium'
      : 'text-tx-dim border-transparent hover:bg-s2 hover:text-tx'}">
    {#if instance.selectedId === project.id}
      <span
        class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-ac-br rounded-r-full">
      </span>
    {/if}
    <button
      bind:this={triggerBtn}
      type="button"
      onclick={togglePicker}
      class="shrink-0 w-6 h-6 rounded-md flex items-center justify-center
             transition-opacity duration-100 hover:opacity-75 focus:outline-none"
      style="background-color: {colorValue}20; color: {colorValue}">
      <IconComp class="w-3.5 h-3.5" />
    </button>
    <button
      type="button"
      onclick={() => (instance.selectedId = project.id)}
      class="flex-1 min-w-0 text-left truncate pr-6 focus:outline-none">
      {project.label}
    </button>
  </div>

  <button
    type="button"
    class="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded transition-all z-10
           {project.pinned
      ? 'opacity-100 text-ac-br'
      : 'opacity-0 group-hover:opacity-100 text-tx-faint'}"
    onclick={() => instance.togglePin(project.id)}>
    <Pin class="w-3.5 h-3.5 fill-current" />
  </button>

  {#if showPicker}
    <div
      use:portal
      class="absolute z-9999"
      style="top: {pickerPos.top}px; left: {pickerPos.left}px;">
      <IconColorPicker
        icon={project.icon ?? DEFAULT_ICON}
        color={project.color ?? DEFAULT_COLOR}
        onchange={handleIconColorChange}
        onclose={() => (showPicker = false)} />
    </div>
  {/if}
</div>
