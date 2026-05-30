<script lang="ts">
    import { page } from "$app/state";
    import { routes, settingsRoute } from "../../constants/routes";
    import type { Route } from "../../constants/routes";

    const isActive = (route: Route) => {
        return page.url.pathname === route.path;
    }
</script>

<div class="w-14 flex flex-col gap-6 py-1 pl-1 h-full">
    <div class="w-full h-full px-4 py-3 flex flex-col justify-between rounded-lg bg-gray-100">
        <div class="w-full h-full items-center flex flex-col gap-6">
            {#each routes as route}
                {@render routeComponent(route)}
            {/each}
        </div>
    </div>

    <div class="w-full px-4 py-3 flex flex-col items-center rounded-lg bg-gray-100">
        {@render routeComponent(settingsRoute)}
    </div>
</div>

{#snippet routeComponent(route: Route)}
    <a class={"p-2 rounded-md text-xs flex flex-wrap items-center justify-center hover:bg-gray-200 " + (isActive(route) ? "bg-gray-200 font-bold" : "")} href={route.path} title={route.label}>
        <route.icon class="w-6 h-6" />
    </a>
{/snippet}