import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Upload, ShieldCheck, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STEPS = ["Business Info", "USA Verification", "Documents", "Review & Submit"];

const CATEGORIES = ["Clothing", "Accessories", "Home & Kitchen", "Food & Beverage", "Health & Beauty", "Technology", "Outdoor & Sport", "Furniture", "Tools & Hardware", "Services & Digital", "Other"];
const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];

export default function Apply() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    business_name: "", owner_name: "", email: "", phone: "",
    website: "", location: "", state_of_incorporation: "",
    ein_number: "", category: "", product_description: "",
    made_in_usa_proof: "", id_document_url: "", business_license_url: "",
    type: "physical", social_instagram: "", social_x: "", agree_terms: false,
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set(field, file_url);
    setUploading(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await base44.entities.CreatorApplication.create({ ...form, status: "submitted", kyc_submitted: true });
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-20 sm:pt-24 min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg text-center">
          <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="font-cinzel text-3xl font-bold text-foreground mb-4">Application Submitted!</h2>
          <p className="font-inter text-muted-foreground leading-relaxed mb-4">
            Thank you, <strong>{form.business_name}</strong>. Your KYC application is under review. Our team will verify your USA manufacturing credentials and reach out within 3–5 business days.
          </p>
          <div className="bg-card border border-border/50 rounded-lg p-4 text-left text-sm font-inter text-muted-foreground">
            <p className="font-semibold text-foreground mb-2">What happens next?</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Admin reviews your business documents</li>
              <li>EIN and state registration verified</li>
              <li>USA manufacturing claim confirmed</li>
              <li>Your listing goes live on the Marketplace</li>
            </ol>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-24 min-h-screen">
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <p className="font-inter text-xs tracking-[0.3em] text-primary uppercase">KYC Verification</p>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-foreground mb-3">Apply to List Your Business</h1>
          <p className="font-inter text-muted-foreground text-sm">
            Only verified American-made businesses are approved. We confirm your EIN, state registration, and USA manufacturing.
          </p>
        </motion.div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-inter transition-all ${i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-green-800 text-green-200" : "bg-card border border-border text-muted-foreground"}`}>
                {i < step ? <CheckCircle2 className="w-3 h-3" /> : <span>{i + 1}</span>}
                {s}
              </div>
              {i < STEPS.length - 1 && <div className="w-4 h-px bg-border" />}
            </div>
          ))}
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6 sm:p-8">
          {/* Step 0: Business Info */}
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="font-cinzel font-semibold text-foreground text-lg mb-4">Business Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Business Name *" value={form.business_name} onChange={(v) => set("business_name", v)} placeholder="Eagle Craft Co." />
                <Field label="Owner Name *" value={form.owner_name} onChange={(v) => set("owner_name", v)} placeholder="John Smith" />
                <Field label="Email *" type="email" value={form.email} onChange={(v) => set("email", v)} placeholder="john@example.com" />
                <Field label="Phone" type="tel" value={form.phone} onChange={(v) => set("phone", v)} placeholder="(555) 123-4567" />
                <Field label="Website" value={form.website} onChange={(v) => set("website", v)} placeholder="https://yoursite.com" />
                <Field label="City, State *" value={form.location} onChange={(v) => set("location", v)} placeholder="Austin, TX" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-inter text-xs text-muted-foreground mb-1.5">Category *</label>
                  <select value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-inter text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-inter text-xs text-muted-foreground mb-1.5">Type of Goods/Services *</label>
                  <select value={form.type} onChange={(e) => set("type", e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-inter text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="physical">Physical Products</option>
                    <option value="digital">Digital Products/Services</option>
                    <option value="both">Both Physical & Digital</option>
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="X / Twitter Handle" value={form.social_x} onChange={(v) => set("social_x", v)} placeholder="@handle" />
                <Field label="Instagram Handle" value={form.social_instagram} onChange={(v) => set("social_instagram", v)} placeholder="@handle" />
              </div>
            </div>
          )}

          {/* Step 1: USA Verification */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-cinzel font-semibold text-foreground text-lg mb-4">USA Verification</h3>
              <div className="bg-blue-950/40 border border-blue-800/30 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="font-inter text-xs text-blue-300 leading-relaxed">
                  To be listed, your products must be substantially made in the United States. "Made in USA" means all or virtually all of the product has been made in America.
                </p>
              </div>
              <div>
                <label className="block font-inter text-xs text-muted-foreground mb-1.5">EIN (Employer Identification Number) *</label>
                <input value={form.ein_number} onChange={(e) => set("ein_number", e.target.value)} placeholder="XX-XXXXXXX" className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-inter text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block font-inter text-xs text-muted-foreground mb-1.5">State of Incorporation *</label>
                <select value={form.state_of_incorporation} onChange={(e) => set("state_of_incorporation", e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-inter text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="">Select state</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-inter text-xs text-muted-foreground mb-1.5">Describe your products/services *</label>
                <textarea rows={3} value={form.product_description} onChange={(e) => set("product_description", e.target.value)} placeholder="E.g. We hand-stitch leather wallets in our Nashville workshop..." className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-inter text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
              <div>
                <label className="block font-inter text-xs text-muted-foreground mb-1.5">How are your products made in the USA? *</label>
                <textarea rows={4} value={form.made_in_usa_proof} onChange={(e) => set("made_in_usa_proof", e.target.value)} placeholder="Describe your manufacturing process, where materials are sourced, where assembly happens, and any certifications..." className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-inter text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
            </div>
          )}

          {/* Step 2: Documents */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="font-cinzel font-semibold text-foreground text-lg mb-4">Upload Documents</h3>
              <UploadField
                label="Government-Issued ID (owner) *"
                hint="Driver's license, passport, or state ID"
                value={form.id_document_url}
                uploading={uploading}
                onChange={(e) => handleFileUpload(e, "id_document_url")}
              />
              <UploadField
                label="Business License or Articles of Incorporation"
                hint="State business registration document"
                value={form.business_license_url}
                uploading={uploading}
                onChange={(e) => handleFileUpload(e, "business_license_url")}
              />
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-cinzel font-semibold text-foreground text-lg mb-4">Review & Submit</h3>
              <ReviewRow label="Business" value={form.business_name} />
              <ReviewRow label="Owner" value={form.owner_name} />
              <ReviewRow label="Email" value={form.email} />
              <ReviewRow label="Location" value={form.location} />
              <ReviewRow label="Category" value={form.category} />
              <ReviewRow label="EIN" value={form.ein_number} />
              <ReviewRow label="State Inc." value={form.state_of_incorporation} />
              <ReviewRow label="ID Doc" value={form.id_document_url ? "✓ Uploaded" : "Not provided"} />
              <ReviewRow label="License" value={form.business_license_url ? "✓ Uploaded" : "Not provided"} />

              <div className="border-t border-border/50 pt-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.agree_terms} onChange={(e) => set("agree_terms", e.target.checked)} className="mt-0.5" />
                  <span className="font-inter text-xs text-muted-foreground leading-relaxed">
                    I certify that all information provided is accurate and that my products are substantially made in the United States of America. I agree to MADEINUSA DIGITAL's listing terms and understand that false claims will result in immediate removal.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/30">
            <button
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
              className="px-5 py-2 border border-border rounded-lg text-sm font-inter text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors disabled:opacity-30"
            >
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-cinzel text-sm tracking-wider hover:bg-primary/90 transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!form.agree_terms || submitting}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-cinzel text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block font-inter text-xs text-muted-foreground mb-1.5">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-inter text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
    </div>
  );
}

function UploadField({ label, hint, value, uploading, onChange }) {
  return (
    <div>
      <label className="block font-inter text-xs text-muted-foreground mb-1">{label}</label>
      {hint && <p className="font-inter text-xs text-muted-foreground/60 mb-2">{hint}</p>}
      {value ? (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-green-900/20 border border-green-700/30 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span className="font-inter text-xs text-green-300">Document uploaded</span>
        </div>
      ) : (
        <label className="flex items-center gap-2 px-3 py-2.5 bg-background border border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
          <Upload className="w-4 h-4 text-muted-foreground" />
          <span className="font-inter text-xs text-muted-foreground">{uploading ? "Uploading..." : "Click to upload file"}</span>
          <input type="file" onChange={onChange} disabled={uploading} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
        </label>
      )}
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border/30">
      <span className="font-inter text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="font-inter text-xs text-foreground text-right">{value || "—"}</span>
    </div>
  );
}