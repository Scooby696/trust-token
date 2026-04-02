import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Clock, CheckCircle2, XCircle, AlertCircle, ShieldCheck, FileText, ArrowRight, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";

const STATUS_CONFIG = {
  submitted: {
    icon: Clock,
    label: "Submitted",
    color: "text-blue-400",
    bg: "bg-blue-900/30 border-blue-700/40",
    desc: "Your application has been received and is queued for review.",
    step: 1,
  },
  under_review: {
    icon: AlertCircle,
    label: "Under Review",
    color: "text-yellow-400",
    bg: "bg-yellow-900/30 border-yellow-700/40",
    desc: "Our team is actively reviewing your documents and credentials.",
    step: 2,
  },
  approved: {
    icon: CheckCircle2,
    label: "Approved",
    color: "text-green-400",
    bg: "bg-green-900/30 border-green-700/40",
    desc: "Congratulations! Your business is verified and listed on the Marketplace.",
    step: 3,
  },
  rejected: {
    icon: XCircle,
    label: "Not Approved",
    color: "text-red-400",
    bg: "bg-red-900/30 border-red-700/40",
    desc: "Your application was not approved. See reviewer notes below.",
    step: 0,
  },
};

const TIMELINE_STEPS = [
  { label: "Application Submitted", desc: "We received your application" },
  { label: "Document Review", desc: "Verifying your documents & credentials" },
  { label: "USA Verification", desc: "Confirming Made in USA status" },
  { label: "Approved & Live", desc: "Your listing is active on the Marketplace" },
];

