<script lang="ts">
  let {
    value = $bindable(),
    title,
    description,
  }: { title: string; description: string; value: boolean } = $props();
</script>

<label class="stat-row cursor-pointer select-none">
  <div class="flex-1 pr-4">
    <span class="text-sm font-medium text-tx">
      {title}
    </span>
    <span class="text-2xs text-tx-faint block mt-0.5">
      {description}
    </span>
  </div>
  <div class="relative inline-flex items-center">
    <input type="checkbox" bind:checked={value} class="sr-only peer" />
    <div
      class="w-9 h-5 bg-s4 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-tx-dim peer-checked:after:bg-s0 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-ac-br">
    </div>
  </div>
</label>
