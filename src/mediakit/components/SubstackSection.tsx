import { useMemo } from 'react';
import { SITE } from '../config';
import type { AudienceLocation, SubstackStats } from '../data/types';
import ChartCard from './ChartCard';
import DemographicChart from './charts/DemographicChart';
import EmptyState from './EmptyState';
import GrowthChart from './charts/GrowthChart';
import LocationChart from './charts/LocationChart';
import MonthlyChart from './charts/MonthlyChart';
import PlatformHeader from './PlatformHeader';
import Reveal from './Reveal';
import SectionHeader from './SectionHeader';

interface SubstackSectionProps {
  data: SubstackStats;
  hasData: boolean;
  /** e.g. "Aug 2025 – Jul 2026" — the window every figure describes. */
  period: string;
}

const compactTotal = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : `${n}`;

export default function SubstackSection({ data, hasData, period }: SubstackSectionProps) {
  // Deliberately its own section rather than a card inside "Audience".
  // Traffic and location are measured over every subscriber; these four are
  // self-reported by a self-selected handful, and folding them in under one
  // heading would let that distinction disappear.
  const survey = [
    { title: 'Job Title', items: data.jobTitle },
    { title: 'Seniority', items: data.seniority },
    { title: 'Industry', items: data.industry },
    { title: 'Company Type', items: data.companyType },
  ].filter((d) => d.items.length > 0);


  // Location rides along with the dataset — live from the sheet, or from the
  // snapshot baked off that same sheet at build time when it is unreachable.
  const audience: AudienceLocation = useMemo(() => {
    const items = [...data.location].sort((a, b) => (b.count ?? b.pct) - (a.count ?? a.pct));
    return { countries: items.length, items };
  }, [data.location]);

  return (
    <section className="section-spacing">
      <div className="mx-auto max-w-6xl px-6">
        <PlatformHeader
          title="The Decoding AI"
          art={<img src={SITE.decodingLogo} alt="Decoding AI" className="h-full w-full object-contain" />}
        />

        {!hasData ? (
          <div className="mt-10">
            <EmptyState period={period} />
          </div>
        ) : (
          <>
            {/* Growth */}
            <div className="mt-14">
              <SectionHeader title="Growth" />
              <Reveal>
                <ChartCard>
                  <GrowthChart
                    points={data.subscribers}
                    startValue={data.startSubscribers}
                    endValue={data.endSubscribers}
                    growthPct={data.growthPct}
                    unitLabel="subscribers"
                    periodLabel={period}
                    gradientId="ss-growth"
                  />
                </ChartCard>
              </Reveal>
            </div>

            {/* Audience */}
            <div className="mt-14">
              <SectionHeader title="Audience" />
              <Reveal>
                <ChartCard title="Monthly Total Traffic" caption={`Total: ${compactTotal(data.totalTraffic)}`} className="mb-5">
                  <MonthlyChart
                    name="Traffic"
                    data={data.traffic.map((t) => ({ month: t.month, value: t.traffic }))}
                  />
                </ChartCard>
              </Reveal>
              <Reveal delay={90}>
                <ChartCard>
                  <LocationChart data={audience} />
                </ChartCard>
              </Reveal>
            </div>

            {survey.length > 0 && (
              <div className="mt-14">
                <SectionHeader title="Reader Survey" />
                <p className="-mt-6 mb-6 text-sm text-brand-grey">
                  Self-reported by{' '}
                  {data.surveyResponses > 0 ? `${data.surveyResponses} readers` : 'surveyed readers'}
                  , not platform analytics.
                </p>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {survey.map((d, i) => (
                    <Reveal key={d.title} delay={i * 70}>
                      <ChartCard>
                        <DemographicChart title={d.title} items={d.items} />
                      </ChartCard>
                    </Reveal>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