export default function ApplicationStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  const [email, setEmail] = useState(urlParams.get("email") || "");
  const [searched, setSearched] = useState(!!urlParams.get("email"));
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setNotFound(false);
    const results = await base44.entities.CreatorApplication.filter({ email: email.trim().toLowerCase() });
    setApplications(results);
    setNotFound(results.length === 0);
    setSearched(true);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="pt-20 sm:pt-24 min-h-screen">
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Clock className="w-6 h-6 text-primary" />
            <p className="font-inter text-xs tracking-[0.3em] text-primary uppercase">Application Tracker</p>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-foreground mb-3">Check Application Status</h1>
          <p className="font-inter text-muted-foreground text-sm max-w-md mx-auto">
            Enter the email address you used to apply and we'll show you the status of your KYC verification.
          </p>
        </motion.div>

        {/* Search Box */}
        <div className="bg-card border border-border/50 rounded-xl p-6 mb-8">
          <label className="block font-inter text-xs text-muted-foreground mb-2">Application Email Address</label>
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="yourname@example.com"
              className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-inter text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !email.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-cinzel text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Results */}
        {searched && notFound && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-cinzel text-xl text-foreground mb-2">No Application Found</p>
            <p className="font-inter text-sm text-muted-foreground mb-6">No application was found for <strong>{email}</strong>. Double-check the email or submit a new application.</p>
            <Link to="/apply" className="inline-flex items-center gap-2 font-cinzel tracking-wider text-sm px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Apply Now <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}

        {applications.map((app, idx) => {
          const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.submitted;
          const Icon = cfg.icon;
          const currentStep = cfg.step;

          return (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border border-border/50 rounded-xl overflow-hidden mb-6"
            >
              {/* Status Header */}
              <div className={`px-6 py-4 border-b border-border/30 flex items-center justify-between gap-4 ${cfg.bg} border`}>
                <div className="flex items-center gap-3">
                  <Icon className={`w-6 h-6 ${cfg.color}`} />
                  <div>
                    <p className={`font-cinzel font-bold text-sm ${cfg.color}`}>{cfg.label}</p>
                    <p className="font-inter text-xs text-muted-foreground">{cfg.desc}</p>
                  </div>
                </div>
                <span className="font-inter text-xs text-muted-foreground shrink-0">
                  {new Date(app.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>

              {/* Business Details */}
              <div className="px-6 py-4 border-b border-border/30">
                <p className="font-cinzel font-bold text-foreground text-base mb-1">{app.business_name}</p>
                <div className="flex flex-wrap gap-3 text-xs font-inter text-muted-foreground">
                  <span>{app.location}</span>
                  <span>·</span>
                  <span className="capitalize">{app.category}</span>
                  <span>·</span>
                  <span className="capitalize">{app.type} products</span>
                </div>
              </div>

              {/* Progress Timeline */}
              {app.status !== "rejected" && (
                <div className="px-6 py-5 border-b border-border/30">
                  <p className="font-cinzel text-xs font-semibold text-foreground mb-4 tracking-wider">VERIFICATION PROGRESS</p>
                  <div className="space-y-3">
                    {TIMELINE_STEPS.map((ts, i) => {
                      const isComplete = i < currentStep;
                      const isActive = i === currentStep - 1 || (currentStep === 0 && i === 0);
                      return (
                        <div key={ts.label} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isComplete ? "bg-green-700" : isActive ? "bg-primary/30 border border-primary" : "bg-muted border border-border"}`}>
                            {isComplete
                              ? <CheckCircle2 className="w-3 h-3 text-green-300" />
                              : isActive
                                ? <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                : <div className="w-1.5 h-1.5 bg-border rounded-full" />
                            }
                          </div>
                          <div>
                            <p className={`font-inter text-xs font-semibold ${isComplete ? "text-green-300" : isActive ? "text-foreground" : "text-muted-foreground"}`}>{ts.label}</p>
                            <p className="font-inter text-xs text-muted-foreground/70">{ts.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Documents Checklist */}
              <div className="px-6 py-4 border-b border-border/30">
                <p className="font-cinzel text-xs font-semibold text-foreground mb-3 tracking-wider">SUBMITTED DOCUMENTS</p>
                <div className="space-y-2">
                  <DocRow label="Government ID" uploaded={!!app.id_document_url} />
                  <DocRow label="Business License" uploaded={!!app.business_license_url} />
                  <DocRow label="Made in USA Certification" uploaded={!!app.certification_url} certType={app.certification_type} />
                </div>
              </div>

              {/* Review Notes (if rejected) */}
              {app.status === "rejected" && app.review_notes && (
                <div className="px-6 py-4 bg-red-950/20 border-b border-red-900/30">
                  <p className="font-cinzel text-xs font-semibold text-red-400 mb-2">REVIEWER NOTES</p>
                  <p className="font-inter text-sm text-muted-foreground leading-relaxed">{app.review_notes}</p>
                </div>
              )}

              {/* Approved CTA */}
              {app.status === "approved" && (
                <div className="px-6 py-4 bg-green-950/20">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-green-400 shrink-0" />
                    <p className="font-inter text-xs text-green-300">Your business is verified and live on the Marketplace!</p>
                    <Link to="/marketplace" className="ml-auto font-cinzel text-xs text-primary hover:underline whitespace-nowrap">View Marketplace →</Link>
                  </div>
                </div>
              )}

              {/* Rejected re-apply CTA */}
              {app.status === "rejected" && (
                <div className="px-6 py-4">
                  <Link to="/apply" className="inline-flex items-center gap-2 font-cinzel tracking-wider text-xs px-4 py-2 border border-primary/30 text-primary rounded-lg hover:bg-primary/10 transition-colors">
                    Submit New Application <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </motion.div>
          );
        })}
      </section>
    </div>
  );
}

function DocRow({ label, uploaded, certType }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-inter text-xs text-muted-foreground">{label}{certType ? ` (${certType})` : ""}</span>
      {uploaded
        ? <span className="flex items-center gap-1 font-inter text-xs text-green-400"><CheckCircle2 className="w-3 h-3" /> Uploaded</span>
        : <span className="flex items-center gap-1 font-inter text-xs text-muted-foreground/50"><XCircle className="w-3 h-3" /> Not provided</span>
      }
    </div>
  );
}