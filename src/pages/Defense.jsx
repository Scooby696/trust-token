import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, ExternalLink, Shield, Target, Zap, Filter, X } from "lucide-react";

const DEFENSE_COMPANIES = [
  // Aerospace & Aviation
  { name: "Lockheed Martin", category: "Aerospace & Aviation", location: "Bethesda, MD", desc: "F-35 Lightning II, F-22 Raptor, C-130 Hercules, Sikorsky Black Hawk helicopters, and advanced missile systems.", url: "https://www.lockheedmartin.com/", products: "F-35, F-22, C-130, Black Hawk" },
  { name: "Boeing Defense", category: "Aerospace & Aviation", location: "Arlington, VA", desc: "B-52 Stratofortress, Apache helicopter, F/A-18 Super Hornet, KC-46 tanker, and satellite systems.", url: "https://www.boeing.com/defense/", products: "B-52, Apache, F/A-18, KC-46" },
  { name: "Northrop Grumman", category: "Aerospace & Aviation", location: "Falls Church, VA", desc: "B-21 Raider stealth bomber, E-2D Hawkeye, Global Hawk UAV, and advanced cyber systems.", url: "https://www.northropgrumman.com/", products: "B-21, Global Hawk, E-2D" },
  { name: "General Dynamics", category: "Ground Systems", location: "Reston, VA", desc: "M1 Abrams main battle tank, Stryker armored vehicle, Virginia-class submarine, and Gulfstream aircraft.", url: "https://www.gd.com/", products: "M1 Abrams, Stryker, Virginia-class" },
  { name: "Raytheon Technologies", category: "Missiles & Munitions", location: "Waltham, MA", desc: "Patriot missile system, Tomahawk cruise missile, AIM-120 AMRAAM, Phalanx CIWS, and radar systems.", url: "https://www.rtx.com/", products: "Patriot, Tomahawk, AMRAAM, Phalanx" },
  { name: "L3Harris Technologies", category: "Electronics & Communications", location: "Melbourne, FL", desc: "Military radios, night vision systems, electronic warfare equipment, and ISR solutions.", url: "https://www.l3harris.com/", products: "FALCON radios, WESCAM, AN/PRC-163" },
  { name: "BAE Systems US", category: "Ground Systems", location: "Arlington, VA", desc: "Bradley Infantry Fighting Vehicle, M113, Paladin howitzer, and advanced armored combat vehicles.", url: "https://www.baesystems.com/en-us/", products: "Bradley IFV, M113, Paladin" },
  { name: "Textron Systems", category: "Unmanned Systems", location: "Providence, RI", desc: "Shadow UAV, Common Remotely Operated Weapon Station (CROWS), Ripsaw M5 robotic combat vehicle.", url: "https://www.textronsystems.com/", products: "Shadow UAV, CROWS, Ripsaw" },
  { name: "Huntington Ingalls Industries", category: "Naval Systems", location: "Newport News, VA", desc: "Gerald R. Ford-class aircraft carriers, Virginia-class submarines, Arleigh Burke destroyers.", url: "https://www.hii.com/", products: "Ford-class carriers, Virginia-class subs" },
  { name: "FLIR Systems (Teledyne)", category: "Electronics & Communications", location: "Wilsonville, OR", desc: "Thermal imaging, night vision, surveillance cameras, and reconnaissance systems for military use.", url: "https://www.teledyneflir.com/", products: "Thermal cameras, MWIR, LWIR systems" },
  { name: "Oshkosh Defense", category: "Ground Systems", location: "Oshkosh, WI", desc: "JLTV (Joint Light Tactical Vehicle), HEMTT heavy trucks, FMTV medium tactical vehicles for the US Army.", url: "https://oshkoshdefense.com/", products: "JLTV, HEMTT, FMTV" },
  { name: "AM General", category: "Ground Systems", location: "South Bend, IN", desc: "HMMWV (Humvee) — the iconic military utility vehicle used across all branches of the US Armed Forces.", url: "https://www.amgeneral.com/", products: "HMMWV (Humvee)" },
  { name: "General Atomics", category: "Unmanned Systems", location: "San Diego, CA", desc: "MQ-1 Predator, MQ-9 Reaper — the premier armed UAV drones used in US military operations worldwide.", url: "https://www.ga.com/", products: "MQ-9 Reaper, MQ-1 Predator" },
  { name: "Leidos", category: "Electronics & Communications", location: "Reston, VA", desc: "C5ISR systems, cybersecurity, logistics, and health IT for defense and intelligence communities.", url: "https://www.leidos.com/", products: "C5ISR, cyber defense, logistics" },
  { name: "SAIC", category: "Electronics & Communications", location: "Reston, VA", desc: "IT systems integration, cybersecurity, engineering, and logistics solutions for the US military.", url: "https://www.saic.com/", products: "IT integration, cyber, engineering" },
  { name: "Booz Allen Hamilton", category: "Electronics & Communications", location: "McLean, VA", desc: "Defense consulting, AI systems, cybersecurity, and intelligence solutions for US government.", url: "https://www.boozallen.com/", products: "AI systems, cyber, intelligence" },
  { name: "DRS Technologies (Leonardo)", category: "Electronics & Communications", location: "Parsippany, NJ", desc: "Thermal imaging, power conversion, combat display workstations, and electronic systems.", url: "https://www.leonardodrs.com/", products: "Thermal imaging, power systems" },
  { name: "Elbit Systems of America", category: "Electronics & Communications", location: "Fort Worth, TX", desc: "Night vision, heads-up displays, unmanned systems, and soldier systems for the US military.", url: "https://www.elbitamerica.com/", products: "Night vision, HMD, UAS" },
  { name: "Sierra Nevada Corporation", category: "Aerospace & Aviation", location: "Sparks, NV", desc: "Dream Chaser spaceplane, electronic warfare systems, and intelligence, surveillance, and reconnaissance.", url: "https://www.sncorp.com/", products: "Dream Chaser, EW systems, ISR" },
  { name: "Colt's Manufacturing", category: "Small Arms", location: "West Hartford, CT", desc: "M4 carbine, M16 rifle — the standard-issue rifles of the United States military since the Vietnam era.", url: "https://www.colt.com/", products: "M4 Carbine, M16 Rifle" },
  { name: "Smith & Wesson (American Outdoor Brands)", category: "Small Arms", location: "Springfield, MA", desc: "M&P pistol series used by military and law enforcement. American-made firearms since 1852.", url: "https://www.smith-wesson.com/", products: "M&P pistols, revolvers" },
  { name: "Sig Sauer", category: "Small Arms", location: "Exeter, NH", desc: "M17/M18 — official sidearm of the US military, replacing the M9 Beretta. Also makes the SIG MCX SPEAR.", url: "https://www.sigsauer.com/", products: "M17, M18, SIG MCX SPEAR" },
  { name: "General Dynamics Ordnance", category: "Missiles & Munitions", location: "St. Petersburg, FL", desc: "Artillery shells, bombs, propellants, and energetics for US military ammunition supply chain.", url: "https://www.gd-ots.com/", products: "Artillery shells, propellants, bombs" },
  { name: "Aerojet Rocketdyne", category: "Missiles & Munitions", location: "Sacramento, CA", desc: "Rocket propulsion systems for ICBMs, space launch vehicles, and tactical missiles.", url: "https://www.l3harris.com/", products: "ICBM propulsion, tactical missiles" },
  { name: "DRS Naval Power Systems", category: "Naval Systems", location: "Milwaukee, WI", desc: "Propulsion systems, power electronics, and naval combat management systems for US Navy warships.", url: "https://www.leonardodrs.com/", products: "Naval propulsion, power systems" },
  { name: "General Dynamics Electric Boat", category: "Naval Systems", location: "Groton, CT", desc: "Virginia-class and Columbia-class nuclear submarines for the United States Navy.", url: "https://www.gdeb.com/", products: "Virginia-class, Columbia-class subs" },
  { name: "BAE Systems Intelligence", category: "Missiles & Munitions", location: "Nashua, NH", desc: "Advanced munitions, precision artillery, and guided weapon systems for ground forces.", url: "https://www.baesystems.com/en-us/", products: "Precision munitions, guided weapons" },
  { name: "Kratos Defense", category: "Unmanned Systems", location: "San Diego, CA", desc: "Tactical drone aircraft, hypersonic systems, and rocket propulsion for USAF and Navy.", url: "https://www.kratosdefense.com/", products: "Valkyrie drone, hypersonic systems" },
  { name: "Palantir Technologies", category: "Electronics & Communications", location: "Denver, CO", desc: "AI-powered battlefield analytics, intelligence platforms, and data systems for US military operations.", url: "https://www.palantir.com/", products: "TITAN, AI battlefield analytics" },
  { name: "Anduril Industries", category: "Unmanned Systems", location: "Costa Mesa, CA", desc: "Autonomous weapons systems, Lattice AI platform, Ghost drone, and Roadrunner interceptor.", url: "https://www.anduril.com/", products: "Ghost, Roadrunner, Lattice AI" },
];

