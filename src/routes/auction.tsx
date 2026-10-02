import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { auctionSales, auctionSetup, auctionTeams } from "@/data/auction";
import { houseRoster } from "@/data/event";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auction")({
  head: () => ({ meta: [
    { title: "Auction Highlights | Bright Battle Royale 2026" }, { name: "description", content: "How the four houses built their squads at the Bright Battle Royale 2026 player auction." },
    { property: "og:title", content: "Auction Highlights | Bright Battle Royale 2026" }, { property: "og:description", content: "Top buys, house spending and every squad from the player auction." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: AuctionPage,
});

const fmt = (n: number) => n.toLocaleString("en-IN");
const house = (name: string) => houseRoster.find((h) => h.name === name);

function HouseTag({ name }: { name: string }) {
  const h = house(name);
  return <span className="flex min-w-0 items-center gap-2">
    {h && <img src={h.logo} alt="" className="size-6 shrink-0 rounded object-cover" width={24} height={24}/>}
    <span className="truncate">{name}</span>
  </span>;
}

function AuctionPage() {
  const spent = auctionSales.reduce((sum, s) => sum + s.price, 0);
  const top = [...auctionSales].sort((a, b) => b.price - a.price || a.n - b.n);
  const topBuy = top[0];
  const rebids = auctionSales.filter((s) => s.round !== "Auction").length;
  const teams = auctionTeams.map((t) => {
    const buys = auctionSales.filter((s) => s.team === t.name);
    const teamSpent = buys.reduce((sum, s) => sum + s.price, 0);
    return { ...t, buys, spent: teamSpent, left: auctionSetup.purse - teamSpent, biggest: [...buys].sort((a, b) => b.price - a.price)[0] };
  });
  const [open, setOpen] = useState(teams[0]?.name ?? "");
  const squad = teams.find((t) => t.name === open);

  return <main>
    {/* Header */}
    <section className="border-b border-border">
      <div className="page-width grid gap-6 py-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-end lg:gap-12">
        <div>
          <p className="eyebrow">{auctionSetup.date} · Player auction</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Auction highlights</h1>
          <p className="mt-3 max-w-md text-muted-foreground">{auctionSales.length} players went under the hammer. Each house had {fmt(auctionSetup.purse)} points to build its squad.</p>
        </div>
        <div className="rounded-2xl bg-mint-light p-5 sm:p-6">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            <Stat value={String(auctionSales.length)} label="players sold"/>
            <Stat value={fmt(spent)} label="points spent"/>
            {topBuy && <div className="col-span-2 sm:col-span-1">
              <p className="truncate font-display text-base font-extrabold leading-tight">{topBuy.player}</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">top buy · {fmt(topBuy.price)}</p>
            </div>}
          </div>
        </div>
      </div>
    </section>

    <div className="page-width py-10 sm:py-12">
      {/* House by house */}
      <section>
        <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">How the houses spent</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {teams.map((t) => {
            const h = house(t.name);
            return <article key={t.name} className="relative overflow-hidden rounded-xl border border-border bg-card p-5">
              <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: h?.color }} aria-hidden/>
              <div className="flex items-center gap-3">
                {h && <img src={h.logo} alt="" className="size-12 shrink-0 rounded-lg object-cover" width={48} height={48}/>}
                <h3 className="min-w-0 font-display text-base font-extrabold leading-tight">{t.name}</h3>
              </div>
              <div className="mt-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Captains</p>
                {t.captains.map((c) => <p key={c} className="mt-1 text-sm font-semibold">{c}</p>)}
              </div>
              <p className="mt-5 font-display text-3xl font-extrabold tabular-nums">{fmt(t.spent)}</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">points spent · {fmt(t.left)} left</p>
              <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Players bought</dt><dd className="font-semibold tabular-nums">{t.buys.length}</dd></div>
                {t.biggest && <div><dt className="text-muted-foreground">Biggest buy</dt><dd className="mt-0.5 font-semibold">{t.biggest.player} · {fmt(t.biggest.price)}</dd></div>}
              </dl>
            </article>;
          })}
        </div>
      </section>

      {/* Top buys */}
      <section className="mt-14 sm:mt-16">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">Top buys</h2>
          <p className="text-sm text-muted-foreground">The five biggest bids of the day</p>
        </div>
        <ol className="mt-4 border-t border-border">
          {top.slice(0, 5).map((sale, i) => <li key={sale.n} className="grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-border py-2.5 text-sm sm:grid-cols-[2rem_minmax(0,1fr)_minmax(0,1fr)_6rem]">
            <span className="font-bold tabular-nums text-muted-foreground/70">{i + 1}</span>
            <span className="min-w-0">
              <span className="block truncate font-semibold">{sale.player}</span>
              <span className="block text-xs text-muted-foreground sm:hidden">{sale.team}</span>
            </span>
            <span className="hidden sm:block"><HouseTag name={sale.team}/></span>
            <span className="text-right font-bold tabular-nums">{fmt(sale.price)}</span>
          </li>)}
        </ol>
      </section>

      {/* Squads */}
      <section className="mt-14 sm:mt-16">
        <h2 className="text-center font-display text-2xl font-extrabold tracking-tight sm:text-3xl">The squads</h2>
        <p className="mt-3 text-center text-muted-foreground">Pick a house to see who they bought.</p>

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4" role="tablist" aria-label="Houses">
          {teams.map((t) => {
            const h = house(t.name);
            const active = t.name === open;
            return <button key={t.name} type="button" role="tab" aria-selected={active} onClick={() => setOpen(t.name)}
              className={cn("flex flex-col items-center rounded-2xl border px-4 py-5 transition-colors", active ? "border-transparent bg-mint-light" : "border-border hover:bg-muted/60")}
              style={active ? { boxShadow: `inset 0 -3px 0 ${h?.color}` } : undefined}>
              {h && <img src={h.logo} alt="" className="size-12 rounded-lg object-cover" width={48} height={48}/>}
              <span className="mt-3 text-sm font-bold">{t.name}</span>
              <span className="mt-1 text-xs tabular-nums text-muted-foreground">{fmt(t.spent)} spent</span>
            </button>;
          })}
        </div>

        {squad && <div className="mx-auto mt-10 max-w-3xl">
          <p className="text-center text-sm text-muted-foreground">Captains <span className="font-semibold text-foreground">{squad.captains.join(" & ")}</span></p>
          <ul className="mt-6 grid gap-x-12 sm:grid-cols-2">
            {squad.buys.map((s) => <li key={s.n} className="flex items-baseline gap-3 border-b border-border/60 py-3">
              <span className="truncate">{s.player}</span>
              <span className="ml-auto shrink-0 text-sm tabular-nums text-muted-foreground">{fmt(s.price)}</span>
            </li>)}
          </ul>
        </div>}
      </section>
    </div>
  </main>;
}

function Stat({ value, label }: { value: string; label: string }) {
  return <div>
    <p className="font-display text-2xl font-extrabold tabular-nums sm:text-3xl">{value}</p>
    <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
  </div>;
}

