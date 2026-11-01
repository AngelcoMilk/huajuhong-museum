// Liquid Glass：<Glass> 组件、滑动透镜、指针高光、折射特性检测。
import { useCallback, useEffect, useId, useLayoutEffect, useRef, type ComponentPropsWithRef, type ElementType, type RefObject } from "react";

type GlassProps<T extends ElementType> = {
  as?: T;
  variant?: "neutral" | "tinted";
  /** 长表单、菜单：提高不透明度保证可读 */
  reading?: boolean;
  /** 边缘折射：只给背后不随滚动变化的层开，滚动时不重算滤镜 */
  refract?: boolean;
} & ComponentPropsWithRef<T>;

export function Glass<T extends ElementType = "div">({ as, variant = "neutral", reading, refract, className, ref, ...rest }: GlassProps<T>) {
  const Tag: ElementType = as ?? "div";
  const classes = ["glass", variant === "tinted" && "glass--tinted", reading && "glass--reading", className].filter(Boolean).join(" ");
  const inner = useRef<HTMLElement | null>(null);
  useEdgeRefraction(inner, Boolean(refract));
  const setRef = useCallback(
    (node: HTMLElement | null) => {
      inner.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as { current: HTMLElement | null }).current = node;
    },
    [ref],
  );
  return <Tag className={classes} ref={setRef} {...rest} />;
}

/** 只有 Chromium 真正把 url() 滤镜用在 backdrop-filter 上；Safari 能解析却不渲染，其余浏览器靠内圈亮环模拟透镜边 */
function supportsRefraction(): boolean {
  if (window.matchMedia?.("(prefers-reduced-transparency: reduce)").matches) return false;
  return Boolean(window.CSS?.supports?.("backdrop-filter", "blur(1px) url(#x)")) && /Chrome\//.test(navigator.userAgent);
}

/** 位移图：红、绿通道存水平、垂直位移，中央是中性灰（不位移），只有边缘一圈被弯折 */
function displacementMap(width: number, height: number, radius: number): string {
  const edge = Math.min(22, Math.min(width, height) / 3);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
<defs>
<linearGradient id="x"><stop offset="0" stop-color="#f00"/><stop offset="1" stop-color="#000"/></linearGradient>
<linearGradient id="y" x2="0" y2="1"><stop offset="0" stop-color="#0f0"/><stop offset="1" stop-color="#000"/></linearGradient>
<filter id="b"><feGaussianBlur stdDeviation="${edge / 2}"/></filter>
</defs>
<rect width="${width}" height="${height}" fill="#000"/>
<rect width="${width}" height="${height}" fill="url(#x)" style="mix-blend-mode:screen"/>
<rect width="${width}" height="${height}" fill="url(#y)" style="mix-blend-mode:screen"/>
<rect x="${edge}" y="${edge}" width="${Math.max(0, width - edge * 2)}" height="${Math.max(0, height - edge * 2)}" rx="${Math.max(0, radius - edge / 2)}" fill="#808000" filter="url(#b)"/>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function useEdgeRefraction(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  useEffect(() => {
    const node = ref.current;
    if (!enabled || !node || !supportsRefraction()) return;
    const NS = "http://www.w3.org/2000/svg";
    const host = document.createElementNS(NS, "svg");
    host.setAttribute("width", "0");
    host.setAttribute("height", "0");
    host.setAttribute("aria-hidden", "true");
    host.style.position = "absolute";
    const filter = document.createElementNS(NS, "filter");
    filter.id = `lg-${id}`;
    filter.setAttribute("filterUnits", "userSpaceOnUse");
    filter.setAttribute("color-interpolation-filters", "sRGB");
    const image = document.createElementNS(NS, "feImage");
    image.setAttribute("result", "map");
    image.setAttribute("x", "0");
    image.setAttribute("y", "0");
    const displace = document.createElementNS(NS, "feDisplacementMap");
    displace.setAttribute("in", "SourceGraphic");
    displace.setAttribute("in2", "map");
    displace.setAttribute("scale", "42");
    displace.setAttribute("xChannelSelector", "R");
    displace.setAttribute("yChannelSelector", "G");
    filter.append(image, displace);
    host.append(filter);
    document.body.append(host);

    let timer = 0;
    const apply = () => {
      const width = Math.round(node.offsetWidth);
      const height = Math.round(node.offsetHeight);
      if (!width || !height) return;
      for (const [key, value] of [["x", 0], ["y", 0], ["width", width], ["height", height]] as const) filter.setAttribute(key, String(value));
      image.setAttribute("width", String(width));
      image.setAttribute("height", String(height));
      image.setAttribute("href", displacementMap(width, height, Number.parseFloat(getComputedStyle(node).borderTopLeftRadius) || 0));
      node.style.setProperty("backdrop-filter", `blur(24px) saturate(1.8) url(#lg-${id})`);
    };
    apply();
    // 尺寸一变位移图就要重画：防抖，侧栏收起动画途中不反复生成
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(apply, 120);
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      node.style.removeProperty("backdrop-filter");
      host.remove();
    };
  }, [enabled, id, ref]);
}

