import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Send, Loader2, RotateCcw, ClipboardList, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ReactMarkdown from "react-markdown";

const SURVEY_QUESTIONS = [
  {
    id: "service_type",
    question: "What type of digital service are you looking for?",
    options: ["Cryptocurrency Exchange", "Blockchain Development", "DeFi / Web3", "NFT / Gaming", "Payments & Fintech", "Custody & Banking", "Analytics / Compliance", "Developer Tools", "Something else"],
  },
  {
    id: "budget",
    question: "What's your approximate budget or scale?",
    options: ["Just exploring / free tiers", "Small business ($0–$1k/mo)", "Mid-size ($1k–$10k/mo)", "Enterprise ($10k+/mo)", "Investment / funding"],
  },
  {
    id: "priority",
    question: "What matters most to you?",
    options: ["Security & Compliance (US regulated)", "Low fees", "Speed & performance", "Developer APIs", "Customer support", "Ease of use"],
  },
  {
    id: "us_only",
    question: "Do you need a strictly US-based / US-regulated provider?",
    options: ["Yes, US-based only", "Preferred but not required", "No preference"],
  },
];

const SYSTEM_PROMPT = `You are an expert AI concierge for the MADEINUSA DIGITAL Services Directory — a curated directory of 100+ verified US-based cryptocurrency, blockchain, and digital services companies.

Your job is to match users with the best verified US-based digital service providers based on their needs. You also search the internet for additional verified US-based providers when needed.

You know our directory deeply including: Coinbase, Kraken, Gemini, Ripple, Circle (USDC), Paxos, Chainalysis, Fireblocks, BitGo, Anchorage Digital, Alchemy, Infura, QuickNode, The Graph, TRM Labs, Elliptic, CipherTrace, Uniswap, Compound, dYdX, BitPay, MoonPay, OpenSea, Dapper Labs, Yuga Labs, a16z Crypto, Multicoin, Pantera, Polygon, Arbitrum, Solana Labs, Aptos, Sui, Hedera, Chainlink, Avalanche, Filecoin, Helium, Messari, Nansen, Dune Analytics, Certik, OpenZeppelin, and many more.

RULES:
- ONLY recommend US-based or US-regulated providers
- Be specific: name companies, explain why they match, link their websites
- If user has survey answers, use them to personalize recommendations
- Format nicely with markdown — use headers, bullet points, bold company names
- For each recommendation include: company name, what they do, why it's a match, website
- Always mention if a company is in our verified directory vs found via web search
- Be concise but thorough`;

