import { useMemo } from 'react';
import { SITE } from '../config';
import type { AudienceLocation, SubstackYear } from '../data/types';
import ChartCard from './ChartCard';
import EmptyState from './EmptyState';
import GrowthChart from './charts/GrowthChart';
import LocationChart from './charts/LocationChart';
import MonthlyChart from './charts/MonthlyChart';
import PlatformHeader from './PlatformHeader';
import Reveal from './Reveal';
import SectionHeader from './SectionHeader';

interface SubstackSectionProps {
  data: SubstackYear;
  hasData: boolean;
  year: string;
  partial: boolean;
}

const compactTotal = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : `${n}`;

export default function SubstackSection({ data, hasData, year, partial }: SubstackSectionProps) {
  const periodLabel = partial ? `${year} YTD` : year;

  // Location rides along with the dataset — live from the sheet, or from the
  // snapshot baked off that same sheet at build time when it is unreachable.
  const audience: AudienceLocation = useMemo(() => {
    const items = [...data.location].sort((a, b) => (b.count ?? b.pct) - (a.count ?? a.pct));
    return {
      updated: '',
      total: items.reduce((sum, i) => sum + (i.count ?? 0), 0),
      countries: items.length,
      items,
    };
  }, [data.location]);

  return (
    <section className="section-spacing">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <PlatformHeader
          title="The Decoding AI"
          art={<img src={SITE.decodingLogo} alt="Decoding AI" className="h-full w-full object-contain" />}
        />

        {!hasData ? (
          <div className="mt-10">
            <EmptyState year={year} />
          </div>
        ) : (
          <>
            {/* Growth */}
            <div className="mt-14">
              <SectionHeader title="Growth" />
              <Reveal>
                <ChartCard>
                  <GrowthChart
                    points={data.followers}
                    startFollowers={data.startFollowers}
                    endFollowers={data.endFollowers}
                    growthPct={data.growthPct}
                    unitLabel="followers"
                    periodLabel={periodLabel}
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
          </>
        )}
      </div>
    </section>
  );
}