/** 指针高光：全局委托一个监听，按帧写 --mx/--my，避免每个按钮挂 handler */
export function useGlassPointer() {
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let last: PointerEvent | null = null;
    const flush = () => {
      frame = 0;
      if (!last) return;
      const target = (last.target as Element | null)?.closest?.(".btn, .icon-btn, .glass-i") as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${last.clientX - rect.left}px`);
      target.style.setProperty("--my", `${last.clientY - rect.top}px`);
    };
    const onMove = (event: PointerEvent) => {
      last = event;
      if (!frame) frame = requestAnimationFrame(flush);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}

/** 让滑块（侧栏透镜、分段控件）贴到容器里当前选中的元素上；容器尺寸变化时跟着重算 */
export function useSlidingThumb(
  containerRef: RefObject<HTMLElement | null>,
  thumbRef: RefObject<HTMLElement | null>,
  activeSelector: string,
  deps: unknown[],
) {
  const measure = useRef(() => {});
  measure.current = () => {
    const container = containerRef.current;
    const thumb = thumbRef.current;
    if (!container || !thumb) return;
    const active = container.querySelector<HTMLElement>(activeSelector);
    if (!active) {
      thumb.style.opacity = "0";
      return;
    }
    thumb.style.opacity = "";
    thumb.style.width = `${active.offsetWidth}px`;
    thumb.style.height = `${active.offsetHeight}px`;
    thumb.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
    // 第一次定位不做动画：下一帧才挂 is-ready，避免从左上角滑进来
    if (!thumb.classList.contains("is-ready")) requestAnimationFrame(() => thumb.classList.add("is-ready"));
  };

  useLayoutEffect(() => {
    measure.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    // 容器可能晚于首次渲染才挂载（登录后才有侧栏），所以跟着 deps 重新绑定。
    // observe 后那次回调不是真的尺寸变化，跳过，否则切换时的滑动动画会被 no-anim 打断
    let initial = true;
    const observer = new ResizeObserver(() => {
      if (initial) {
        initial = false;
        return;
      }
      thumbRef.current?.classList.add("no-anim");
      measure.current();
      requestAnimationFrame(() => thumbRef.current?.classList.remove("no-anim"));
    });
    observer.observe(container);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, thumbRef, ...deps]);
}

/** 把指针位置写到滑块上：滑块本身 pointer-events: none，由它所在的轨道转发 */
export function forwardPointer(event: React.PointerEvent, thumb: HTMLElement | null) {
  if (!thumb) return;
  const rect = thumb.getBoundingClientRect();
  thumb.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  thumb.style.setProperty("--my", `${event.clientY - rect.top}px`);
}
