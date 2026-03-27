import React from "react";
import { motion } from "framer-motion";
import QuoteCard from "../components/QuoteCard";

const ALL_QUOTES = [
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

export default function Quotes() {
  return (
    <div className="pt-20 sm:pt-24">
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="font-inter text-xs tracking-[0.3em] text-primary uppercase mb-4">
            Historical Record
          </p>
          <h1 className="font-cinzel text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Founding Quotes
          </h1>
          <p className="font-inter text-muted-foreground max-w-2xl mx-auto">
            In their own words — the men who built America testified to the
            Christian foundation of our great nation.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {ALL_QUOTES.map((q, i) => (
            <QuoteCard key={i} {...q} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="font-inter text-xs text-muted-foreground/60">
            Source:{" "}
            <a
              href="https://www.lwf.org/questions-and-answers/was-america-founded-on-christian-values"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/60 hover:text-primary underline"
            >
              Love Worth Finding Ministries
            </a>
          </p>
        </motion.div>
      </section>
    </div>
  );
}