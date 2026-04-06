import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Newspaper, ExternalLink, RefreshCw, Loader2, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";

export default function LatestUpdates() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdates = async () => {
      setLoading(true);
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a news curator for "Made in USA Digital", a patriotic American-made marketplace and TRUST TOKEN crypto project on Solana.

Fetch and summarize the 4 most recent and relevant news items about: American manufacturing, Made in USA initiatives, US economic patriotism, US crypto regulation, Solana ecosystem news, or American small business support.

For each item provide:
- title: compelling headline (max 80 chars)
- source: publication name (e.g. Reuters, Forbes, Bloomberg, CoinDesk, Manufacturing Today)
- summary: 1-sentence summary relevant to American makers and buyers (max 150 chars)
- url: real URL to the article or publication
- category: one of [Manufacturing, Crypto, Policy, Business, Solana]
- date: approximate like "Today", "Yesterday", "2 days ago"`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            articles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  source: { type: "string" },
                  summary: { type: "string" },
                  url: { type: "string" },
                  category: { type: "string" },
                  date: { type: "string" },
                },
              },
            },
          },
        },
      });
      setArticles(result?.articles || []);
      setLoading(false);
    };
    fetchUpdates();
  }, []);

  const categoryColors = {
    Manufacturing: "bg-blue-900/40 text-blue-300",
    Crypto: "bg-purple-900/40 text-purple-300",
    Policy: "bg-red-900/40 text-red-300",
    Business: "bg-green-900/40 text-green-300",
    Solana: "bg-violet-900/40 text-violet-300",
  };

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-border/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4"
        >
          <div>
            <p className="font-inter text-xs tracking-[0.3em] text-primary uppercase mb-2">Stay Informed</p>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-foreground">
              Latest Updates
            </h2>
          </div>
          <Link
            to="/news"
            className="inline-flex items-center gap-2 font-inter text-sm text-primary hover:text-primary/80 tracking-wider transition-colors"
          >
            View All News <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {articles.map((article, i) => (
              <motion.a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group bg-card border border-border/50 rounded-xl p-5 flex flex-col hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-inter ${categoryColors[article.category] || "bg-muted text-muted-foreground"}`}>
                    {article.category}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </div>

                <h3 className="font-cinzel font-bold text-foreground text-sm leading-snug mb-2 group-hover:text-primary transition-colors flex-1">
                  {article.title}
                </h3>

                <p className="font-inter text-xs text-muted-foreground leading-relaxed mb-4">
                  {article.summary}
                </p>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/30">
                  <span className="font-inter text-xs font-semibold text-muted-foreground">{article.source}</span>
                  <span className="font-inter text-xs text-muted-foreground/50">{article.date}</span>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}