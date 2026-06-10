<script lang="ts">
  import { Folder, FolderOpen, Clock } from "@lucide/svelte";
  import { blur } from "svelte/transition";

  let programLocation = $state("/usr/local/bin/time-tracker");
  let workStart = $state("08:00");
  let workEnd = $state("17:00");
  let lunchStart = $state("12:00");
  let lunchEnd = $state("13:00");
  let minWorkHours = $state("08:00");
  let notifyQuotaUnmet = $state(true);
  let allowOverlappingNotes = $state(false);
  let onStartPage = $state("last-session"); // "last-session" | "specific-page"
  let specificPageSelection = $state("dashboard");

  function selectLocation() {}

  function openInExplorer() {}

  function saveSettings() {}
</script>

<div class="island w-full h-full p-5 flex flex-col gap-4 overflow-y-auto">
  <div class="flex items-center justify-between pb-2 border-b border-bd-dim shrink-0">
    <div>
      <h1 class="text-2xl font-semibold font-sans text-tx tracking-tight">
        Settings
      </h1>
      <p class="text-sm text-tx-dim mt-1">
        Preferences and configuration
      </p>
    </div>
    <button
      onclick={saveSettings}
      class="btn-primary px-4 py-2 cursor-pointer shadow-md">
      Save Changes
    </button>
  </div>

  <div class="flex flex-wrap gap-5 flex-1 min-h-0 max-w-3xl">
    <div class="flex flex-col gap-2">
      <h2 class="section-label px-1">
        Storage & Startup
      </h2>
      <div class="stat-sheet">
        <div class="stat-row flex-col sm:flex-row sm:items-center items-start gap-3">
          <div class="flex-1 min-w-0">
            <span class="text-sm font-medium text-tx block">
              Program Location
            </span>
            <span class="text-2xs text-tx-faint block mt-0.5">
              Absolute file system location for program logs, assets and
              database
            </span>
          </div>
          <div class="flex items-center gap-2 w-full sm:w-auto mt-1 sm:mt-0">
            <input
              type="text"
              bind:value={programLocation}
              class="input-field px-3 py-1.5 font-mono text-xs w-full sm:w-64"
              readonly
            />
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
            <span class="text-sm font-medium text-tx block">
              Start Program
            </span>
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
                name="startupPage"
                value="last-session"
                bind:group={onStartPage}
                class="accent-ac-br mt-0.5"
              />
              <div class="min-w-0">
                <span class="text-xs font-semibold text-tx block">
                  Last Session
                </span>
                <span class="text-2xs text-tx-faint block mt-0.5">
                  Opens last session you were in when the program was last
                  closed
                </span>
              </div>
            </label>

            <label
              class="flex items-start gap-3 p-3 rounded-xl border bg-s2/40 cursor-pointer select-none transition-colors duration-150"
              class:border-ac-bd={onStartPage === "specific-page"}
              class:border-bd-dim={onStartPage !== "specific-page"}>
              <input
                type="radio"
                name="startupPage"
                value="specific-page"
                bind:group={onStartPage}
                class="accent-ac-br mt-0.5"
              />
              <div class="min-w-0 w-full">
                <span class="text-xs font-semibold text-tx block">
                  Specific Page
                </span>
                <span class="text-2xs text-tx-faint block mt-0.5">
                  Opens a specific page when the program starts
                </span>

                {#if onStartPage === "specific-page"}
                  <div class="mt-2" transition:blur={{ duration: 100 }}>
                    <select
                      bind:value={specificPageSelection}
                      class="input-field text-2xs py-1 px-2 bg-s3 border-bd-str font-medium w-full focus:ring-0">
                      <option value="dashboard">
                        Home
                      </option>
                      <option value="timeline">
                        Projects
                      </option>
                      <option value="analytics">
                        Calendar
                      </option>
                    </select>
                  </div>
                {/if}
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <h2 class="section-label px-1">
        Work Hours
      </h2>
      <div class="stat-sheet">
        <div class="stat-row">
          <div class="flex-1">
            <span class="text-sm font-medium text-tx block">
              Work Shift
            </span>
            <span class="text-2xs text-tx-faint block mt-0.5">
              Define your work start and completion times
            </span>
          </div>
          <div class="inline-flex items-center gap-3 bg-s2 p-1.5 rounded-xl border border-bd-dim select-none">
            <Clock class="w-3.5 h-3.5 text-tx-faint" />
            <div class="flex items-center gap-1.5 pl-1">
              <span class="text-xs font-medium text-tx-faint">
                From
              </span>
              <input
                type="text"
                maxlength="5"
                placeholder="09:00"
                bind:value={workStart}
                class="w-14 px-1.5 py-0.5 text-center font-mono text-xs rounded-lg border border-bd bg-s3 text-tx placeholder:text-tx-faint focus:outline-none focus:border-ac-br focus:shadow-[0_0_0_2px_var(--color-ac-bg)] transition-colors"
              />
            </div>
            <span class="text-tx-faint text-xs">→</span>
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-medium text-tx-faint">
                To
              </span>
              <input
                type="text"
                maxlength="5"
                placeholder="17:00"
                bind:value={workEnd}
                class="w-14 px-1.5 py-0.5 text-center font-mono text-xs rounded-lg border border-bd bg-s3 text-tx placeholder:text-tx-faint focus:outline-none focus:border-ac-br focus:shadow-[0_0_0_2px_var(--color-ac-bg)] transition-colors"
              />
            </div>
          </div>
        </div>

        <div class="stat-row">
          <div class="flex-1">
            <span class="text-sm font-medium text-tx block">
              Lunch Break
            </span>
            <span class="text-2xs text-tx-faint block mt-0.5">
              Time of your lunch break within work day
            </span>
          </div>
          <div class="inline-flex items-center gap-3 bg-s2 p-1.5 rounded-xl border border-bd-dim select-none">
            <Clock class="w-3.5 h-3.5 text-tx-faint" />
            <div class="flex items-center gap-1.5 pl-1">
              <span class="text-xs font-medium text-tx-faint">
                From
              </span>
              <input
                type="text"
                maxlength="5"
                placeholder="12:00"
                bind:value={lunchStart}
                class="w-14 px-1.5 py-0.5 text-center font-mono text-xs rounded-lg border border-bd bg-s3 text-tx placeholder:text-tx-faint focus:outline-none focus:border-ac-br focus:shadow-[0_0_0_2px_var(--color-ac-bg)] transition-colors"
              />
            </div>
            <span class="text-tx-faint text-xs">→</span>
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-medium text-tx-faint">
                To
              </span>
              <input
                type="text"
                maxlength="5"
                placeholder="13:00"
                bind:value={lunchEnd}
                class="w-14 px-1.5 py-0.5 text-center font-mono text-xs rounded-lg border border-bd bg-s3 text-tx placeholder:text-tx-faint focus:outline-none focus:border-ac-br focus:shadow-[0_0_0_2px_var(--color-ac-bg)] transition-colors"
              />
            </div>
          </div>
        </div>

        <div class="stat-row">
          <div class="flex-1">
            <span class="text-sm font-medium text-tx block">
              Minimum Work Hours
            </span>
            <span class="text-2xs text-tx-faint block mt-0.5">
              Minimum quota you must work per day
            </span>
          </div>
          <div class="inline-flex items-center gap-2 bg-s2 p-1.5 rounded-xl border border-bd-dim select-none">
            <div class="flex items-center gap-1.5 pl-1">
              <Clock class="w-3.5 h-3.5 text-tx-faint mr-0.5" />
              <input
                type="text"
                maxlength="5"
                placeholder="08:00"
                bind:value={minWorkHours}
                class="w-14 px-1.5 py-0.5 text-center font-mono text-xs rounded-lg border border-bd bg-s3 text-tx placeholder:text-tx-faint focus:outline-none focus:border-ac-br focus:shadow-[0_0_0_2px_var(--color-ac-bg)] transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <h2 class="section-label px-1">
        Rules & Validation
      </h2>
      <div class="stat-sheet">
        <label class="stat-row cursor-pointer select-none">
          <div class="flex-1 pr-4">
            <span class="text-sm font-medium text-tx flex items-center gap-2">
              Alert On Unmet Minimum Work Hours Quota
            </span>
            <span class="text-2xs text-tx-faint block mt-0.5">
              Receive notifications when you haven't met your minimum work
              hours at the end of the day
            </span>
          </div>
          <div class="relative inline-flex items-center">
            <input
              type="checkbox"
              bind:checked={notifyQuotaUnmet}
              class="sr-only peer"
            />
            <div class="w-9 h-5 bg-s4 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-tx-dim peer-checked:after:bg-s0 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-ac-br"></div>
          </div>
        </label>

        <label class="stat-row cursor-pointer select-none">
          <div class="flex-1 pr-4">
            <span class="text-sm font-medium text-tx">
              Disallow Overlapping Notes Timestamps
            </span>
            <span class="text-2xs text-tx-faint block mt-0.5">
              When checked, overlapping note timestamps will be disallowed
              within projects
            </span>
          </div>
          <div class="relative inline-flex items-center">
            <input
              type="checkbox"
              bind:checked={allowOverlappingNotes}
              class="sr-only peer"
            />
            <div class="w-9 h-5 bg-s4 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-tx-dim peer-checked:after:bg-s0 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-ac-br"></div>
          </div>
        </label>
      </div>
    </div>
  </div>
</div>
