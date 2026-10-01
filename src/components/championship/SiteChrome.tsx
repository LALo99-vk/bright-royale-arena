import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (state) => state.location.pathname });
  const links = [
    { to: "/" as const, label: "Battle Royale" },
    { to: "/points" as const, label: "Points" },
    { to: "/schedule" as const, label: "Schedule" },
    { to: "/sports" as const, label: "Sports" },
  ];
  return <header className="site-header">
    <div className="site-header-inner page-width">
      <Link to="/" className="brand" aria-label="Bright Battle Royale home"><span className="brand-symbol">b<span>.</span></span><span className="brand-word">bright<span className="brand-divider"/>battle royale</span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(link => <Link key={link.to} to={link.to} className={`nav-link ${path === link.to ? "nav-link-active" : ""}`}>{link.label}</Link>)}</nav>
      <div className="header-end"><span className="edition-tag">THE 2026 EDITION</span><Button variant="ghost" size="icon" className="mobile-menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>{open ? <X/> : <Menu/>}</Button></div>
    </div>
    {open && <nav className="mobile-nav" aria-label="Mobile navigation">{links.map(link => <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight size={19}/></Link>)}</nav>}
  </header>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="page-width footer-inner"><div><span className="footer-brand">bright<span>.</span></span><p>Four houses. One finish line.</p></div><div className="footer-right"><span>BRIGHT BATTLE ROYALE · 2026</span><span>MADE FOR THE GAME</span></div></div></footer>;
}