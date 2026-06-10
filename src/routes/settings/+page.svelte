<script lang="ts">
  import RulesSettings from "$lib/components/settings/RulesSettings.svelte";
  import StorageStartupSettings from "$lib/components/settings/StorageStartupSettings.svelte";
  import WorktimeSettings from "$lib/components/settings/WorktimeSettings.svelte";
  import { JsonStateId } from "$lib/constants/jsonStates";
  import type { SettingsJsonState } from "$lib/representation/settingsJsonState";
  import jsonStateStore from "$lib/stores/jsonStateStore.svelte";

  let settings = $state<SettingsJsonState>(
    jsonStateStore.getState<SettingsJsonState>(JsonStateId.SETTINGS),
  );

  let programLocation = $derived(settings.programLocation);
  let startupBehavior = $derived(settings.startupBehavior);
  let startupPage = $derived(settings.startupPage);
  let workStart = $derived(settings.workStart);
  let workEnd = $derived(settings.workEnd);
  let lunchStart = $derived(settings.lunchStart);
  let lunchEnd = $derived(settings.lunchEnd);

  let minWorkHours = $derived.by(() => {
    let now = new Date();

    const hours = Math.floor(settings.minWorkHours);
    const minutes = Math.round((settings.minWorkHours - hours) * 60);

    now.setHours(hours, minutes);

    return now;
  });

  let allowUnmetQuota = $derived(settings.allowUnmetQuota);
  let allowOverlappingNotes = $derived(settings.allowOverlappingNotes);

  function saveSettings() {
    jsonStateStore.setState<SettingsJsonState>(JsonStateId.SETTINGS, {
      ...settings,
      workStart,
      workEnd,
      lunchStart,
      lunchEnd,
      minWorkHours: minWorkHours.getHours() + minWorkHours.getMinutes() / 60,
      allowUnmetQuota,
      allowOverlappingNotes,
    });
  }
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
    <StorageStartupSettings
      bind:programLocation
      bind:startupBehavior
      bind:startupPage />

    <WorktimeSettings
      bind:workStart
      bind:workEnd
      bind:lunchStart
      bind:lunchEnd
      bind:minWorkHours />

    <RulesSettings bind:allowUnmetQuota bind:allowOverlappingNotes />
  </div>
</div>
