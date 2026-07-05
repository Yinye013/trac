"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Application, ApplicationStatus } from "@job-tracker/shared";
import { ApplicationCardContent } from "./ApplicationCardContent";

interface ApplicationCardProps {
  application: Application;
  onStatusChange: (status: ApplicationStatus) => void;
}

export function ApplicationCard({
  application,
  onStatusChange,
}: Readonly<ApplicationCardProps>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: application.id });

  return (
    <div
      ref={setNodeRef}
      // dnd-kit owns `transition`/`transform` on this wrapper exclusively —
      // no Tailwind `transition-*` utility should ever land on this same
      // element, since an inline style always overrides a class for the
      // same CSS property and would silently swallow dnd-kit's own value
      // (or vice versa), which is what made the drag motion stutter.
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
    >
      <ApplicationCardContent
        application={application}
        onStatusChange={onStatusChange}
        isDragging={isDragging}
      />
    </div>
  );
}
