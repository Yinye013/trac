"use client";

import { useState } from "react";

export function CompanyLogo({
  src,
  company,
  size = 40,
}: Readonly<{ src: string | null; company: string; size?: number }>) {
  const [errored, setErrored] = useState(false);
  const showFallback = !src || errored;

  if (showFallback) {
    const initial = company.trim().charAt(0).toUpperCase() || "?";
    return (
      <div
        aria-hidden="true"
        style={{ width: size, height: size }}
        className="flex shrink-0 items-center justify-center rounded-lg bg-primary-600/10 text-sm font-bold text-primary-600"
      >
        {initial}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- external, unpredictable-domain logo URLs; next/image would need every job source's domain allowlisted ahead of time.
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="shrink-0 rounded-lg object-contain"
      onError={() => setErrored(true)}
    />
  );
}
