import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Send, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ReactMarkdown from "react-markdown";

const SUGGESTIONS = [
  "Find me USA-made leather bags",
  "What American companies make cast iron cookware?",
  "I need patriotic clothing made in the USA",
  "Find American-made outdoor gear",
  "What digital services are listed here?",
  "Show me American furniture makers",
];

export default function AISearchPanel({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your **MADEINUSA AI assistant**. I can help you find American-made products, verified companies, and connect you with USA creators. What are you looking for today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: msg }]);
    setLoading(true);

    const history = messages.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n");

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are the MADEINUSA AI assistant helping users find American-made products, companies, goods, and services.
      
You have knowledge of these curated American-made directories and companies:
- Made Index (madeindex.com): Clothing, bags, home goods, accessories all made in USA
- All American Clothing (allamericanclothing.com): 100 American companies across all categories  
- Authenticity50 (authenticity50.com): Guide to American-made products

Key categories: Clothing, Accessories, Home & Kitchen, Furniture, Outdoor & Sport, Health & Beauty, Technology, Food & Beverage, Tools & Hardware, Services & Digital.

Notable companies include: All-Clad, Lodge Cast Iron, Finex, Vitamix, Liberty Tabletop, GORUCK, Filson, Duluth Pack, Tanner Goods, Pendleton, Authenticity50, Grovemade, Room and Board, All American Clothing Co, Hertling USA, Loyal Stricklin, KILLSPENCER, Sophie Buhai, and many more.

Users can also apply to list their own American-made business at /apply (requires KYC verification).

Conversation history:
${history}

User's latest message: ${msg}

Respond helpfully, enthusiastically, and patriotically. Suggest specific companies and products when relevant. Keep responses concise and useful. Use markdown for formatting.`,
      add_context_from_internet: true,
    });

    setMessages((m) => [...m, { role: "assistant", content: result }]);
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40 }}
          className="w-full max-w-2xl bg-card border border-border/50 rounded-2xl overflow-hidden flex flex-col"
          style={{ maxHeight: "85vh" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-cinzel font-semibold text-foreground text-sm">AI Product Finder</p>
                <p className="font-inter text-xs text-muted-foreground">Powered by MADEINUSA AI</p>
              </div>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm font-inter ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border/50 text-foreground"
                }`}>
                  {m.role === "assistant" ? (
                    <ReactMarkdown className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                      {m.content}
                    </ReactMarkdown>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-background border border-border/50 rounded-xl px-4 py-3">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-5 pb-3 flex flex-wrap gap-2 shrink-0">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)}
                  className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-inter text-primary hover:bg-primary/20 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-5 pb-4 pt-2 border-t border-border/50 shrink-0">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && send()}
                placeholder="Ask about American-made products..."
                disabled={loading}
                className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-inter text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}