export default function AIProviderSearch({ onClose }) {
  const [phase, setPhase] = useState("chat"); // "survey" | "chat"
  const [surveyStep, setSurveyStep] = useState(0);
  const [surveyAnswers, setSurveyAnswers] = useState({});
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "**Welcome to the MADEINUSA Digital Services AI Search!** 🇺🇸\n\nI can help you find the perfect verified US-based digital service provider — from crypto exchanges to blockchain developers, DeFi platforms, and more.\n\nWould you like to take a quick survey to get personalized recommendations, or just ask me directly?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, phase]);

  const startSurvey = () => setPhase("survey");

  const answerSurvey = (answer) => {
    const q = SURVEY_QUESTIONS[surveyStep];
    const updated = { ...surveyAnswers, [q.id]: answer };
    setSurveyAnswers(updated);

    if (surveyStep < SURVEY_QUESTIONS.length - 1) {
      setSurveyStep((s) => s + 1);
    } else {
      // Survey done — jump to chat with context
      setPhase("chat");
      const surveyContext = Object.entries(updated)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      sendMessage(`Based on my survey: ${surveyContext}. Please recommend the best US-based digital service providers for me.`, updated);
    }
  };

  const sendMessage = async (text, surveyCtx = null) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setLoading(true);

    const surveyInfo = surveyCtx || surveyAnswers;
    const surveySection = Object.keys(surveyInfo).length
      ? `\n\nUser survey answers: ${Object.entries(surveyInfo).map(([k, v]) => `${k}=${v}`).join(", ")}`
      : "";

    const history = newMessages
      .slice(0, -1)
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `${SYSTEM_PROMPT}${surveySection}\n\nConversation:\n${history}\n\nUser: ${msg}\n\nAssistant:`,
      add_context_from_internet: true,
    });

    setMessages([...newMessages, { role: "assistant", content: result }]);
    setLoading(false);
  };

  const reset = () => {
    setMessages([{
      role: "assistant",
      content: "**Welcome back!** 🇺🇸\n\nI help you find verified US-based digital service providers. Would you like to take the quick survey for personalized recommendations, or ask me directly?",
    }]);
    setPhase("chat");
    setSurveyStep(0);
    setSurveyAnswers({});
  };

  const currentQ = SURVEY_QUESTIONS[surveyStep];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40 }}
          className="w-full max-w-2xl bg-card border border-border/50 rounded-2xl overflow-hidden flex flex-col"
          style={{ height: "min(92vh, 700px)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 bg-gradient-to-r from-cyan-950/50 to-purple-950/30 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/20 border border-primary/30 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-cinzel font-bold text-foreground text-sm">AI Provider Search</p>
                <p className="font-inter text-xs text-primary">US-verified digital services 🇺🇸</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {phase === "chat" && (
                <button onClick={startSurvey} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-lg text-xs font-inter hover:bg-primary/20 transition-colors">
                  <ClipboardList className="w-3.5 h-3.5" /> Survey
                </button>
              )}
              <button onClick={reset} className="text-muted-foreground hover:text-foreground transition-colors" title="Reset">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Survey Phase */}
          {phase === "survey" && (
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 overflow-y-auto">
              <div className="w-full max-w-lg">
                {/* Progress */}
                <div className="flex items-center gap-1.5 mb-6">
                  {SURVEY_QUESTIONS.map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= surveyStep ? "bg-primary" : "bg-border"}`} />
                  ))}
                </div>
                <p className="font-inter text-xs text-primary mb-2 tracking-wider uppercase">Question {surveyStep + 1} of {SURVEY_QUESTIONS.length}</p>
                <h3 className="font-cinzel text-lg font-semibold text-foreground mb-5">{currentQ.question}</h3>
                <div className="space-y-2">
                  {currentQ.options.map((opt) => (
                    <button key={opt} onClick={() => answerSurvey(opt)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-background border border-border rounded-xl text-sm font-inter text-muted-foreground hover:border-primary/50 hover:text-primary transition-all text-left group">
                      {opt}
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
                <button onClick={() => setPhase("chat")} className="mt-4 w-full text-center font-inter text-xs text-muted-foreground/50 hover:text-muted-foreground">
                  Skip survey — ask directly
                </button>
              </div>
            </div>
          )}

          {/* Chat Phase */}
          {phase === "chat" && (
            <>
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    {m.role === "assistant" && (
                      <div className="w-7 h-7 bg-primary/20 rounded-lg flex items-center justify-center mr-2 shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                      </div>
                    )}
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-inter ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-background border border-border/50 text-foreground rounded-tl-sm"
                    }`}>
                      {m.role === "assistant" ? (
                        <ReactMarkdown
                          className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_a]:text-primary"
                          components={{
                            a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline">{children}</a>,
                            p: ({ children }) => <p className="my-1.5 leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="my-2 ml-4 list-disc space-y-1">{children}</ul>,
                            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                            strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
                            h3: ({ children }) => <h3 className="font-cinzel text-sm font-bold text-foreground my-2">{children}</h3>,
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      ) : (
                        <p>{m.content}</p>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 bg-primary/20 rounded-lg flex items-center justify-center mr-2 shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="bg-background border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      <span className="font-inter text-xs text-muted-foreground">Searching verified US providers...</span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick prompts (first message only) */}
              {messages.length <= 1 && (
                <div className="px-5 pb-3 shrink-0">
                  <p className="font-inter text-xs text-muted-foreground mb-2">Quick searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Best US crypto exchange for beginners",
                      "US blockchain developers for hire",
                      "DeFi yield platforms US regulated",
                      "US stablecoin providers",
                      "NFT marketplace US based",
                    ].map((p) => (
                      <button key={p} onClick={() => sendMessage(p)}
                        className="px-3 py-1.5 bg-background border border-border rounded-full text-xs font-inter text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="px-5 py-4 border-t border-border/50 shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
                    placeholder="Describe what you need..."
                    disabled={loading}
                    className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-inter text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                    className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-inter text-xs text-muted-foreground/50 mt-2 text-center">Searches our directory + the web for verified US providers</p>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}