import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { nextEvent, schedule, sports } from "@/data/mockData";
import { ResultsList, ScheduleList, SectionHeading, SportsList, Standings } from "@/components/championship/Sections";
import footballImage from "@/assets/championship-court.jpg";
import carromImage from "@/assets/carrom-match.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Bright Battle Royale 2026 | The Championship" },
    { name: "description", content: "Four houses. Eleven sports. One champion. Follow the Bright Battle Royale 2026 championship, standings, fixtures and results." },
    { property: "og:title", content: "Bright Battle Royale 2026 | The Championship" },
    { property: "og:description", content: "Four houses. Eleven sports. One champion. Follow the championship." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Home,
});

function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { const update = () => setNow(Date.now()); update(); const timer = window.setInterval(update, 60000); return () => window.clearInterval(timer); }, []);
  if (now === null) return <span>THE OPENING MATCH</span>;
  const remaining = new Date(nextEvent.startsAt).getTime() - now;
  if (remaining <= 0) return <span>THE GAMES ARE ON</span>;
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  return <span>{days}D {hours}H TO GO</span>;
}

function Home() {
  return <main>
    <section className="intro page-width">
      <div className="intro-top"><span>BRIGHT MONEY PRESENTS</span><span>EST. 2026 <span className="intro-asterisk">✳</span> THE FIRST EDITION</span></div>
      <div className="intro-grid"><div className="intro-title"><h1><span>BRIGHT</span><span>BATTLE</span><span>ROYALE<span className="title-dot">.</span></span></h1></div><div className="intro-year"><span>THE CHAMPIONSHIP</span><strong>26</strong></div></div>
      <div className="intro-bottom"><p>FOUR HOUSES.<br/>ELEVEN SPORTS.<br/><em>ONE CHAMPION.</em></p><div><span>06 — 17 OCTOBER 2026</span><span>BRIGHT MONEY · INDIA</span></div></div>
      <div className="track-motif" aria-hidden="true"><span/><span/><span/><span/><span/></div>
    </section>

    <section className="next-up-band"><div className="page-width next-up-inner"><div className="next-copy"><div className="eyebrow light"><span className="eyebrow-line"/> ON THE HORIZON <span className="next-pulse"/></div><div className="next-main"><div><span className="next-label">01 / NEXT UP</span><h2>CARROM<br/><i>SINGLES.</i></h2></div><div className="next-details"><div><span>WHEN</span><strong>{nextEvent.date}</strong></div><div><span>WHERE</span><strong>{nextEvent.venue}</strong></div></div></div><div className="next-bottom"><div className="countdown"><Countdown/></div><Link to="/sports/$slug" params={{ slug: nextEvent.sportSlug }} className="text-arrow light-link">EXPLORE THE EVENT <ArrowUpRight size={20}/></Link></div></div><div className="next-image"><img src={carromImage} alt="Colleagues playing carrom at the office" width={1104} height={800}/><span className="image-corner">LET THE GAMES BEGIN ↗</span></div></div></section>

    <section className="section standings-section page-width" id="championship"><SectionHeading kicker="01 / THE RACE" title="THE CHAMPIONSHIP" aside="Every game counts. Every point moves the needle."/><Standings/><div className="section-end"><span>THE ROAD TO 800 POSSIBLE POINTS</span><Link to="/points" className="text-arrow">FULL POINTS TABLE <ArrowUpRight size={20}/></Link></div></section>

    <section className="photo-editorial"><div className="page-width photo-editorial-grid"><div className="photo-frame"><img src={footballImage} alt="Colleagues competing in an outdoor football match" width={1408} height={912} loading="lazy"/><span>MORE THAN A GAME. A BRIGHT THING.</span></div><div className="photo-copy"><div className="eyebrow"><span className="eyebrow-line"/> THIS IS OUR MOMENT</div><h2>GOOD<br/>TEAMS.<br/><em>GREAT</em><br/>RIVALRIES.</h2><p>Two weeks of competition, connection, and the kind of moments we’ll talk about long after the final whistle.</p><div className="photo-stat"><strong>04</strong><span>HOUSES<br/>ONE BRIGHT FAMILY</span></div></div></div></section>

    <section className="section games-section page-width" id="games"><SectionHeading kicker="02 / PICK YOUR ARENA" title="THE GAMES" aside="Eleven ways to show up. One reason to give it everything."/><SportsList limit={8}/><div className="section-end"><span>{sports.length} SPORTS / 16 MEDAL EVENTS</span><Link to="/sports" className="text-arrow">ALL SPORTS <ArrowUpRight size={20}/></Link></div></section>

    <section className="schedule-band" id="schedule"><div className="page-width"><SectionHeading kicker="03 / MARK YOUR CALENDAR" title="THE ROAD TO THE FINAL" aside="The build-up starts at the office. The finale belongs to everyone."/><ScheduleList days={schedule.filter(day => day.date !== "18 SEP" && (day.date <= "10 OCT" || day.finale))}/><div className="section-end"><span>06 — 17 OCTOBER 2026</span><Link to="/schedule" className="text-arrow">FULL SCHEDULE <ArrowUpRight size={20}/></Link></div></div></section>

    <section className="section results-section page-width"><SectionHeading kicker="04 / ON THE BOARD" title="RECENT RESULTS" aside="The moments that shape the leaderboard."/><ResultsList limit={2}/><div className="section-end"><span>GOLD 25 / SILVER 15 / BRONZE 10</span><Link to="/points" className="text-arrow">SEE THE STANDINGS <ArrowUpRight size={20}/></Link></div></section>

    <section className="closing-band"><div className="page-width closing-inner"><div><span>THE FINAL WHISTLE / 17 OCT</span><h2>ALL ROADS<br/>LEAD TO <em>ONE.</em></h2></div><div><ArrowDownRight size={72} strokeWidth={1.3}/><p>One trophy. Four houses.<br/>Every moment matters.</p><Link to="/schedule" className="closing-link">SEE THE FINALE <ArrowRight size={19}/></Link></div></div><div className="closing-lanes" aria-hidden="true"><span/><span/><span/></div></section>
  </main>;
}