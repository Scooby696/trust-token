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

      {/* MADEINUSA Marketplace Hero Ad */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-border/30">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          {/* Big banner */}
          <div className="relative rounded-2xl overflow-hidden border border-primary/30 bg-gradient-to-br from-blue-950 via-card to-red-950/40 p-8 sm:p-12 text-center mb-6">
            {/* Stars decoration */}
            <div className="absolute top-4 left-6 text-primary/20 font-cinzel text-4xl select-none">★ ★ ★</div>
            <div className="absolute top-4 right-6 text-primary/20 font-cinzel text-4xl select-none">★ ★ ★</div>
            {/* Stripe accent top */}
            <div className="absolute top-0 left-0 right-0 h-1 flex">
              <div className="flex-1 bg-red-600" />
              <div className="flex-1 bg-white/80" />
              <div className="flex-1 bg-blue-700" />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-inter text-xs tracking-[0.35em] text-primary uppercase mb-3"
            >
              MADE IN USA DIGITAL · Powered by TRUST TOKEN
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-cinzel text-3xl sm:text-5xl font-bold text-white mb-3 leading-tight"
            >
              MADEINUSA MARKETPLACE
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="w-32 h-0.5 bg-primary mx-auto mb-5"
            />

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="font-inter text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed mb-8"
            >
              The only marketplace exclusively dedicated to <strong className="text-white">KYC-verified American-made</strong> goods and services.
              100+ companies. Real reviews. AI-powered shopping — all backed by the <span className="text-primary font-semibold">TRUST Token</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/hundred"
                className="inline-flex items-center gap-2 font-cinzel tracking-wider text-sm px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                🛒 Shop 100 American Companies <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 font-cinzel tracking-wider text-sm px-8 py-4 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Browse Full Marketplace <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.65 }}
              className="flex items-center justify-center gap-6 sm:gap-12 mt-10 pt-8 border-t border-white/10"
            >
              {[
                { value: "100+", label: "Verified Companies" },
                { value: "🇺🇸", label: "100% American Made" },
                { value: "KYC", label: "Verified Listings" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-cinzel text-xl sm:text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="font-inter text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Two smaller cards below */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-all">
              <p className="font-inter text-xs tracking-[0.25em] text-primary uppercase mb-2">🇺🇸 List Your Business</p>
              <h3 className="font-cinzel text-lg font-bold text-foreground mb-2">Are You a USA Maker?</h3>
              <p className="font-inter text-xs text-muted-foreground leading-relaxed mb-4">
                Apply for KYC verification and list your American-made goods or services.
              </p>
              <Link to="/apply" className="inline-flex items-center gap-2 font-cinzel tracking-wider text-xs px-4 py-2 border border-red-700/50 text-red-400 rounded-lg hover:bg-red-900/20 transition-colors">
                Apply Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-all">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/30 rounded-full mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span className="font-cinzel text-[10px] text-primary tracking-widest uppercase">Coming Soon</span>
              </div>
              <p className="font-inter text-xs tracking-[0.25em] text-primary uppercase mb-2">⚡ TRUST TOKEN · MADE IN USA DIGITAL</p>
              <h3 className="font-cinzel text-lg font-bold text-foreground mb-2">Power the Marketplace</h3>
              <p className="font-inter text-xs text-muted-foreground leading-relaxed mb-4">
                Stake TRUST tokens on Streamflow and back America's premier marketplace ecosystem.
              </p>
              <div className="inline-flex items-center gap-2 font-cinzel tracking-wider text-xs px-4 py-2 bg-primary/10 border border-primary/20 text-primary/50 rounded-lg cursor-not-allowed select-none">
                Stake TRUST · Coming Soon
              </div>
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-cinzel text-xs text-primary tracking-widest uppercase">Coming Soon</span>
          </div>
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
          <div className="inline-flex items-center gap-2 font-cinzel tracking-wider text-sm px-8 py-4 bg-primary/20 text-primary/60 border border-primary/20 rounded-lg cursor-not-allowed select-none mb-6">
            Stake TRUST · Coming Soon
          </div>
          <p className="font-inter text-sm text-muted-foreground">
            Questions? Contact us at{" "}
            <a href="mailto:madeintheusadigital@gmail.com" className="text-primary hover:text-primary/80 transition-colors">
              madeintheusadigital@gmail.com
            </a>
          </p>
        </motion.div>
      </section>
    </div>
  );
}