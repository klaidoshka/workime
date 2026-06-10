<script lang="ts">
  import { specificPageOptions } from "$lib/constants/pageOptions";
  import { Folder, FolderOpen } from "@lucide/svelte";
  import { open } from "@tauri-apps/plugin-dialog";
  import { openPath } from "@tauri-apps/plugin-opener";
  import { blur } from "svelte/transition";
  import Dropdown from "../common/Dropdown.svelte";

  let programLocation = $state("/usr/local/bin/time-tracker");
  let onStartPage = $state("last-session");
  let specificPageSelection = $state("dashboard");

  async function selectLocation() {
    try {
      const file = await open({
        multiple: false,
        directory: true,
      });

      if (file === null) {
        alert("User cancelled the dialog");
        return;
      }

      programLocation = file as string;

      alert("Selected path: " + programLocation);
    } catch (err) {
      alert("Failed to open file dialog: " + err);
    }
  }

  async function openInExplorer() {
    await openPath(programLocation);
  }
</script>

<div class="flex flex-col gap-2">
  <h2 class="section-label px-1">Storage & Startup</h2>
  <div class="stat-sheet">
    <div
      class="stat-row flex-col sm:flex-row sm:items-center items-start gap-3">
      <div class="flex-1 min-w-0">
        <span class="text-sm font-medium text-tx block">
          Program Location
        </span>
        <span class="text-2xs text-tx-faint block mt-0.5">
          Absolute file system location for program logs, assets and database
        </span>
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto mt-1 sm:mt-0">
        <input
          type="text"
          title={programLocation}
          bind:value={programLocation}
          class="input-field px-3 py-1.5 font-mono text-xs w-full sm:w-64"
          readonly />
        <button
          onclick={selectLocation}
          class="p-2 rounded-xl bg-s3 border border-bd text-tx-dim hover:text-tx hover:border-bd-str transition-colors cursor-pointer"
          title="Select Folder">
          <Folder class="w-4 h-4" />
        </button>
        <button
          onclick={openInExplorer}
          class="p-2 rounded-xl bg-s3 border border-bd text-tx-dim hover:text-tx hover:border-bd-str transition-colors cursor-pointer"
          title="Open in Explorer">
          <FolderOpen class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div class="stat-row items-start flex-col gap-3">
      <div>
        <span class="text-sm font-medium text-tx block"> Start Program </span>
        <span class="text-2xs text-tx-faint block mt-0.5">
          Upon starting program open...
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full mt-1">
        <label
          class="flex items-start gap-3 p-3 rounded-xl border bg-s2/40 cursor-pointer select-none transition-colors duration-150"
          class:border-ac-bd={onStartPage === "last-session"}
          class:border-bd-dim={onStartPage !== "last-session"}>
          <input
            type="radio"
            name="specificPage"
            value="last-session"
            bind:group={onStartPage}
            class="accent-ac-br mt-0.5" />
          <div class="min-w-0">
            <span class="text-xs font-semibold text-tx block">
              Last Session
            </span>
            <span class="text-2xs text-tx-faint block mt-0.5">
              Opens last session you were in when the program was last closed
            </span>
          </div>
        </label>

        <label
          class="flex items-start gap-3 p-3 rounded-xl border bg-s2/40 cursor-pointer select-none transition-colors duration-150"
          class:border-ac-bd={onStartPage === "specific-page"}
          class:border-bd-dim={onStartPage !== "specific-page"}>
          <input
            type="radio"
            name="specificPage"
            value="specific-page"
            bind:group={onStartPage}
            class="accent-ac-br mt-0.5" />

          <div class="min-w-0 w-full">
            <span class="text-xs font-semibold text-tx block">
              Specific Page
            </span>

            <span class="text-2xs text-tx-faint block mt-0.5">
              Opens a specific page when the program starts
            </span>

            <div class="mt-2" transition:blur={{ duration: 100 }}>
              <Dropdown
                options={specificPageOptions}
                bind:value={specificPageSelection}
                placeholder="Select Page"
                onClick={() => {
                  onStartPage = "specific-page";
                }} />
            </div>
          </div>
        </label>
      </div>
    </div>
  </div>
</div>
