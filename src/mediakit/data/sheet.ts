import type {
  Dataset,
  DemographicItem,
  LinkedInStats,
  SubstackStats,
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
  '2PACX-1vTctEkiBhrA5-h3mZ3kkDUFMXTA3pe154ViuIyVzUWuCtU6JavWcXiBuKnxcmGrrUR-nq9nniRRROzg';

/** Tab name → gid, read off the published document. */
const TAB_GIDS: Record<string, string> = {
  meta: '415418443',
  summary: '830052816',
  li_followers: '1658641104',
  li_monthly: '1137550027',
  li_demographics: '1172172797',
  ss_subscribers: '787757660',
  ss_traffic: '1986229077',
  ss_location: '693403476',
  ss_demographics: '490418416',
};
export type Row = Record<string, string | number | null>;

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

export async function fetchTab(tab: string): Promise<Row[]> {
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

const DEMO_KEYS: Record<string, string> = {
  job_title: 'jobTitle',
  seniority: 'seniority',
  industry: 'industry',
  company_size: 'companySize',
  company_type: 'companyType',
};

/** chart/label/pct rows -> buckets. Unknown chart names are ignored. */
function demographics(rows: Row[]): Record<string, DemographicItem[]> {
  const out: Record<string, DemographicItem[]> = {
    jobTitle: [], seniority: [], industry: [], companySize: [], companyType: [],
  };
  rows.forEach((r) => {
    const key = DEMO_KEYS[str(r.chart).toLowerCase().replace(/\s+/g, '_')];
    if (key) out[key].push({ label: str(r.label), pct: num(r.pct) });
  });
  return out;
}

/** summary is a metric/value table; read it into a lookup. */
export function metrics(rows: Row[]): Record<string, number> {
  const out: Record<string, number> = {};
  rows.forEach((r) => { const k = str(r.metric); if (k) out[k] = num(r.value); });
  return out;
}

export function assemble(tabs: Record<string, Row[]>): Dataset {
  const meta: Record<string, string> = {};
  tabs.meta.forEach((r) => { const k = str(r.key); if (k) meta[k] = str(r.value); });
  const m = metrics(tabs.summary);

  const li = demographics(tabs.li_demographics);
  const ss = demographics(tabs.ss_demographics);

  const linkedin: LinkedInStats = {
    startFollowers: m.li_start_followers ?? 0,
    endFollowers: m.li_end_followers ?? 0,
    growthPct: m.li_growth_pct ?? 0,
    followers: tabs.li_followers.map((r) => ({ date: str(r.date), added: num(r.new_followers) })),
    jobTitle: li.jobTitle,
    seniority: li.seniority,
    industry: li.industry,
    companySize: li.companySize,
    monthly: tabs.li_monthly.map((r) => ({
      month: str(r.month), impressions: num(r.impressions), engagements: num(r.engagements),
    })),
    totalImpressions: m.li_total_impressions ?? 0,
    totalEngagements: m.li_total_engagements ?? 0,
  };

  const substack: SubstackStats = {
    startSubscribers: m.ss_start_subscribers ?? 0,
    endSubscribers: m.ss_end_subscribers ?? 0,
    growthPct: m.ss_growth_pct ?? 0,
    subscribers: tabs.ss_subscribers.map((r) => ({ date: str(r.date), added: num(r.new_subscribers) })),
    traffic: tabs.ss_traffic.map((r) => ({ month: str(r.month), traffic: num(r.traffic) })),
    totalTraffic: m.ss_total_traffic ?? 0,
    // Where the readers are now — a snapshot, not a figure for the period.
    location: tabs.ss_location.map((r) => ({
      country: str(r.country),
      pct: num(r.pct),
      atlasName: str(r.atlas_name) || str(r.country),
      // Shades the choropleth and fills the hover tooltip; absent → pct is used.
      count: num(r.count) || undefined,
    })),
    jobTitle: ss.jobTitle,
    seniority: ss.seniority,
    industry: ss.industry,
    companyType: ss.companyType,
    surveyResponses: m.ss_survey_responses ?? 0,
  };

  return {
    lastUpdated: meta.last_updated ?? '',
    periodStart: meta.period_start ?? '',
    periodEnd: meta.period_end ?? '',
    linkedin,
    substack,
    // Today's figures, for copy elsewhere on the site. They drift past the
    // period end, so they are entered by hand rather than derived — falling
    // back to the period end keeps the site sane if the cells are blank.
    current: {
      linkedin: m.li_current_followers || linkedin.endFollowers,
      substack: m.ss_current_subscribers || substack.endSubscribers,
    },
  };
}

export interface SheetResult {
  /** Assembled from whatever came back. Fields behind a failed tab are empty. */
  data: Dataset;
  /** Tab names that could not be read, e.g. ['ss_location']. Empty on success. */
  failed: string[];
}

/**
 * The dataset as the sheet describes it, plus which tabs could not be read.
 *
 * Deliberately does NOT throw on a partial read, and deliberately does not
 * substitute anything itself — that is fallback policy, and it differs by
 * caller: the page patches the gaps from the snapshot and carries on, while
 * the bake script refuses to write a snapshot built from a partial read.
 *
 * Previously this was Promise.all, so a single unreadable tab rejected the lot
 * and dropped all nine to the snapshot with only a console warning. That is a
 * bad failure here: the page still renders completely and plausibly, just with
 * build-time numbers, so nothing looks wrong. Nine published tabs and gids that
 * have already churned once make it a question of when, not if.
 */
export async function fetchDataset(): Promise<SheetResult> {
  const tabNames = Object.keys(TAB_GIDS);
  const settled = await Promise.allSettled(tabNames.map(fetchTab));
  const tabs: Record<string, Row[]> = {};
  const failed: string[] = [];
  settled.forEach((result, i) => {
    const name = tabNames[i];
    if (result.status === 'fulfilled') {
      tabs[name] = result.value;
    } else {
      tabs[name] = [];
      failed.push(name);
    }
  });
  return { data: assemble(tabs), failed };
}