const CATEGORIES = ["All", "Aerospace & Aviation", "Ground Systems", "Naval Systems", "Missiles & Munitions", "Small Arms", "Unmanned Systems", "Electronics & Communications"];

const CATEGORY_COLORS = {
  "Aerospace & Aviation": "bg-blue-900/40 text-blue-300",
  "Ground Systems": "bg-green-900/40 text-green-300",
  "Naval Systems": "bg-cyan-900/40 text-cyan-300",
  "Missiles & Munitions": "bg-red-900/40 text-red-300",
  "Small Arms": "bg-orange-900/40 text-orange-300",
  "Unmanned Systems": "bg-purple-900/40 text-purple-300",
  "Electronics & Communications": "bg-yellow-900/40 text-yellow-300",
};

export default function Defense() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = DEFENSE_COMPANIES.filter((c) => {
    const matchCat = category === "All" || c.category === category;
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase()) ||
      c.products.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-20 sm:pt-24 min-h-screen">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-background to-red-950/40 pointer-events-none" />
        {/* Top stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-white/80" />
          <div className="flex-1 bg-blue-700" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-primary" />
              <p className="font-inter text-xs tracking-[0.35em] text-primary uppercase">MADE IN USA DIGITAL · powered by TRUST TOKEN</p>
              <Shield className="w-8 h-8 text-primary" />
            </div>

            <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 leading-tight">
              DEFENSE<br />INDUSTRIAL COMPLEX
            </h1>

            <div className="w-32 h-0.5 bg-primary mx-auto mb-5" />

            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="font-cinzel text-xl sm:text-2xl text-primary tracking-[0.15em] font-bold mb-6"
            >
              ✦ PEACE THRU SUPERIOR FIREPOWER ✦
            </motion.p>

            <p className="font-inter text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed mb-8">
              The backbone of American military might. These USA manufacturers design, engineer, and produce the weapons systems, platforms, and technologies that keep the free world safe.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by company, weapon system, or product..."
                className="w-full bg-card border border-border rounded-lg pl-11 pr-10 py-3 text-sm font-inter text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category filter */}
      <div className="sticky top-[69px] z-40 bg-background/95 backdrop-blur-md border-b border-border/50 py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-inter whitespace-nowrap transition-all shrink-0 ${
                category === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:border-primary/50"
              }`}>
              {cat}
            </button>
          ))}
          <span className="ml-auto shrink-0 font-inter text-xs text-muted-foreground">{filtered.length} companies</span>
        </div>
      </div>

      {/* Grid */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((company, i) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 9) * 0.05 }}
              className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-all group flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-inter ${CATEGORY_COLORS[company.category] || "bg-muted text-muted-foreground"}`}>
                  {company.category}
                </span>
                <Target className="w-4 h-4 text-red-400/50 shrink-0 mt-0.5" />
              </div>

              <h3 className="font-cinzel font-bold text-foreground text-base group-hover:text-primary transition-colors mb-1">
                {company.name}
              </h3>

              <p className="font-inter text-xs text-muted-foreground mb-1">{company.location}</p>

              <p className="font-inter text-xs text-muted-foreground/70 leading-relaxed mb-3 flex-1">
                {company.desc}
              </p>

              {/* Key products */}
              <div className="flex items-start gap-1.5 mb-4">
                <Zap className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                <p className="font-inter text-xs text-primary/80 leading-relaxed">{company.products}</p>
              </div>

              <a
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 bg-primary/10 border border-primary/20 text-primary rounded-lg text-xs font-inter hover:bg-primary/20 transition-colors mt-auto"
              >
                Visit Website <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-cinzel text-xl text-foreground mb-2">No results found</p>
            <p className="font-inter text-sm text-muted-foreground">Try a different search term or category.</p>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-16 text-center border-t border-border/30 pt-10">
          <p className="font-cinzel text-lg text-primary mb-2">✦ PEACE THRU SUPERIOR FIREPOWER ✦</p>
          <p className="font-inter text-xs text-muted-foreground max-w-xl mx-auto">
            These American defense manufacturers represent the industrial might and technological superiority that has protected freedom and democracy for generations. Proud to be made in the USA.
          </p>
        </div>
      </section>
    </div>
  );
}