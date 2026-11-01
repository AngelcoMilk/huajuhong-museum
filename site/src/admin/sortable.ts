// 拖动排序：只从手柄开始拖，拖动的预览是整行。键盘用页面自己的上移下移按钮。
import { useCallback, useRef, useState, type DragEvent } from "react";

export interface DropSpot {
  container: string;
  /** 落在哪一项旁边；空容器时为 null */
  targetId: string | null;
  after: boolean;
}

/** 把 id 按落点挪到 list 里。挪不动时返回 null */
export function moveInList(list: string[], id: string, spot: Pick<DropSpot, "targetId" | "after">): string[] | null {
  if (spot.targetId === id) return null;
  const rest = list.filter((value) => value !== id);
  let at = rest.length;
  if (spot.targetId !== null) {
    const index = rest.indexOf(spot.targetId);
    if (index >= 0) at = spot.after ? index + 1 : index;
  }
  const next = [...rest.slice(0, at), id, ...rest.slice(at)];
  return next.join("\n") === list.join("\n") ? null : next;
}

/** 上移下移：到头时返回 null */
export function stepInList(list: string[], id: string, step: -1 | 1): string[] | null {
  const at = list.indexOf(id);
  const to = at + step;
  if (at < 0 || to < 0 || to >= list.length) return null;
  const next = [...list];
  [next[at], next[to]] = [next[to], next[at]];
  return next;
}

export function useDragSort(onMove: (id: string, from: string, spot: DropSpot) => void, axis: "x" | "y" = "y") {
  const [dragging, setDragging] = useState<{ id: string; container: string } | null>(null);
  const [spot, setSpot] = useState<DropSpot | null>(null);
  const latest = useRef({ dragging, spot, onMove });
  latest.current = { dragging, spot, onMove };

  const finish = useCallback(() => {
    setDragging(null);
    setSpot(null);
  }, []);

  function drop(event: DragEvent, target: DropSpot) {
    const { dragging: from, onMove: move } = latest.current;
    if (!from) return;
    event.preventDefault();
    event.stopPropagation();
    finish();
    move(from.id, from.container, target);
  }

  /** 放在手柄上 */
  const handle = (id: string, container: string) => ({
    draggable: true,
    onDragStart: (event: DragEvent<HTMLElement>) => {
      event.stopPropagation();
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", id);
      const row = event.currentTarget.closest<HTMLElement>("[data-sort-row]");
      if (row) event.dataTransfer.setDragImage(row, 16, 16);
      setDragging({ id, container });
    },
    onDragEnd: finish,
  });

  /** 放在行上 */
  const row = (id: string, container: string) => ({
    "data-sort-row": true,
    onDragOver: (event: DragEvent<HTMLElement>) => {
      if (!latest.current.dragging) return;
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "move";
      const box = event.currentTarget.getBoundingClientRect();
      const after = axis === "x" ? event.clientX > box.left + box.width / 2 : event.clientY > box.top + box.height / 2;
      const current = latest.current.spot;
      if (!current || current.targetId !== id || current.after !== after || current.container !== container) setSpot({ container, targetId: id, after });
    },
    onDrop: (event: DragEvent<HTMLElement>) => drop(event, { container, targetId: id, after: latest.current.spot?.after ?? false }),
  });

  /** 放在容器上：拖到空分组或列表末尾 */
  const zone = (container: string) => ({
    onDragOver: (event: DragEvent<HTMLElement>) => {
      if (!latest.current.dragging) return;
      event.preventDefault();
      const current = latest.current.spot;
      if (!current || current.targetId !== null || current.container !== container) setSpot({ container, targetId: null, after: false });
    },
    onDrop: (event: DragEvent<HTMLElement>) => drop(event, { container, targetId: null, after: false }),
  });

  const rowClass = (id: string) => {
    if (dragging?.id === id) return "is-dragging";
    if (spot?.targetId === id) return spot.after ? `is-drop-after${axis === "x" ? " is-x" : ""}` : `is-drop-before${axis === "x" ? " is-x" : ""}`;
    return "";
  };
  const zoneClass = (container: string) => (spot?.container === container && spot.targetId === null ? "is-drop-zone" : "");

  return { active: dragging !== null, handle, row, zone, rowClass, zoneClass };
}
