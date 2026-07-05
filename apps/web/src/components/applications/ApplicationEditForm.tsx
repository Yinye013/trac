"use client";

import { useState } from "react";
import type { ApplicationWithJob } from "@job-tracker/shared";
import type { UpdateApplicationFields } from "@/lib/ApplicationDetailQuery";
import { DatePickerField } from "./DatePickerField";
import { STATUS_LABELS, STATUS_ORDER } from "./StatusBadge";

const inputClassName =
  "w-full cursor-text rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-600";

const selectClassName = `${inputClassName} cursor-pointer`;

const labelClassName = "text-xs font-semibold text-foreground/60";

/** `application.appliedAt` etc. are full ISO datetimes — the form date fields use YYYY-MM-DD values. */
function toDateInputValue(iso: string | null): string {
  return iso ? iso.slice(0, 10) : "";
}

export function ApplicationEditForm({
  application,
  onSave,
  onCancel,
  isSaving,
}: Readonly<{
  application: ApplicationWithJob;
  onSave: (fields: UpdateApplicationFields) => void;
  onCancel: () => void;
  isSaving: boolean;
}>) {
  const [status, setStatus] = useState(application.status);
  const [appliedAt, setAppliedAt] = useState(
    toDateInputValue(application.appliedAt),
  );
  const [followUpAt, setFollowUpAt] = useState(
    toDateInputValue(application.followUpAt),
  );
  const [resumeVersion, setResumeVersion] = useState(
    application.resumeVersion ?? "",
  );
  const [notes, setNotes] = useState(application.notes ?? "");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSave({
      status,
      // Empty string means the user cleared the field — send null to clear
      // it server-side rather than an empty string (which @IsDateString
      // would reject anyway).
      appliedAt: appliedAt || null,
      followUpAt: followUpAt || null,
      resumeVersion: resumeVersion || null,
      notes: notes || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="edit-status" className={labelClassName}>
            Status
          </label>
          <select
            id="edit-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as typeof status)}
            className={selectClassName}
          >
            {STATUS_ORDER.map((option) => (
              <option key={option} value={option}>
                {STATUS_LABELS[option]}
              </option>
            ))}
          </select>
        </div>

        <DatePickerField
          id="edit-applied-at"
          label="Applied date"
          value={appliedAt}
          onChange={setAppliedAt}
        />

        <DatePickerField
          id="edit-followup-at"
          label="Follow-up date"
          value={followUpAt}
          onChange={setFollowUpAt}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="edit-resume-version" className={labelClassName}>
            Resume version
          </label>
          <input
            id="edit-resume-version"
            type="text"
            placeholder="e.g. resume-v3-frontend"
            value={resumeVersion}
            onChange={(event) => setResumeVersion(event.target.value)}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="edit-notes" className={labelClassName}>
          Notes
        </label>
        <textarea
          id="edit-notes"
          rows={4}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className={`${inputClassName} cursor-text resize-y`}
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="cursor-pointer rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
