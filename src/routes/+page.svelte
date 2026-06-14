<script lang="ts">
  import MonthlyStats from "$lib/components/home/MonthlyStats.svelte";
  import RecentProjects from "$lib/components/home/RecentProjects.svelte";
  import TodayOverview from "$lib/components/home/TodayOverview.svelte";
  import TodayTimeline from "$lib/components/home/TodayTimeline.svelte";
  import instance from "$lib/stores/projectStore.svelte";
  import TimeUtils from "$lib/utils/time";

  const liveTime = TimeUtils.getLiveTime();

  const LUNCH_START = { h: 12, m: 0 };
  const WORK_END = { h: 17, m: 30 };
  const WORK_HOURS_TARGET = 8;

  const todayLoggedMinutes = 320;
  const todayEntries = [
    {
      label: "Website redesign session",
      projectColor: "#534AB7",
      from: "09:00",
      to: "10:30",
      minutes: 90,
    },
    {
      label: "API integration - auth module",
      projectColor: "#0F6E56",
      from: "10:45",
      to: "12:15",
      minutes: 90,
    },
    {
      label: "Client report - Q2 summary",
      projectColor: "#BA7517",
      from: "13:00",
      to: "14:20",
      minutes: 80,
    },
    {
      label: "Website redesign - component pass",
      projectColor: "#534AB7",
      from: "14:30",
      to: "15:30",
      minutes: 60,
    },
  ];

  const monthlyStats = {
    totalMinutes: 3860,
    targetHours: 160,
    workingDaysTotal: 22,
    workingDaysActive: 10,
    dailyBars: [7.5, 8.1, 6.2, 0, 0, 7.8, 8.3, 5.9, 7.1, 6.8, 8.0, 5.3],
    byProject: [
      { label: "Website Redesign", color: "#534AB7", minutes: 1720 },
      { label: "API Integration", color: "#0F6E56", minutes: 975 },
      { label: "Q2 Client Report", color: "#BA7517", minutes: 680 },
      { label: "Internal Tooling", color: "#888780", minutes: 485 },
    ],
  };

  let statsDate = $state(new Date());

  function handleMonthChange(newDate: Date): void {
    statsDate = newDate;
  }
</script>

<div class="flex-1 h-full overflow-y-auto p-5 flex flex-col gap-6 min-h-0">
  <header class="flex items-center justify-between">
    <div class="flex flex-col gap-0.5">
      <h1 class="text-xl font-semibold text-tx tracking-tight">Good morning</h1>
      <p class="text-sm text-tx-dim">
        {new Date().toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
    </div>
    <div
      class="flex items-center gap-2 font-mono text-base font-medium text-tx">
      <i class="ti ti-clock text-tx-faint text-sm" aria-hidden="true"></i>
      {$liveTime}
    </div>
  </header>

  <section>
    <p class="section-label mb-3">Today</p>
    <div class="island p-4 flex flex-col gap-4">
      <TodayOverview
        loggedMinutes={todayLoggedMinutes}
        targetHours={WORK_HOURS_TARGET}
        lunchTime={LUNCH_START}
        workEndTime={WORK_END} />
      <hr class="border-none border-t border-bd-dim" />
      <TodayTimeline
        entries={todayEntries}
        loggedMinutes={todayLoggedMinutes}
        targetHours={WORK_HOURS_TARGET} />
    </div>
  </section>

  <section>
    <p class="section-label mb-3">Recent projects</p>
    <div class="island p-4">
      {#await instance.recentlyUsedProjects(5)}
        <div
          class="flex items-center justify-center py-6 text-sm text-tx-faint">
          <span class="animate-pulse">Loading recent projects...</span>
        </div>
      {:then liveRecentProjects}
        {#if liveRecentProjects && liveRecentProjects.length > 0}
          <RecentProjects projects={liveRecentProjects} />
        {:else}
          <div class="text-center py-6 text-sm text-tx-faint">
            No recently used projects found.
          </div>
        {/if}
      {:catch error}
        <div class="text-center py-6 text-sm text-error">
          Failed to load recent projects.
        </div>
      {/await}
    </div>
  </section>

  <section>
    <p class="section-label mb-3">Monthly stats</p>
    <div class="island p-4">
      <MonthlyStats
        stats={monthlyStats}
        currentDate={statsDate}
        onMonthChange={handleMonthChange} />
    </div>
  </section>
</div>
