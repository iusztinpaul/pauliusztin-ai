import type { ReactNode } from 'react';

interface PlatformHeaderProps {
  title: string;
  art: ReactNode;
  note?: string;
}

/** Compact platform header: gradient icon chip + title + "Growth & Audience". */
export default function PlatformHeader({ title, art, note }: PlatformHeaderProps) {
  return (
    <div className="flex items-center gap-4 md:gap-5">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl gradient-bg p-3 shadow-lg shadow-brand-red/20">
        {art}
      </div>
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">{title}</h2>
        <p className="text-sm text-brand-grey">
          Growth <span className="text-brand-red">&</span> Audience
          {note && <span className="text-brand-black1"> · {note}</span>}
        </p>
      </div>
    </div>
  );
}
