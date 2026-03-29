import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Shield, Cross } from "lucide-react";
import HeroSection from "../components/HeroSection";
import QuoteCard from "../components/QuoteCard";

const FEATURED_QUOTES = [
  {
    quote: "We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights.",
    author: "Declaration of Independence",
    title: "1776",
  },
  {
    quote: "The general principles on which the fathers achieved independence were the general principles of Christianity.",
    author: "John Adams",
    title: "2nd President of the United States",
  },
  {
    quote: "In the chain of human events, the birthday of our nation is indissolubly linked to the birthday of the Savior.",
    author: "John Quincy Adams",
    title: "6th President of the United States",
  },
];

const PILLARS = [
  {
    icon: BookOpen,
    title: "Biblical Foundation",
    text: "Our Founding Fathers drew upon Scripture and Christian principles to establish the framework of American governance.",
    color: "text-red-400",
    bg: "bg-red-900/30",
    hover: "hover:bg-red-800/40",
  },
  {
    icon: Shield,
    title: "Divine Providence",
    text: "The Declaration of Independence affirms a firm reliance on the protection of divine Providence.",
    color: "text-blue-300",
    bg: "bg-blue-900/30",
    hover: "hover:bg-blue-800/40",
  },
  {
    icon: Cross,
    title: "Enduring Values",
    text: "The principles of Christianity were described as eternal and immutable — the bedrock of our great nation.",
    color: "text-primary",
    bg: "bg-primary/10",
    hover: "hover:bg-primary/20",
  },
];

export default function Home() {
  return (
    <div>
      <HeroSection />

      {/* Pillars Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-inter text-xs tracking-[0.3em] text-primary uppercase mb-3">
            Our Foundation
          </p>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-foreground">
            One Nation Under God
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="text-center p-8 rounded-lg border border-border/30 hover:border-primary/30 transition-all group"
            >
              <div className={`w-14 h-14 mx-auto mb-6 rounded-full ${pillar.bg} flex items-center justify-center ${pillar.hover} transition-colors`}>
                <pillar.icon className={`w-6 h-6 ${pillar.color}`} />
              </div>
              <h3 className="font-cinzel text-lg font-semibold text-foreground mb-3">
                {pillar.title}
              </h3>
              <p className="font-inter text-sm text-muted-foreground leading-relaxed">
                {pillar.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Quotes */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-inter text-xs tracking-[0.3em] text-primary uppercase mb-3">
            Words of Wisdom
          </p>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-foreground">
            From Our Founding Fathers
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURED_QUOTES.map((q, i) => (
            <QuoteCard key={i} {...q} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/quotes"
            className="inline-flex items-center gap-2 font-inter text-sm text-primary hover:text-primary/80 tracking-wider transition-colors"
          >
            View All Quotes <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Marketplace CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-border/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-all group">
              <p className="font-inter text-xs tracking-[0.25em] text-primary uppercase mb-2">🛒 Shop American</p>
              <h3 className="font-cinzel text-xl font-bold text-foreground mb-3">The American Marketplace</h3>
              <p className="font-inter text-sm text-muted-foreground leading-relaxed mb-5">
                Browse KYC-verified American-made companies. Physical goods, digital services — all proudly made in the USA.
              </p>
              <Link to="/marketplace" className="inline-flex items-center gap-2 font-cinzel tracking-wider text-sm px-5 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Browse Marketplace <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-card border border-red-900/30 rounded-xl p-6 hover:border-red-700/40 transition-all group">
              <p className="font-inter text-xs tracking-[0.25em] text-red-400 uppercase mb-2">🇺🇸 List Your Business</p>
              <h3 className="font-cinzel text-xl font-bold text-foreground mb-3">Are You a USA Maker?</h3>
              <p className="font-inter text-sm text-muted-foreground leading-relaxed mb-5">
                Apply for KYC verification and list your American-made goods or services. Join the growing directory of approved USA creators.
              </p>
              <Link to="/apply" className="inline-flex items-center gap-2 font-cinzel tracking-wider text-sm px-5 py-3 border border-red-700/50 text-red-400 rounded-lg hover:bg-red-900/20 transition-colors">
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-border/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="font-inter text-xs tracking-[0.3em] text-primary uppercase mb-3">
            Join the Movement
          </p>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Stake Your TRUST
          </h2>
          <p className="font-inter text-muted-foreground leading-relaxed mb-8">
            Support the mission by staking TRUST tokens on Streamflow. Together we
            honor America's Christian heritage and build towards a future grounded
            in faith and liberty.
          </p>
          <a
            href="https://app.streamflow.finance/staking"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-cinzel tracking-wider text-sm px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Stake on Streamflow
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </section>
    </div>
  );
}