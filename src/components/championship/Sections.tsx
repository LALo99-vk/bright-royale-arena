import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { houseById, scoring, sports, type Result } from "@/data/mockData";

export function SectionHeading({ kicker, title, aside, intro }: { kicker: string; title: string; aside?: string; intro?: string }) {
  return <div className="section-heading"><div><div className="eyebrow">{kicker}</div><h2>{title}</h2>{intro && <p className="section-heading-intro">{intro}</p>}</div>{aside && <p>{aside}</p>}</div>;
}

export function SportsList({ limit, only }: { limit?: number; only?: string[] }) {
  return <div className="sports-list">{sports.filter(sport => !only || only.includes(sport.slug)).slice(0, limit).map((sport, index) => <Link className="sport-row" key={sport.slug} to="/sports/$slug" params={{ slug: sport.slug }}><span className="sport-number">{String(index + 1).padStart(2, "0")}</span><strong>{sport.name}</strong><span className="sport-meta">{sport.events.length} {sport.events.length === 1 ? "EVENT" : "EVENTS"}<span className="sport-date">{sport.date}</span></span><ArrowUpRight className="sport-arrow" size={25}/></Link>)}</div>;
}

export function Podium({ result }: { result: Result }) {
  return <div className="podium-list">{(["gold", "silver", "bronze"] as const).map((medal, index) => <div key={medal}><span className="podium-place">0{index + 1}</span><i className={`medal-dot ${medal}`}/><strong>{houseById(result.podium[medal])}</strong><span>{scoring[medal]} PTS</span></div>)}</div>;
}
