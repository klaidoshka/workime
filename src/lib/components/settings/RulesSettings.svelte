<script lang="ts">
  import CommonSwitch from "./CommonSwitch.svelte";

  let {
    allowUnmetQuota = $bindable(),
    allowOverlappingNotes = $bindable(),
  }: {
    allowUnmetQuota: boolean;
    allowOverlappingNotes: boolean;
  } = $props();
</script>

<div class="flex flex-col gap-2">
  <h2 class="section-label px-1">Rules & Validation</h2>
  <div class="stat-sheet">
    <CommonSwitch
      title="Allow Unmeeting Minimum Work Hours"
      description="When checked, you will stop receiving notifications when you haven't met your minimum work hours at the end of the day"
      bind:value={allowUnmetQuota} />

    <CommonSwitch
      title="Allow Overlapping Notes Time"
      description="When checked, overlapping note timestamps will be allowed within projects"
      bind:value={allowOverlappingNotes} />
  </div>
</div>
