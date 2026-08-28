import Link from 'next/link';
import CardMedia from '@/components/CardMedia';
import { getAllCards } from '@/lib/queries';

export const dynamic = 'force-dynamic';
const TIER_OPTIONS = ['All', 'S', '6', '5', '4', '3', '2', '1'];

function getContractedPages(totalPages, currentPage) { if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1); const pages = [1]; const start = Math.max(2, currentPage - 1); const end = Math.min(totalPages - 1, currentPage + 1); if (start > 2) pages.push('left-ellipsis'); for (let page = start; page <= end; page += 1) pages.push(page); if (end < totalPages - 1) pages.push('right-ellipsis'); pages.push(totalPages); return pages; }
function createQuery(searchParams, updates = {}) { const params = new URLSearchParams(); Object.entries({ ...searchParams, ...updates }).forEach(([key, value]) => { if (value === null || value === undefined) return; const text = String(value).trim(); if (!text) return; params.set(key, text); }); const queryString = params.toString(); return queryString ? `?${queryString}` : ''; }

export default async function AllCardsPage({ searchParams }) {
  const mode = searchParams?.mode === 'series' ? 'series' : searchParams?.mode === 'name' ? 'name' : 'recency';
  const page = Math.max(1, Number(searchParams?.page || '1'));
  const search = (searchParams?.series || '').trim();
  const tier = (searchParams?.tier || '').trim().toUpperCase();
  const { cards, totalPages } = await getAllCards({ sortBy: mode, search, tier: tier === 'ALL' ? '' : tier, page, perPage: 20 });
  const currentPage = Math.min(page, totalPages);
  const pageNumbers = getContractedPages(totalPages, currentPage);
  const placeholder = mode === 'name' ? 'Search by name...' : 'Search series...';

  return (
    <section className="space-y-5">
      <h2 className="font-title text-3xl">Card Gallery</h2>
      <form action="/cardrinv" className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-4 dark:border-white/10 dark:bg-slate-900/60">
        <select id="mode" name="mode" className="rounded-xl border border-slate-300 bg-white px-3 py-2 font-body text-sm dark:border-white/20 dark:bg-slate-950" defaultValue={mode}><option value="recency">By Recency</option><option value="series">By Series</option><option value="name">By Name</option></select>
        <input id="series" name="series" className="rounded-xl border border-slate-300 bg-white px-3 py-2 font-body text-sm dark:border-white/20 dark:bg-slate-950" defaultValue={search} placeholder={placeholder} />
        <select id="tier" name="tier" className="rounded-xl border border-slate-300 bg-white px-3 py-2 font-body text-sm dark:border-white/20 dark:bg-slate-950" defaultValue={tier || 'All'}>{TIER_OPTIONS.map((entry) => (<option key={entry} value={entry}>{entry === 'All' ? 'All Tiers' : `Tier ${entry}`}</option>))}</select>
        <button type="submit" className="rounded-xl bg-indigo-500 px-4 py-2 font-badge text-sm font-semibold text-white">Apply Filters</button>
      </form>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">{cards.map((card) => (
        <Link href={`/cards/${card.id}`} className={`block rounded-xl border p-2 ${card.isEvent ? 'border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-950/30' : 'border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/60'}`} key={card.id}>
          <CardMedia card={card} className="w-full rounded-lg object-contain" />
          <div className="mt-2 space-y-1 px-1">
            <p className="truncate font-subtitle text-sm">{card.name}</p>
            <p className="truncate font-body text-xs text-slate-600 dark:text-slate-300">{card.series || 'Unknown'}</p>
            <p className="font-metric text-xs text-indigo-400">Tier {card.tier || '-'}</p>
          </div>
        </Link>
      ))}
      </div>
      <div className="flex justify-center">
        <nav className="flex gap-2"><Link className="rounded-lg border border-slate-300 px-3 py-1 text-sm dark:border-white/20" href={`/cardrinv${createQuery(searchParams, { page: Math.max(1, currentPage - 1) })}`}>Prev</Link>{pageNumbers.map((pageNum) => (typeof pageNum === 'number' ? <Link key={pageNum} className={`rounded-lg px-3 py-1 text-sm ${pageNum === currentPage ? 'bg-indigo-500 text-white' : 'border border-slate-300 dark:border-white/20'}`} href={`/cardrinv${createQuery(searchParams, { page: pageNum })}`}>{pageNum}</Link> : <span key={pageNum} className="px-2">...</span>))}<Link className="rounded-lg border border-slate-300 px-3 py-1 text-sm dark:border-white/20" href={`/cardrinv${createQuery(searchParams, { page: Math.min(totalPages, currentPage + 1) })}`}>Next</Link></nav>
      </div>
    </section>
  );
}
