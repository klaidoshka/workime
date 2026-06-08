<script lang="ts">
  import { goto } from "$app/navigation";
  import { DEFAULT_COLOR, DEFAULT_ICON } from "$lib/constants/projects";
  import type { Project } from "$lib/representation/project";
  import instance from "$lib/stores/projectStore.svelte";
  import { portal } from "$lib/utils/ui";
  import { EllipsisVertical, Pin } from "@lucide/svelte";
  import { tick } from "svelte";
  import ConfirmDialog from "../common/ConfirmDialog.svelte";
  import ContextMenu from "../common/ContextMenu.svelte";
  import { getProjectIconAndColor } from "./project/iconColorPicker/IconColorPicker";
  import IconColorPicker from "./project/iconColorPicker/IconColorPicker.svelte";

  let { project }: { project: Project } = $props();

  let showPicker = $state(false);
  let showContextMenu = $state(false);
  let showDeleteConfirm = $state(false);
  let isEditingName = $state(false);
  let editNameValue = $derived(project.label);

  let triggerButton = $state() as HTMLButtonElement;
  let menuButton = $state() as HTMLButtonElement;
  let inputElement = $state() as HTMLInputElement;

  const { IconComp, colorValue } = $derived(getProjectIconAndColor(project));

  let pickerPos = $state({ top: 0, left: 0 });
  let dropdownPos = $state({ top: 0, left: 0 });

  function handleIconColorChange(icon: string, color: string) {
    instance.updateIconAndColor(project.id, icon, color);
  }

  function togglePicker(e: MouseEvent) {
    e.stopPropagation();

    const rect = triggerButton.getBoundingClientRect();

    pickerPos = {
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX,
    };

    showPicker = true;
    showContextMenu = false;
  }

  function toggleDropdown(e: MouseEvent) {
    e.stopPropagation();

    const rect = menuButton.getBoundingClientRect();

    dropdownPos = {
      top: rect.bottom + window.scrollY + 6,
      left: rect.right + window.scrollX - 160,
    };

    showContextMenu = !showContextMenu;
    showPicker = false;
  }

  async function startRename() {
    showContextMenu = false;
    editNameValue = project.label;
    isEditingName = true;

    await tick();

    inputElement?.focus();
    inputElement?.select();
  }

  function saveRename() {
    if (!isEditingName) {
      return;
    }

    const trimmed = editNameValue.trim();

    if (trimmed && trimmed !== project.label) {
      instance.updateLabel(project.id, trimmed);
    }

    isEditingName = false;
  }

  function cancelRename() {
    isEditingName = false;
  }

  function showDeleteDialog() {
    showContextMenu = false;
    showDeleteConfirm = true;
  }

  function executeDeletion() {
    instance.delete(project.id).then(() => {
      if (instance.projects.length === 0) {
        goto("/projects");
      }
    });
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
        class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-ac-br rounded-r-full"
      ></span>
    {/if}

    <button
      bind:this={triggerButton}
      type="button"
      onclick={togglePicker}
      class="shrink-0 w-6 h-6 rounded-md flex items-center justify-center
             transition-opacity duration-100 hover:opacity-75 focus:outline-none"
      style="background-color: {colorValue}20; color: {colorValue}">
      <IconComp class="w-3.5 h-3.5" />
    </button>

    {#if isEditingName}
      <input
        bind:this={inputElement}
        type="text"
        bind:value={editNameValue}
        onblur={saveRename}
        onkeydown={(e) => {
          if (e.key === "Enter") {
            saveRename();
          } else if (e.key === "Escape") {
            cancelRename();
          }
        }}
        class="flex-1 min-w-0 bg-s1 border border-bd rounded px-1.5 py-0.5 text-sm text-tx focus:outline-none focus:border-ac-br" />
    {:else}
      <button
        type="button"
        onclick={() => {
          instance.selectedId = project.id;
        }}
        class="flex-1 min-w-0 text-left truncate pr-14 focus:outline-none">
        {project.label}
      </button>
    {/if}
  </div>

  <div
    class="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 z-10">
    <button
      type="button"
      class="p-1 rounded transition-all hover:bg-s3
             {project.pinned
        ? 'opacity-100 text-ac-br'
        : 'opacity-0 group-hover:opacity-100 text-tx-faint hover:text-tx'}"
      onclick={(e) => {
        e.stopPropagation();
        instance.togglePin(project.id);
      }}>
      <Pin class="w-3.5 h-3.5 {project.pinned ? 'fill-current' : ''}" />
    </button>

    <button
      bind:this={menuButton}
      type="button"
      class="p-1 rounded transition-all hover:bg-s3 opacity-0 group-hover:opacity-100 text-tx-faint hover:text-tx"
      onclick={toggleDropdown}>
      <EllipsisVertical class="w-3.5 h-3.5" />
    </button>
  </div>

  {#if showPicker}
    <div
      role="presentation"
      use:portal
      class="absolute z-9999"
      style="top: {pickerPos.top}px; left: {pickerPos.left}px;"
      onclick={(e) => {
        e.stopPropagation();
      }}>
      <IconColorPicker
        icon={project.icon ?? DEFAULT_ICON}
        color={project.color ?? DEFAULT_COLOR}
        onchange={handleIconColorChange}
        onclose={() => {
          showPicker = false;
        }} />
    </div>
  {/if}

  {#if showContextMenu}
    <ContextMenu
      top={dropdownPos.top}
      left={dropdownPos.left}
      editLabel="Rename Project"
      deleteLabel="Delete Project"
      onEdit={startRename}
      onDelete={showDeleteDialog}
      onClose={() => {
        showContextMenu = false;
      }} />
  {/if}
</div>

<ConfirmDialog
  bind:open={showDeleteConfirm}
  title="Delete Project"
  message="Are you sure you want to delete project '{project.label}'? This action is permanent and can't be undone."
  confirmLabel="Delete"
  onConfirm={executeDeletion}
  onClose={() => {
    console.log("Dismissed deletion");
  }} />
