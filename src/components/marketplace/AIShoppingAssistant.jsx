import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Send, Loader2, ShoppingBag, RotateCcw } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ReactMarkdown from "react-markdown";

const QUICK_PROMPTS = [
  { icon: "🍳", text: "Best American cookware brands" },
  { icon: "👢", text: "USA-made boots and footwear" },
  { icon: "🛠️", text: "American-made tools and hardware" },
  { icon: "🏋️", text: "Fitness equipment made in USA" },
  { icon: "👔", text: "American workwear and clothing" },
  { icon: "🎸", text: "Made in USA musical instruments" },
  { icon: "🧸", text: "American-made toys and gifts" },
  { icon: "🪑", text: "USA furniture makers" },
];

const SYSTEM_PROMPT = `You are an expert American-made shopping assistant for MADEINUSA DIGITAL marketplace. Your ONLY job is to help users find American-made products, companies, and services.

You have deep knowledge of the 100 companies listed on AllAmericanClothing.com including:
All-Clad (cookware, PA), American Blanket Company (blankets, MA), American Eco Furniture (eco furniture), American Mule Company (copper mugs, AZ), American Skillet Company (cast iron, WI), Arm and Hammer (household, PA), Arctic Gear (hats, NY), Baby Eco Trends (baby furniture, GA), American Bicycle Group (titanium bikes, TN), Bates Footwear (tactical boots, IN), Bear Mattress (mattresses), Benchmade (knives, OR), Big Agnes (camping gear, CO), Bison Coolers (coolers, TX), Brooks Running (running shoes, WA), Buck Knives (hunting knives, ID), Carhartt (workwear, MI), Darn Tough Vermont (wool socks, VT), Diamond Brand Gear (canvas camping, NC), Estwing (steel tools, IL), Fender (guitars, CA), Filson (canvas bags, WA), Flag and Anthem (casual apparel, TN), GORUCK (tactical packs, FL), Green Toys (eco toys, CA), Grovemade (desk accessories, OR), Herman Miller (ergonomic furniture, MI), Igloo Products (coolers, TX), Leatherman (multi-tools, OR), Liberty Safe (gun safes, UT), Lodge Cast Iron (cast iron, TN), Louisville Slugger (baseball bats, KY), New Balance (athletic shoes, MA), Nokona Baseball (baseball gloves, TX), Nordicware (bakeware, MN), Old Hickory Knife Company (knives, TN), Pendleton (wool blankets, OR), Redwing Heritage (work boots, MN), Rogue Fitness (gym equipment, OH), Schott NYC (leather jackets, NJ), Smith & Wesson (firearms, MA), Solo Stove (camp stoves, TX), Steelcase (office furniture, MI), Stormy Kromer (wool caps, MI), Surefire (flashlights, CA), Tanner Goods (leather goods, OR), Vermont Teddy Bear (teddy bears, VT), Vitamix (blenders, OH), Wolverine Boots (work boots, MI), Yeti (coolers/drinkware, TX).

RULES:
- ONLY recommend American-made products and companies
- If asked about non-American products, redirect to American alternatives
- Be specific with company names, locations, and product types
- Be enthusiastic and patriotic
- Give actionable shopping recommendations
- Format responses with markdown for readability
- Include direct links when referencing specific companies`;

export default function AIShoppingAssistant({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "**Welcome to the MADEINUSA AI Shopping Assistant!** 🇺🇸\n\nI specialize exclusively in American-made products and companies. I can help you find the perfect USA-made goods across all 100 companies in our directory and beyond.\n\nWhat are you shopping for today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setLoading(true);

    const history = newMessages.slice(0, -1).map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n\n");

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `${SYSTEM_PROMPT}\n\nConversation history:\n${history}\n\nUser: ${msg}\n\nAssistant:`,
      add_context_from_internet: true,
    });

    setMessages([...newMessages, { role: "assistant", content: result }]);
    setLoading(false);
  };

  const reset = () => setMessages([{
    role: "assistant",
    content: "**Welcome to the MADEINUSA AI Shopping Assistant!** 🇺🇸\n\nI specialize exclusively in American-made products and companies. What are you shopping for today?"
  }]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40 }}
          className="w-full max-w-2xl bg-card border border-border/50 rounded-2xl overflow-hidden flex flex-col"
          style={{ height: "min(90vh, 680px)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 bg-gradient-to-r from-blue-950/50 to-red-950/30 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/20 border border-primary/30 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-cinzel font-bold text-foreground text-sm">AI Shopping Assistant</p>
                <p className="font-inter text-xs text-primary">American-made products only 🇺🇸</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={reset} className="text-muted-foreground hover:text-foreground transition-colors" title="New conversation">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
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
                      className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_a]:text-primary [&_a:hover]:text-primary/80"
                      components={{
                        a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline">{children}</a>,
                        p: ({ children }) => <p className="my-1.5 leading-relaxed">{children}</p>,
                        ul: ({ children }) => <ul className="my-2 ml-4 list-disc space-y-1">{children}</ul>,
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
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
                  <span className="font-inter text-xs text-muted-foreground">Finding American-made options...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 1 && (
            <div className="px-5 pb-3 shrink-0">
              <p className="font-inter text-xs text-muted-foreground mb-2">Quick searches:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((p) => (
                  <button key={p.text} onClick={() => send(p.text)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-full text-xs font-inter text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">
                    <span>{p.icon}</span> {p.text}
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
                onKeyDown={(e) => e.key === "Enter" && !loading && send()}
                placeholder="Ask about any American-made product..."
                disabled={loading}
                className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-inter text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="font-inter text-xs text-muted-foreground/50 mt-2 text-center">Only recommends American-made products and companies</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}