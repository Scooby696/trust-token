import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2, AlertTriangle, TrendingUp, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ReactMarkdown from "react-markdown";

const QUICK_QUESTIONS = [
  "What are the main risks for this token?",
  "Is this token a good long-term hold?",
  "What narrative does this token belong to?",
  "Compare this to Bitcoin and Ethereum risk.",
  "What catalysts could pump or dump this token?",
];

export default function AIResearchPanel({ token, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialAnalysis, setInitialAnalysis] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [showRiskDetail, setShowRiskDetail] = useState(false);

  const runInitialAnalysis = async () => {
    setLoadingInitial(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a crypto risk analyst specializing in Solana ecosystem tokens.

Analyze the following token in depth:
- Token Symbol: ${token.symbol}
- Token Name: ${token.name}
- Current holding: ${token.amount} tokens (~$${token.usdValue?.toFixed(2) || "unknown"} USD value)
- 24h Price Change: ${token.change24h !== undefined ? token.change24h + "%" : "unknown"}
- Narrative: ${token.narrative || "unknown"}

Provide:
1. risk_score: 0-100 (100 = most risky)
2. risk_level: "low" | "medium" | "high" | "extreme"
3. project_summary: 2-3 sentences describing the project
4. bull_case: 2-3 bullet points on why it could succeed
5. bear_case: 2-3 bullet points on risks/why it could fail
6. recommendation: one of "strong_hold" | "hold" | "caution" | "reduce" | "avoid"
7. recommendation_reason: one sentence
8. key_risks: array of 3-5 specific risk strings`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          risk_score: { type: "number" },
          risk_level: { type: "string" },
          project_summary: { type: "string" },
          bull_case: { type: "array", items: { type: "string" } },
          bear_case: { type: "array", items: { type: "string" } },
          recommendation: { type: "string" },
          recommendation_reason: { type: "string" },
          key_risks: { type: "array", items: { type: "string" } },
        }
      }
    });
    setInitialAnalysis(result);
    setLoadingInitial(false);
  };

  React.useEffect(() => { runInitialAnalysis(); }, []);

  const sendMessage = async (text) => {
    const q = text || input.trim();
    if (!q) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: q }];
    setMessages(newMessages);
    setLoading(true);

    const history = newMessages.map((m) => `${m.role === "user" ? "User" : "AI"}: ${m.content}`).join("\n");

    const reply = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert crypto risk analyst. The user is asking about ${token.symbol} (${token.name}).
They hold ${token.amount} tokens worth ~$${token.usdValue?.toFixed(2) || "unknown"}.

Conversation so far:
${history}

Answer the user's latest question with actionable, honest analysis. Be concise but thorough. Use markdown formatting.`,
      add_context_from_internet: true,
    });

    setMessages([...newMessages, { role: "ai", content: reply }]);
    setLoading(false);
  };

  const riskColor = (score) => {
    if (score >= 80) return "text-red-400";
    if (score >= 60) return "text-orange-400";
    if (score >= 40) return "text-yellow-400";
    return "text-green-400";
  };

  const recommendationConfig = {
    strong_hold: { label: "Strong Hold", color: "text-green-400 bg-green-900/20 border-green-700/40" },
    hold: { label: "Hold", color: "text-blue-300 bg-blue-900/20 border-blue-700/40" },
    caution: { label: "Caution", color: "text-yellow-400 bg-yellow-900/20 border-yellow-700/40" },
    reduce: { label: "Reduce Position", color: "text-orange-400 bg-orange-900/20 border-orange-700/40" },
    avoid: { label: "Avoid / Sell", color: "text-red-400 bg-red-900/20 border-red-700/40" },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
          className="bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-cinzel font-bold text-foreground">AI Research: {token.symbol}</span>
              {token.name && <span className="font-inter text-xs text-muted-foreground">· {token.name}</span>}
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Initial AI Analysis */}
            {loadingInitial ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="font-inter text-sm text-muted-foreground">Analyzing {token.symbol}...</p>
              </div>
            ) : initialAnalysis ? (
              <div className="space-y-4">
                {/* Risk Score */}
                <div className="bg-background border border-border/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-cinzel text-sm font-bold text-foreground">Risk Assessment</span>
                    <span className={`font-cinzel text-2xl font-bold ${riskColor(initialAnalysis.risk_score)}`}>
                      {initialAnalysis.risk_score}/100
                    </span>
                  </div>
                  {/* Risk bar */}
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${initialAnalysis.risk_score}%`,
                        background: initialAnalysis.risk_score >= 80 ? "#f87171" : initialAnalysis.risk_score >= 60 ? "#fb923c" : initialAnalysis.risk_score >= 40 ? "#facc15" : "#4ade80"
                      }}
                    />
                  </div>

                  {/* Recommendation */}
                  {initialAnalysis.recommendation && (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-inter border mb-3 ${recommendationConfig[initialAnalysis.recommendation]?.color || "text-muted-foreground border-border"}`}>
                      <Shield className="w-3 h-3" />
                      {recommendationConfig[initialAnalysis.recommendation]?.label}
                    </div>
                  )}
                  {initialAnalysis.recommendation_reason && (
                    <p className="font-inter text-xs text-muted-foreground">{initialAnalysis.recommendation_reason}</p>
                  )}
                </div>

                {/* Summary */}
                {initialAnalysis.project_summary && (
                  <div className="bg-background border border-border/50 rounded-xl p-4">
                    <p className="font-cinzel text-xs font-bold text-primary uppercase tracking-wider mb-2">Project Overview</p>
                    <p className="font-inter text-sm text-foreground/80 leading-relaxed">{initialAnalysis.project_summary}</p>
                  </div>
                )}

                {/* Bull / Bear */}
                <button
                  onClick={() => setShowRiskDetail(!showRiskDetail)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-background border border-border/50 rounded-xl font-inter text-sm text-foreground hover:border-primary/30 transition-colors"
                >
                  <span className="font-cinzel text-sm font-bold">Bull & Bear Case</span>
                  {showRiskDetail ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showRiskDetail && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="bg-green-900/10 border border-green-800/30 rounded-xl p-4">
                      <p className="font-cinzel text-xs font-bold text-green-400 mb-2 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Bull Case
                      </p>
                      <ul className="space-y-1.5">
                        {(initialAnalysis.bull_case || []).map((point, i) => (
                          <li key={i} className="font-inter text-xs text-foreground/75 flex gap-2">
                            <span className="text-green-400 shrink-0">✓</span>{point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-900/10 border border-red-800/30 rounded-xl p-4">
                      <p className="font-cinzel text-xs font-bold text-red-400 mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Bear Case
                      </p>
                      <ul className="space-y-1.5">
                        {(initialAnalysis.bear_case || []).map((point, i) => (
                          <li key={i} className="font-inter text-xs text-foreground/75 flex gap-2">
                            <span className="text-red-400 shrink-0">✗</span>{point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Key Risks */}
                {initialAnalysis.key_risks?.length > 0 && (
                  <div className="bg-background border border-border/50 rounded-xl p-4">
                    <p className="font-cinzel text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">Key Risks</p>
                    <div className="flex flex-wrap gap-2">
                      {initialAnalysis.key_risks.map((risk, i) => (
                        <span key={i} className="px-2 py-1 bg-orange-900/20 border border-orange-800/30 text-orange-300 rounded-lg text-xs font-inter">
                          ⚠ {risk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* Chat messages */}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-background border border-border/50"}`}>
                  {msg.role === "user" ? (
                    <p className="font-inter text-sm">{msg.content}</p>
                  ) : (
                    <ReactMarkdown className="font-inter text-sm prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-background border border-border/50 rounded-2xl px-4 py-3">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Quick questions */}
          <div className="px-4 py-2 border-t border-border/30 shrink-0 overflow-x-auto">
            <div className="flex gap-2 pb-1">
              {QUICK_QUESTIONS.map((q) => (
                <button key={q} onClick={() => sendMessage(q)} disabled={loading}
                  className="shrink-0 px-3 py-1.5 bg-background border border-border text-muted-foreground rounded-full text-xs font-inter hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-50">
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/50 shrink-0 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
              placeholder={`Ask anything about ${token.symbol}...`}
              disabled={loading}
              className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-inter text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-cinzel text-xs tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}