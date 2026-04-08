import React, { useState } from "react";
import { motion } from "framer-motion";
import QuoteCard from "../components/QuoteCard";

const FAITH_QUOTES = [
  {
    quote: "We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty, and the pursuit of Happiness.",
    author: "Declaration of Independence",
    title: "1776",
  },
  {
    quote: "And for the support of this Declaration, with a firm reliance on the protection of divine Providence, we mutually pledge to each other our Lives, our Fortunes and our sacred Honor.",
    author: "Declaration of Independence",
    title: "1776",
  },
  {
    quote: "You do well to wish to learn our arts and ways of life, and above all, the religion of Jesus Christ. These will make you a greater and happier people than you are.",
    author: "George Washington",
    title: "1st President of the United States",
  },
  {
    quote: "The general principles on which the fathers achieved independence were the general principles of Christianity. I will avow that I then believed, and now believe, that those general principles of Christianity are as eternal and immutable as the existence and the attributes of God.",
    author: "John Adams",
    title: "2nd President of the United States",
  },
  {
    quote: "I have examined all religions, and the result is that the Bible is the best book in the world.",
    author: "John Adams",
    title: "2nd President of the United States",
  },
  {
    quote: "In the chain of human events, the birthday of our nation is indissolubly linked to the birthday of the Savior. The Declaration of Independence laid the cornerstone of human government upon the first precepts of Christianity.",
    author: "John Quincy Adams",
    title: "6th President of the United States",
  },
  {
    quote: "As to Jesus of Nazareth, my opinion of whom you particularly desire, I think the system of morals and His religion as He left them to us, are the best the world ever saw or is likely to see.",
    author: "Benjamin Franklin",
    title: "Founding Father, Scientist & Diplomat",
  },
];

const BANKING_QUOTES = [
  {
    quote: "I wish it were possible to obtain a single amendment to our constitution. I would be willing to depend on that alone for the reduction of the administration of our government to the genuine principles of its constitution; I mean an additional article, taking from the federal government the power of borrowing.",
    author: "Thomas Jefferson",
    title: "3rd President of the United States",
  },
  {
    quote: "Bank-paper must be suppressed, and the circulating medium must be restored to the nation to whom it belongs.",
    author: "Thomas Jefferson",
    title: "3rd President of the United States",
  },
  {
    quote: "And I sincerely believe with you, that banking establishments are more dangerous than standing armies; and that the principle of spending money to be paid by posterity, under the name of funding, is but swindling futurity on a large scale.",
    author: "Thomas Jefferson",
    title: "3rd President of the United States",
  },
  {
    quote: "Paper money has had the effect in your state that it will ever have, to ruin commerce, oppress the honest, and open the door to every species of fraud and injustice.",
    author: "George Washington",
    title: "1st President of the United States",
  },
  {
    quote: "All the perplexities, confusion and distress in America arise, not from defects in their Constitution or Confederation, not from want of honor or virtue, so much as from the downright ignorance of the nature of coin, credit and circulation.",
    author: "John Adams",
    title: "2nd President of the United States",
  },
];

const TABS = [
  { id: "faith", label: "Faith & Christian Values" },
  { id: "banking", label: "Banks & Central Banking" },
];

export default function Quotes() {
  const [activeTab, setActiveTab] = useState("faith");
  const quotes = activeTab === "faith" ? FAITH_QUOTES : BANKING_QUOTES;

  return (
    <div className="pt-20 sm:pt-24">
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="font-inter text-xs tracking-[0.3em] text-primary uppercase mb-4">
            Historical Record
          </p>
          <h1 className="font-cinzel text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Founding Quotes
          </h1>
          <p className="font-inter text-muted-foreground max-w-2xl mx-auto mb-8">
            In their own words — the men who built America warned of the dangers of centralized banking and testified to the Christian foundation of our great nation.
          </p>

          {/* Tab switcher */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-lg font-cinzel text-sm tracking-wider transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-card border border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {activeTab === "banking" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 px-4 py-4 bg-red-900/20 border border-red-700/40 rounded-xl text-center max-w-3xl mx-auto"
          >
            <p className="font-inter text-sm text-red-300 leading-relaxed">
              ⚠️ Our Founding Fathers warned us — <strong className="text-red-200">over 200 years ago</strong> — about the dangers of central banking, paper money, and government debt. Their words are more relevant today than ever.
            </p>
          </motion.div>
        )}

        <div className="grid sm:grid-cols-2 gap-6">
          {quotes.map((q, i) => (
            <QuoteCard key={`${activeTab}-${i}`} {...q} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16 space-y-2"
        >
          <p className="font-inter text-xs text-muted-foreground/60">
            Sources:{" "}
            <a
              href="https://www.lwf.org/questions-and-answers/was-america-founded-on-christian-values"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/60 hover:text-primary underline"
            >
              Love Worth Finding Ministries
            </a>
            {" · "}
            <a
              href="https://ammo.com/articles/founding-fathers-quotes-central-banking-americas-economy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/60 hover:text-primary underline"
            >
              Ammo.com
            </a>
          </p>
        </motion.div>
      </section>
    </div>
  );
}