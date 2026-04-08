import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const USA_FACTS = [
  {
    title: "American Holidays",
    desc: "The United States recognizes 12 federal holidays. Learn about federal, state, and cultural holidays celebrated in the U.S.",
    url: "https://www.usa.gov/holidays",
    icon: "🗓️",
  },
  {
    title: "Order of Presidential Succession",
    desc: "If a U.S. president cannot carry out the duties of the office, responsibilities are passed to another government leader in a specific order.",
    url: "https://www.usa.gov/presidential-succession",
    icon: "🏛️",
  },
  {
    title: "Official Language",
    desc: "English is the official language of the United States.",
    url: "https://www.usa.gov/official-language-of-us",
    icon: "📖",
  },
  {
    title: "The American Flag & National Symbols",
    desc: "Get the facts about the U.S. flag and when to fly it at half staff. Learn about other national symbols.",
    url: "https://www.usa.gov/flag",
    icon: "🇺🇸",
  },
  {
    title: "Presidents, Vice Presidents & First Ladies",
    desc: "Learn about the duties of president, vice president, and first lady. Find out how to contact current and past leaders.",
    url: "https://www.usa.gov/presidents",
    icon: "🦅",
  },
  {
    title: "American Money",
    desc: "The United States dollar is the official currency of the U.S. and its territories. Learn about the bills and coins that make up U.S. currency.",
    url: "https://www.usa.gov/currency",
    icon: "💵",
  },
  {
    title: "The Federal Budget Process",
    desc: "Learn about the federal government's budget process, from the president's budget plan to Congress creating funding bills.",
    url: "https://www.usa.gov/federal-budget-process",
    icon: "📊",
  },
  {
    title: "U.S. Census Data",
    desc: "Learn about the U.S. Census and how the government uses population data. Search for information on your state, county, or city.",
    url: "https://www.usa.gov/census-data",
    icon: "📋",
  },
  {
    title: "The U.S. National Anthem",
    desc: "The Star-Spangled Banner is the national anthem of the United States. Learn about its historical origin and lyrics.",
    url: "https://www.usa.gov/national-anthem",
    icon: "🎵",
  },
  {
    title: "Founding Documents",
    desc: "The Declaration of Independence, U.S. Constitution, and Bill of Rights established the government's structure and secure the rights of American citizens.",
    url: "https://www.usa.gov/historical-documents",
    icon: "📜",
  },
];

export default function USAFactsFigures() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-border/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-inter text-xs tracking-[0.3em] text-primary uppercase mb-3">
            Official U.S. Government Resource
          </p>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-foreground mb-3">
            USA Facts &amp; Figures
          </h2>
          <div className="w-24 h-0.5 bg-primary mx-auto mb-5" />
          <p className="font-inter text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Learn about the United States — its history, government, national symbols, and more. Sourced directly from{" "}
            <a
              href="https://www.usa.gov/facts-figures"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline"
            >
              usa.gov
            </a>
            .
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {USA_FACTS.map((fact, i) => (
            <motion.a
              key={fact.title}
              href={fact.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group bg-card border border-border/50 rounded-xl p-5 flex flex-col hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all"
            >
              <div className="text-3xl mb-3">{fact.icon}</div>
              <h3 className="font-cinzel font-semibold text-foreground text-sm leading-snug mb-2 group-hover:text-primary transition-colors">
                {fact.title}
              </h3>
              <p className="font-inter text-xs text-muted-foreground leading-relaxed flex-1">
                {fact.desc}
              </p>
              <div className="flex items-center gap-1 mt-4 font-inter text-xs text-primary/60 group-hover:text-primary transition-colors">
                <span>Learn more</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Source link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href="https://www.usa.gov/facts-figures"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-inter text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View full resource at usa.gov/facts-figures
          </a>
        </motion.div>
      </div>
    </section>
  );
}