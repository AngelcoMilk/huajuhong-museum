// 按需引入 ECharts：只用折线 + 柱状，避免整个包进后台 chunk。
// 主题（平滑曲线 + 渐变面积、顶部图例、虚线网格、玻璃 tooltip）集中在这里，两种模式各取一套令牌。
import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts/core";
import { BarChart, LineChart } from "echarts/charts";
import { GridComponent, LegendComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([LineChart, BarChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

export interface ChartColors {
  series: [string, string, string];
  grid: string;
  label: string;
}

const FALLBACK: ChartColors = { series: ["#b4562b", "#7a3b1e", "#2e7d5b"], grid: "rgba(60,40,20,.1)", label: "#6e655c" };

/** ECharts 画在 canvas 上，拿不到 CSS 变量，必须先取成具体颜色；切主题时重取 */
export function useChartColors(): ChartColors {
  const [colors, setColors] = useState(FALLBACK);
  useEffect(() => {
    const sync = () => {
      const root = document.querySelector(".admin-root");
      if (!root) return;
      const cs = getComputedStyle(root);
      const read = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
      setColors({
        series: [read("--chart-1", FALLBACK.series[0]), read("--chart-2", FALLBACK.series[1]), read("--chart-3", FALLBACK.series[2])],
        grid: read("--chart-grid", FALLBACK.grid),
        label: read("--chart-label", FALLBACK.label),
      });
    };
    sync();
    window.addEventListener("my-theme-change", sync);
    return () => window.removeEventListener("my-theme-change", sync);
  }, []);
  return colors;
}

function withAlpha(hex: string, alpha: number): string {
  const n = Number.parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/** 平滑曲线 + 从 30% 到 0 的渐变面积 */
export function lineSeries(name: string, color: string, data: number[], yAxisIndex = 0) {
  return {
    name,
    type: "line",
    yAxisIndex,
    data,
    smooth: 0.35,
    symbol: "circle",
    symbolSize: 7,
    showSymbol: false,
    lineStyle: { width: 2, color },
    itemStyle: { color, borderColor: color },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: withAlpha(color, 0.3) },
        { offset: 1, color: withAlpha(color, 0) },
      ]),
    },
    emphasis: { focus: "none" },
  };
}

/** 图例在顶部居中、网格虚线、tooltip 玻璃。formatter 由调用方给 */
export function baseOption(colors: ChartColors) {
  const axisText = { color: colors.label, fontSize: 11, fontFamily: "ui-monospace, Menlo, monospace" };
  return {
    textStyle: { fontFamily: "inherit" },
    legend: { top: 0, left: "center", itemWidth: 24, itemHeight: 10, itemGap: 16, textStyle: { color: colors.label, fontSize: 12 } },
    grid: { left: 8, right: 8, top: 40, bottom: 4, containLabel: true },
    tooltip: {
      trigger: "axis",
      confine: true,
      className: "chart-tip",
      backgroundColor: "transparent",
      borderWidth: 0,
      padding: 0,
      axisPointer: { type: "line", lineStyle: { color: colors.grid, type: "dashed" } },
    },
    axisText,
    splitLine: { lineStyle: { color: colors.grid, type: "dashed" } },
  };
}

export function Chart({ option, height = 240, label = "数据图表" }: { option: Record<string, unknown>; height?: number; label?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const instance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    instance.current = echarts.init(ref.current, undefined, { renderer: "canvas" });
    // 侧栏收起、窗口缩放都会改容器宽度，看容器不看窗口
    const observer = new ResizeObserver(() => instance.current?.resize());
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      instance.current?.dispose();
      instance.current = null;
    };
  }, []);

  useEffect(() => {
    instance.current?.setOption(option, true);
  }, [option]);

  return <div ref={ref} style={{ width: "100%", height }} role="img" aria-label={label} />;
}
