"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type DropAnimation,
} from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";
import type { Application, ApplicationStatus } from "@job-tracker/shared";
import { useReducedMotion } from "@/lib/UseReducedMotion";
import { ApplicationCardContent } from "./ApplicationCardContent";
import { KanbanColumn } from "./KanbanColumn";
import { STATUS_ORDER } from "./StatusBadge";

const DROP_ANIMATION: DropAnimation = {
  duration: 200,
  easing: "ease",
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: "0.5" } },
  }),
};

// dnd-kit's drop animation is its own JS-driven system, outside Tailwind's
// `motion-reduce:` variant — pass `null` to disable it outright for users
// with reduced-motion enabled (the card still moves to its new column
// instantly, just without the animated glide).
const NO_DROP_ANIMATION: DropAnimation | null = null;

interface KanbanBoardProps {
  applications: Application[];
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}

type Board = Record<ApplicationStatus, Application[]>;

function buildBoard(applications: Application[]): Board {
  const board = Object.fromEntries(
    STATUS_ORDER.map((status) => [status, [] as Application[]]),
  ) as Board;
  for (const application of applications) {
    board[application.status].push(application);
  }
  return board;
}

function findColumn(board: Board, id: string): ApplicationStatus | undefined {
  return STATUS_ORDER.find((status) =>
    board[status].some((application) => application.id === id),
  );
}

/**
 * Board layout lives in its own local state, NOT derived by filtering the
 * `applications` prop on every render. Rendering straight off React Query
 * data means every render (including ones triggered by unrelated cache
 * activity) recomputes columns from scratch, so there's no guard against the
 * query briefly disagreeing with where a card should be mid-drag or right
 * after a drop — which is exactly what caused the flash/snap-back bug even
 * after adding an onDragOver override and removing a stale invalidateQueries
 * call. This follows dnd-kit's own documented pattern for sortable state
 * (https://dndkit.com/react/guides/sortable-state-management/): keep local
 * board state as the only render source, mutate it directly in
 * onDragOver/onDragEnd, and only resync it from the server when a drag isn't
 * in progress (tracked via `isDragging` ref, not state, since it must be
 * readable synchronously inside the sync effect without retriggering it).
 */
export function KanbanBoard({
  applications,
  onStatusChange,
}: Readonly<KanbanBoardProps>) {
  const [board, setBoard] = useState<Board>(() => buildBoard(applications));
  const [activeApplication, setActiveApplication] = useState<Application | null>(
    null,
  );
  const reducedMotion = useReducedMotion();
  const isDragging = useRef(false);

  useEffect(() => {
    if (!isDragging.current) {
      setBoard(buildBoard(applications));
    }
  }, [applications]);

  const sensors = useSensors(
    // A small drag-start distance threshold so a plain click on the card (or
    // its status menu) doesn't get misread as a drag attempt.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function handleDragStart(event: DragStartEvent) {
    isDragging.current = true;
    const fromStatus = findColumn(board, String(event.active.id));
    const application = fromStatus
      ? board[fromStatus].find((a) => a.id === event.active.id)
      : undefined;
    setActiveApplication(application ?? null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const fromStatus = findColumn(board, activeId);
    if (!fromStatus) return;

    const toStatus = STATUS_ORDER.includes(over.id as ApplicationStatus)
      ? (over.id as ApplicationStatus)
      : findColumn(board, String(over.id));
    if (!toStatus || toStatus === fromStatus) return;

    setBoard((current) => {
      const dragged = current[fromStatus].find((a) => a.id === activeId);
      if (!dragged) return current;

      return {
        ...current,
        [fromStatus]: current[fromStatus].filter((a) => a.id !== activeId),
        [toStatus]: [
          { ...dragged, status: toStatus },
          ...current[toStatus].filter((a) => a.id !== activeId),
        ],
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    isDragging.current = false;
    setActiveApplication(null);

    const activeId = String(event.active.id);
    const originalStatus = applications.find((a) => a.id === activeId)?.status;
    const currentStatus = findColumn(board, activeId);

    // The board already reflects the drop target (moved live in
    // onDragOver) — onDragEnd's only job now is persisting the change.
    // `board` becomes stale relative to fresh server data again once
    // `applications` updates and the sync effect above picks it up.
    if (
      currentStatus &&
      originalStatus &&
      currentStatus !== originalStatus
    ) {
      onStatusChange(activeId, currentStatus);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full min-h-0 gap-3 overflow-x-auto p-4">
        {STATUS_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            applications={board[status]}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>

      <DragOverlay
        dropAnimation={reducedMotion ? NO_DROP_ANIMATION : DROP_ANIMATION}
      >
        {activeApplication && (
          <ApplicationCardContent
            application={activeApplication}
            onStatusChange={() => {}}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
