import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, ShieldCheck, Loader2, CheckCircle2, AlertCircle, Eye, Globe, FileText, CreditCard, User
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const ID_TYPES = [
  { id: "passport", label: "Passport", icon: Globe, hint: "International travel document — most countries" },
  { id: "drivers_license", label: "Driver's License", icon: CreditCard, hint: "State/national issued driving license" },
  { id: "national_id", label: "National ID Card", icon: FileText, hint: "Government-issued national identity card" },
  { id: "residence_permit", label: "Residence Permit", icon: User, hint: "Permanent resident card / visa document" },
];

export default function IDVerificationStep({ ownerName, onVerified, verificationResult, setVerificationResult }) {
  const [idType, setIdType] = useState("");
  const [frontUrl, setFrontUrl] = useState(verificationResult?.frontUrl || "");
  const [backUrl, setBackUrl] = useState(verificationResult?.backUrl || "");
  const [uploading, setUploading] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e, side) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(side);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    if (side === "front") setFrontUrl(file_url);
    else setBackUrl(file_url);
    setUploading(null);
  };

  const handleVerify = async () => {
    if (!frontUrl) { setError("Please upload the front of your ID."); return; }
    if (!idType) { setError("Please select your ID type."); return; }
    setError("");
    setVerifying(true);

    const fileUrls = [frontUrl, ...(backUrl ? [backUrl] : [])];

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a KYC document verification specialist. Analyze the provided government ID document image(s) carefully.

The applicant claims their name is: "${ownerName}"
The document type they selected: "${idType}"

Extract and verify the following from the ID document:
1. Full name on document
2. Date of birth
3. ID/Document number
4. Issuing country (full name)
5. Issuing country code (ISO 2-letter)
6. Document expiry date (if visible)
7. Document type detected (passport, drivers_license, national_id, residence_permit, other)
8. Is the document clearly readable and authentic-looking? (true/false)
9. Does the name on document match or closely match the applicant name "${ownerName}"? (true/false)
10. name_match_confidence: integer 0-100
11. overall_verification_score: integer 0-100 (based on document quality, readability, authenticity indicators)
12. verification_status: one of "verified", "partially_verified", "failed"
13. notes: any issues or flags (max 200 chars)

If the image does not appear to be a valid government ID, set verification_status to "failed" and explain in notes.`,
      file_urls: fileUrls,
      response_json_schema: {
        type: "object",
        properties: {
          full_name: { type: "string" },
          date_of_birth: { type: "string" },
          document_number: { type: "string" },
          issuing_country: { type: "string" },
          issuing_country_code: { type: "string" },
          expiry_date: { type: "string" },
          document_type_detected: { type: "string" },
          document_readable: { type: "boolean" },
          name_matches: { type: "boolean" },
          name_match_confidence: { type: "number" },
          overall_verification_score: { type: "number" },
          verification_status: { type: "string" },
          notes: { type: "string" },
        }
      }
    });

    const fullResult = { ...result, idType, frontUrl, backUrl };
    setVerificationResult(fullResult);
    if (result.verification_status === "verified" || result.verification_status === "partially_verified") {
      onVerified(fullResult);
    }
    setVerifying(false);
  };

  const status = verificationResult?.verification_status;
  const score = verificationResult?.overall_verification_score;

  const statusConfig = {
    verified: { color: "text-green-400", bg: "bg-green-900/20 border-green-700/40", icon: CheckCircle2, label: "ID Verified" },
    partially_verified: { color: "text-yellow-400", bg: "bg-yellow-900/20 border-yellow-700/40", icon: AlertCircle, label: "Partially Verified" },
    failed: { color: "text-red-400", bg: "bg-red-900/20 border-red-700/40", icon: AlertCircle, label: "Verification Failed" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-cinzel font-semibold text-foreground text-lg mb-1">Identity Verification</h3>
        <p className="font-inter text-xs text-muted-foreground">
          Upload a clear photo of your government-issued ID. We support multinational documents including passports, driver's licenses, and national ID cards.
        </p>
      </div>

      {/* ID Type Selection */}
      <div>
        <label className="block font-inter text-xs text-muted-foreground mb-2">Select your ID type *</label>
        <div className="grid grid-cols-2 gap-3">
          {ID_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setIdType(t.id)}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                  idType === t.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-inter text-xs font-semibold leading-tight">{t.label}</p>
                  <p className="font-inter text-[10px] opacity-70 leading-snug mt-0.5">{t.hint}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload front */}
      <UploadBox
        label="Front of ID *"
        hint="Full document visible, good lighting, no glare"
        url={frontUrl}
        uploading={uploading === "front"}
        onChange={(e) => handleUpload(e, "front")}
      />

      {/* Upload back (optional for passport) */}
      {idType && idType !== "passport" && (
        <UploadBox
          label="Back of ID (recommended)"
          hint="Back side for additional data extraction"
          url={backUrl}
          uploading={uploading === "back"}
          onChange={(e) => handleUpload(e, "back")}
        />
      )}

      {error && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-900/20 border border-red-700/30 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="font-inter text-xs text-red-300">{error}</p>
        </div>
      )}

      {/* Verify button */}
      {!verificationResult && (
        <button
          onClick={handleVerify}
          disabled={verifying || !frontUrl || !idType}
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-cinzel text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {verifying ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Document...</>
          ) : (
            <><Eye className="w-4 h-4" /> Verify Identity</>
          )}
        </button>
      )}

      {/* Verification Result */}
      <AnimatePresence>
        {verificationResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border p-5 ${statusConfig[status]?.bg || "bg-card border-border"}`}
          >
            {/* Status header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {React.createElement(statusConfig[status]?.icon || CheckCircle2, {
                  className: `w-5 h-5 ${statusConfig[status]?.color}`
                })}
                <span className={`font-cinzel font-bold text-sm ${statusConfig[status]?.color}`}>
                  {statusConfig[status]?.label}
                </span>
              </div>
              {score !== undefined && (
                <div className="flex items-center gap-1.5">
                  <span className="font-inter text-xs text-muted-foreground">Score:</span>
                  <span className={`font-cinzel font-bold text-sm ${score >= 75 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                    {Math.round(score)}/100
                  </span>
                </div>
              )}
            </div>

            {/* Extracted data */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4">
              {[
                ["Name on ID", verificationResult.full_name],
                ["Date of Birth", verificationResult.date_of_birth],
                ["Document #", verificationResult.document_number],
                ["Issuing Country", verificationResult.issuing_country],
                ["Expiry Date", verificationResult.expiry_date],
                ["Doc Type", verificationResult.document_type_detected],
              ].map(([label, value]) => value ? (
                <div key={label}>
                  <p className="font-inter text-[10px] text-muted-foreground/70 uppercase tracking-wider">{label}</p>
                  <p className="font-inter text-xs text-foreground font-semibold">{value}</p>
                </div>
              ) : null)}
            </div>

            {/* Name match */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-3 ${verificationResult.name_matches ? "bg-green-900/20" : "bg-yellow-900/20"}`}>
              {verificationResult.name_matches
                ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                : <AlertCircle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />}
              <span className="font-inter text-xs text-muted-foreground">
                Name match confidence: <strong className={verificationResult.name_matches ? "text-green-400" : "text-yellow-400"}>
                  {verificationResult.name_match_confidence}%
                </strong>
              </span>
            </div>

            {verificationResult.notes && (
              <p className="font-inter text-xs text-muted-foreground/70 italic">{verificationResult.notes}</p>
            )}

            {/* Re-verify option */}
            <button
              onClick={() => { setVerificationResult(null); }}
              className="mt-4 font-inter text-xs text-primary/70 hover:text-primary underline transition-colors"
            >
              Re-upload and verify again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start gap-2 px-3 py-2 bg-background/50 border border-border/30 rounded-lg">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="font-inter text-[10px] text-muted-foreground/70 leading-relaxed">
          Your ID is processed securely using AI vision technology. Document images are used solely for identity verification and stored encrypted. We support government IDs from all countries.
        </p>
      </div>
    </div>
  );
}

function UploadBox({ label, hint, url, uploading, onChange }) {
  return (
    <div>
      <label className="block font-inter text-xs text-muted-foreground mb-1">{label}</label>
      {hint && <p className="font-inter text-[10px] text-muted-foreground/60 mb-2">{hint}</p>}
      {url ? (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-green-900/20 border border-green-700/30 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
          <span className="font-inter text-xs text-green-300">Document uploaded ✓</span>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 bg-background border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors group">
          <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="font-inter text-xs text-muted-foreground">
            {uploading ? "Uploading..." : "Click to upload (JPG, PNG, PDF)"}
          </span>
          <input type="file" onChange={onChange} disabled={uploading} className="hidden" accept=".jpg,.jpeg,.png,.pdf" />
        </label>
      )}
    </div>
  );
}