import type {
  Dataset,
  DemographicItem,
  LinkedInYear,
  LocationItem,
  SubstackYear,
  YearData,
} from './types';

// ---------------------------------------------------------------------------
// Reads the published-to-web Google Sheet. Deliberately knows nothing about
// fallbacks: load.ts layers the snapshot on top at runtime, and
// scripts/fetch-mediakit.ts uses the same code to bake that snapshot at build
// time — so the sheet's schema is defined exactly once, here.
//
// Set PUBLISHED_ID to '' to render the bundled snapshot instead. Any fetch or
// parse failure also falls back to it, per tab and then overall, so a broken
// sheet can never break the page.
//
// NOTE ON ADDRESSING. "Publish to web" gives a 2PACX-… id, which is NOT the
// document id, and the gviz endpoint (which selects tabs by NAME) 404s on it —
// verified against this sheet. The published export selects tabs by numeric
// gid instead, so the map below is required. Gids survive renames, edits and
// row inserts; they only change if a tab is deleted and recreated, in which
// case that one tab falls back to the snapshot and the gid needs updating here.
// ---------------------------------------------------------------------------

export const PUBLISHED_ID =
  '2PACX-1vTIrXe7UN8omqi0E9mXc4ab3Co7fz8tTL6okgGpX4zp394qTDSOXeEFt_QcY4m7vcLU9DlS3sgZcmzN';

/** Tab name → gid, read off the published document. */
const TAB_GIDS: Record<string, string> = {
  meta: '1001252114',
  linkedin: '487790294',
  li_followers: '875539696',
  li_demographics: '314532372',
  li_monthly: '930072574',
  substack: '1053398041',
  ss_followers: '124104808',
  ss_traffic: '1360996415',
  ss_location: '1643266563',
};

type Row = Record<string, string | number | null>;

function csvUrl(tab: string): string {
  return `https://docs.google.com/spreadsheets/d/e/${PUBLISHED_ID}/pub?gid=${TAB_GIDS[tab]}&single=true&output=csv`;
}

/** Minimal RFC4180 reader — the export quotes any field holding a comma. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c !== '"') field += c;
      else if (text[i + 1] === '"') { field += '"'; i++; }
      else quoted = false;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

async function fetchTab(tab: string): Promise<Row[]> {
  const res = await fetch(csvUrl(tab));
  if (!res.ok) throw new Error(`${tab}: HTTP ${res.status}`);
  const [header, ...body] = parseCsv(await res.text());
  if (!header) throw new Error(`${tab}: empty`);
  const cols = header.map((c) => c.trim().toLowerCase().replace(/\s+/g, '_'));
  return body
    .map((cells) => {
      const obj: Row = {};
      cols.forEach((key, i) => { if (key) obj[key] = cells[i] ?? null; });
      return obj;
    })
    .filter((row) => Object.values(row).some((v) => v !== null && v !== ''));
}

const num = (v: string | number | null | undefined): number => {
  if (v === null || v === undefined || v === '') return 0;
  return typeof v === 'number' ? v : Number(String(v).replace(/[, ]/g, '')) || 0;
};
const str = (v: string | number | null | undefined): string => (v == null ? '' : String(v).trim());

const DEMO_KEYS: Record<string, keyof Pick<LinkedInYear, 'jobTitle' | 'seniority' | 'industry' | 'companySize'>> = {
  job_title: 'jobTitle',
  seniority: 'seniority',
  industry: 'industry',
  company_size: 'companySize',
};

export function assemble(tabs: Record<string, Row[]>, lastUpdated: string): Dataset {
  const years = new Set<string>();
  for (const rows of Object.values(tabs)) rows.forEach((r) => years.add(str(r.year)));
  years.delete('');

  /**
   * Audience location is a "where my readers are NOW" snapshot, not a per-year
   * quantity — so it is read across every row and shared by all years, ignoring
   * ss_location's year column. Filtering it by year like the other tabs left any
   * year the snapshot was not tagged with (e.g. 2026) with an empty map.
   */
  const location: LocationItem[] = tabs.ss_location.map((r) => ({
    country: str(r.country),
    pct: num(r.pct),
    atlasName: str(r.atlas_name) || str(r.country),
    // Shades the choropleth and fills the hover tooltip; absent → pct is used.
    count: num(r.count) || undefined,
  }));

  const yearData: YearData[] = [...years].sort().map((year) => {
    const where = (rows: Row[]) => rows.filter((r) => str(r.year) === year);

    const liTotals = where(tabs.linkedin)[0] ?? {};
    const ssTotals = where(tabs.substack)[0] ?? {};

    const demographics: Record<string, DemographicItem[]> = {
      jobTitle: [], seniority: [], industry: [], companySize: [],
    };
    where(tabs.li_demographics).forEach((r) => {
      const key = DEMO_KEYS[str(r.chart).toLowerCase().replace(/\s+/g, '_')];
      if (key) demographics[key].push({ label: str(r.label), pct: num(r.pct) });
    });

    const liStart = num(liTotals.start_followers);
    const liEnd = num(liTotals.end_followers);
    const ssStart = num(ssTotals.start_followers);
    const ssEnd = num(ssTotals.end_followers);

    const linkedin: LinkedInYear = {
      startFollowers: liStart,
      endFollowers: liEnd,
      growthPct: liStart ? ((liEnd - liStart) / liStart) * 100 : 0,
      followers: where(tabs.li_followers).map((r) => ({ date: str(r.date), newFollowers: num(r.new_followers) })),
      jobTitle: demographics.jobTitle,
      seniority: demographics.seniority,
      industry: demographics.industry,
      companySize: demographics.companySize,
      monthly: where(tabs.li_monthly).map((r) => ({
        month: str(r.month), impressions: num(r.impressions), engagements: num(r.engagements),
      })),
      totalImpressions: num(liTotals.total_impressions),
      totalEngagements: num(liTotals.total_engagements),
    };

    const substack: SubstackYear = {
      startFollowers: ssStart,
      endFollowers: ssEnd,
      growthPct: ssStart ? ((ssEnd - ssStart) / ssStart) * 100 : 0,
      followers: where(tabs.ss_followers).map((r) => ({ date: str(r.date), newFollowers: num(r.new_followers) })),
      traffic: where(tabs.ss_traffic).map((r) => ({ month: str(r.month), traffic: num(r.traffic) })),
      totalTraffic: num(ssTotals.total_traffic),
      totalSubscribers: num(ssTotals.total_subscribers),
      location,
    };

    const ytd = str(liTotals.ytd) === 'true' || str(ssTotals.ytd) === 'true';
    return { year, ytd, through: str(liTotals.through) || str(ssTotals.through) || undefined, linkedin, substack };
  });

  return { lastUpdated, years: yearData };
}


/** The dataset exactly as the sheet describes it. Throws if any tab fails. */
export async function fetchDataset(): Promise<Dataset> {
  const tabNames = Object.keys(TAB_GIDS);
  const fetched = await Promise.all(tabNames.map(fetchTab));
  const tabs: Record<string, Row[]> = {};
  tabNames.forEach((name, i) => (tabs[name] = fetched[i]));
  const meta = tabs.meta.find((r) => str(r.key) === 'last_updated') ?? {};
  return assemble(tabs, str(meta.value));
}
