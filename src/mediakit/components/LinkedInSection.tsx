import type { LinkedInStats } from '../data/types';
import { LinkedInIcon } from '../../components/BrandIcons';
import ChartCard from './ChartCard';
import DemographicChart from './charts/DemographicChart';
import EmptyState from './EmptyState';
import GrowthChart from './charts/GrowthChart';
import MonthlyChart from './charts/MonthlyChart';
import PlatformHeader from './PlatformHeader';
import Reveal from './Reveal';
import SectionHeader from './SectionHeader';

interface LinkedInSectionProps {
  data: LinkedInStats;
  hasData: boolean;
  /** e.g. "Aug 2025 – Jul 2026" — the window every figure describes. */
  period: string;
}

const fmt = (n: number) => n.toLocaleString('en-US');
const compactTotal = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : `${n}`;

export default function LinkedInSection({ data, hasData, period }: LinkedInSectionProps) {
  const demographics = [
    { title: 'Job Title', items: data.jobTitle },
    { title: 'Seniority', items: data.seniority },
    { title: 'Industry', items: data.industry },
    { title: 'Company Size', items: data.companySize },
  ];

  return (
    <section className="section-spacing">
      <div className="mx-auto max-w-6xl px-6">
        <PlatformHeader title="LinkedIn" art={<LinkedInIcon size={40} className="text-brand-black3" />} />

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
                    points={data.followers}
                    startValue={data.startFollowers}
                    endValue={data.endFollowers}
                    growthPct={data.growthPct}
                    unitLabel="followers"
                    periodLabel={period}
                    gradientId="li-growth"
                  />
                </ChartCard>
              </Reveal>
            </div>

            {/* Audience */}
            <div className="mt-14">
              <SectionHeader title="Audience" />
              <p className="-mt-6 mb-6 text-sm text-brand-grey">Audience of {fmt(data.endFollowers)} followers</p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {demographics.map((d, i) => (
                  <Reveal key={d.title} delay={i * 70}>
                    <ChartCard>
                      <DemographicChart title={d.title} items={d.items} />
                    </ChartCard>
                  </Reveal>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <Reveal>
                  <ChartCard title="Impressions" caption={`Total: ${compactTotal(data.totalImpressions)}`}>
                    <MonthlyChart
                      name="Impressions"
                      data={data.monthly.map((m) => ({ month: m.month, value: m.impressions }))}
                    />
                  </ChartCard>
                </Reveal>
                <Reveal delay={90}>
                  <ChartCard title="Engagements" caption={`Total: ${compactTotal(data.totalEngagements)}`}>
                    <MonthlyChart
                      name="Engagements"
                      data={data.monthly.map((m) => ({ month: m.month, value: m.engagements }))}
                    />
                  </ChartCard>
                </Reveal>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
