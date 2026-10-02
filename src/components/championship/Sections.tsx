import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export function SectionHeading({ kicker, title, aside, intro }: { kicker: string; title: string; aside?: string; intro?: string }) {
  return <div className="section-heading"><div><div className="eyebrow">{kicker}</div><h2>{title}</h2>{intro && <p className="section-heading-intro">{intro}</p>}</div>{aside && <p>{aside}</p>}</div>;
}

export type TournamentRow = { slug: string; name: string; sport: string; dates: string };

/** One row per published tournament — Carrom Singles and Carrom Doubles are two. */
export function TournamentList({ tournaments }: { tournaments: TournamentRow[] }) {
  return <div className="sports-list">{tournaments.map((t, index) => <Link className="sport-row" key={t.slug} to="/tournaments/$slug" params={{ slug: t.slug }}><span className="sport-number">{String(index + 1).padStart(2, "0")}</span><strong>{t.name}</strong><span className="sport-meta">{t.sport.toUpperCase()}<span className="sport-date">{t.dates.replace(/\s*\d{4}$/, "").toUpperCase()}</span></span><ArrowUpRight className="sport-arrow" size={25}/></Link>)}</div>;
}
