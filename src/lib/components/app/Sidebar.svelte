<script lang="ts">
  import { page } from "$app/state";
  import type { Route } from "../../constants/routes";
  import { routes, settingsRoute } from "../../constants/routes";

  const isActive = (route: Route) => {
    if (route.path === "/") {
      return page.url.pathname === "/";
    }

    return page.url.pathname.startsWith(route.path);
  };
</script>

<div class="w-12 h-full shrink-0">
  <div
    class="island rounded-2xl w-full h-full px-2 py-4 flex flex-col justify-between items-center">
    <div class="flex flex-col items-center gap-2 w-full">
      {#each routes as route}
        {@render navLink(route)}
      {/each}
    </div>
    <div class="w-full flex flex-col items-center gap-2">
      <div class="w-6 h-px bg-bd-dim my-1"></div>
      {@render navLink(settingsRoute)}
    </div>
  </div>
</div>

{#snippet navLink(route: Route)}
  <a
    class="w-full aspect-square rounded-xl flex items-center justify-center relative transition-all duration-200
           {isActive(route)
      ? 'bg-ac-br text-s0'
      : 'text-tx-faint hover:bg-s2 hover:text-tx-dim'}"
    href={route.path}
    title={route.label}>
    <route.icon class="w-5 h-5" />
  </a>
{/snippet}
