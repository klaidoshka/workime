<script lang="ts">
  import type { Chart as ChartType } from "chart.js";
  import { onDestroy } from "svelte";

  let {
    bars,
    chartMode,
    currentDate,
  }: {
    bars: number[];
    chartMode: "bar" | "line";
    currentDate: Date;
  } = $props();

  const MONTHS_SHORT = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const TODAY = new Date();
  TODAY.setHours(0, 0, 0, 0);

  let canvasEl = $state<HTMLCanvasElement | null>(null);
  let chartInstance: ChartType | null = null;

  function isCurrentMonth(d: Date): boolean {
    return (
      d.getFullYear() === TODAY.getFullYear() &&
      d.getMonth() === TODAY.getMonth()
    );
  }

  function isDark(): boolean {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  function daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  async function buildChart(): Promise<void> {
    if (!canvasEl) {
      return;
    }

    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    const { Chart, registerables } = await import("chart.js");
    Chart.register(...registerables);

    const dark = isDark();
    const gridColor = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
    const textColor = dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)";
    const accentFill = dark ? "#534AB733" : "#534AB71a";
    const mon = MONTHS_SHORT[currentDate.getMonth()];
    const isCurrent = isCurrentMonth(currentDate);
    const todayIdx = isCurrent ? TODAY.getDate() - 1 : -1;
    const labels = bars.map((_, i) => {
      return `${i + 1} ${mon}`;
    });
    const barColors = bars.map((v, i) => {
      if (v === 0) {
        return dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
      }

      return i === todayIdx ? "#BA7517" : dark ? "#7F77DD" : "#8F87D5";
    });

    chartInstance = new Chart(canvasEl, {
      type: chartMode,
      data: {
        labels,
        datasets: [
          {
            label: "Hours",
            data: bars,
            ...(chartMode === "bar"
              ? {
                  backgroundColor: barColors,
                  borderRadius: 4,
                  borderSkipped: false as const,
                }
              : {
                  borderColor: "#534AB7",
                  backgroundColor: accentFill,
                  tension: 0.35,
                  fill: true,
                  pointBackgroundColor: bars.map((_, i) => {
                    return i === todayIdx
                      ? "#BA7517"
                      : dark
                        ? "#7F77DD"
                        : "#8F87D5";
                  }),
                  pointRadius: bars.map((v, i) => {
                    return v === 0 ? 2 : i === todayIdx ? 5 : 3;
                  }),
                  pointHoverRadius: 6,
                  borderWidth: 2,
                }),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: dark ? "#2C2C2A" : "#ffffff",
            borderColor: dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
            borderWidth: 1,
            titleColor: dark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)",
            bodyColor: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
            titleFont: { size: 12, weight: "bold" },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title(ctx) {
                return ctx[0].label;
              },
              label(ctx) {
                const val = ctx.parsed.y;

                if (val === 0) {
                  return "No time logged";
                }

                const h = Math.floor(val!);
                const m = Math.round((val! - h) * 60);

                return m === 0 ? `${h}h logged` : `${h}h ${m}m logged`;
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColor,
              font: { size: 10 },
              maxRotation: 0,
              callback(_val, idx) {
                const step = bars.length > 20 ? 5 : bars.length > 14 ? 4 : 3;

                return idx % step === 0 || idx === bars.length - 1
                  ? String(idx + 1)
                  : "";
              },
            },
            grid: { display: false },
            border: { display: false },
          },
          y: {
            min: 0,
            ticks: {
              color: textColor,
              font: { size: 10 },
              stepSize: 2,
              callback: (v) => {
                return Number(v) > 0 ? `${v}h` : "";
              },
            },
            grid: { color: gridColor },
            border: { display: false },
          },
        },
      },
    });
  }

  $effect(() => {
    bars;
    chartMode;
    if (canvasEl) {
      buildChart();
    }
  });

  onDestroy(() => {
    chartInstance?.destroy();
  });
</script>

<div class="flex flex-col gap-2">
  <div class="relative h-44">
    <canvas bind:this={canvasEl} role="img" aria-label="Daily hours worked"
    ></canvas>
  </div>
  <div class="flex justify-between">
    <span class="text-2xs text-tx-faint">1st</span>
    <span class="text-2xs text-tx-faint">
      {isCurrentMonth(currentDate)
        ? "Today"
        : `${daysInMonth(currentDate.getFullYear(), currentDate.getMonth())}`}
    </span>
  </div>
</div>
