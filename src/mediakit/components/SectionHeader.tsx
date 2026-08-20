interface SectionHeaderProps {
  /** Word shown before the colored period, e.g. "Growth". */
  title: string;
  id?: string;
}

/** Brand section header: bold word + red period, with a gradient underline. */
export default function SectionHeader({ title, id }: SectionHeaderProps) {
  return (
    <div id={id} className="mb-10 scroll-mt-24">
      <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
        {title}
        <span className="text-brand-red">.</span>
      </h3>
      <div className="mt-3 h-0.5 w-full rounded-full gradient-bg opacity-80" />
    </div>
  );
}
