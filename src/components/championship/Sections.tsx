import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { houses, houseById, results, schedule, scoring, sports, type Result, type ScheduleDay } from "@/data/mockData";

export function SectionHeading({ kicker, title, aside }: { kicker: string; title: string; aside?: string }) {
  return <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/>{kicker}</div><h2>{title}</h2></div>{aside && <p>{aside}</p>}</div>;
}

export function Standings({ compact = false }: { compact?: boolean }) {
  const leader = houses[0]?.points ?? 0;
  return <div className={`standings ${compact ? "standings-compact" : ""}`}>
    <div className="standings-labels"><span>RANK / HOUSE</span><span>MEDALS</span><span>POINTS</span></div>
    {houses.map((house, index) => <div className="standing-row" key={house.id}>
      <div className="standing-main"><span className="standing-rank">0{index + 1}</span><span className={`house-mark house-${house.id}`}>{house.mark}</span><div className="standing-name"><strong>{house.name}</strong>{index === 0 ? <span className="leading-tag">● LEADING</span> : <span className="gap-tag">−{leader - house.points} TO LEAD</span>}</div></div>
      <div className="medal-counts"><span><i className="medal-dot gold"/> {house.medals.gold}</span><span><i className="medal-dot silver"/> {house.medals.silver}</span><span><i className="medal-dot bronze"/> {house.medals.bronze}</span></div>
      <div className="standing-score"><strong>{house.points}</strong><small>PTS</small></div>
      <div className="standing-bar"><span style={{ width: `${(house.points / leader) * 100}%` }} /></div>
    </div>)}
  </div>;
}

export function SportsList({ limit }: { limit?: number }) {
  return <div className="sports-list">{sports.slice(0, limit).map((sport, index) => <Link className="sport-row" key={sport.slug} to="/sports/$slug" params={{ slug: sport.slug }}><span className="sport-number">{String(index + 1).padStart(2, "0")}</span><strong>{sport.name}</strong><span className="sport-meta">{sport.events.length} {sport.events.length === 1 ? "EVENT" : "EVENTS"}<span className="sport-date">{sport.date}</span></span><ArrowUpRight className="sport-arrow" size={25}/></Link>)}</div>;
}

export function ScheduleList({ days = schedule, compact = false }: { days?: ScheduleDay[]; compact?: boolean }) {
  return <div className={`schedule-list ${compact ? "schedule-compact" : ""}`}>{days.map(day => <div className={`schedule-row ${day.finale ? "schedule-finale" : ""}`} key={day.date}>
    <div className="schedule-date"><strong>{day.date.split(" ")[0]}</strong><span>{day.date.split(" ")[1]} <em>/ {day.weekday}</em></span></div>
    <div className="schedule-event"><strong>{day.title}</strong><span>{day.finale ? day.events.join(" · ") : day.events.length > 1 ? day.events.join(" · ") : day.venue}</span></div>
    <div className="schedule-location">{day.venue}</div>
    {day.sportSlug ? <Link className="circle-link" to="/sports/$slug" params={{ slug: day.sportSlug }} aria-label={`View ${day.title}`}><ArrowUpRight size={20}/></Link> : <span className="circle-link circle-link-muted"><ArrowRight size={20}/></span>}
  </div>)}</div>;
}

export function Podium({ result }: { result: Result }) {
  return <div className="podium-list">{(["gold", "silver", "bronze"] as const).map((medal, index) => <div key={medal}><span className="podium-place">0{index + 1}</span><i className={`medal-dot ${medal}`}/><strong>{houseById(result.podium[medal])}</strong><span>{scoring[medal]} PTS</span></div>)}</div>;
}

export function ResultsList({ limit }: { limit?: number }) {
  return <div className="results-list">{results.slice(0, limit).map(result => <div className="result-row" key={result.event}><div className="result-title"><span>{result.date} / FINAL</span><Link to="/sports/$slug" params={{ slug: result.sportSlug }}>{result.event}<ArrowUpRight size={19}/></Link></div><div className="result-winners"><span><i className="medal-dot gold"/> {houseById(result.podium.gold)}</span><span><i className="medal-dot silver"/> {houseById(result.podium.silver)}</span><span><i className="medal-dot bronze"/> {houseById(result.podium.bronze)}</span></div></div>)}</div>;
}