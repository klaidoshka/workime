<script lang="ts">
  import RulesSettings from "$lib/components/settings/RulesSettings.svelte";
  import StorageStartupSettings from "$lib/components/settings/StorageStartupSettings.svelte";
  import WorktimeSettings from "$lib/components/settings/WorktimeSettings.svelte";

  let workStart = $state(new Date());
  let workEnd = $state(new Date());
  let lunchStart = $state(new Date());
  let lunchEnd = $state(new Date());
  let minWorkHours = $state(new Date());
  let allowUnmetQuota = $state(false);
  let allowOverlappingNotes = $state(false);

  function saveSettings() {}
</script>

<div class="island w-full h-full p-5 flex flex-col gap-4 overflow-y-auto">
  <div
    class="flex items-center justify-between pb-2 border-b border-bd-dim shrink-0">
    <div>
      <h1 class="text-2xl font-semibold font-sans text-tx tracking-tight">
        Settings
      </h1>
      <p class="text-sm text-tx-dim mt-1">Preferences and configuration</p>
    </div>

    <button
      onclick={saveSettings}
      class="btn-primary px-4 py-2 cursor-pointer shadow-md">
      Save Changes
    </button>
  </div>

  <div class="flex flex-wrap gap-5 flex-1 min-h-0 max-w-3xl">
    <StorageStartupSettings />

    <WorktimeSettings
      bind:workStart
      bind:workEnd
      bind:lunchStart
      bind:lunchEnd
      bind:minWorkHours />

    <RulesSettings bind:allowUnmetQuota bind:allowOverlappingNotes />
  </div>
</div>
