import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // AI Assistant endpoint
  app.post("/api/gemini/assist", async (req, res) => {
    const { action, topic, category, currentContent, prompt, selectedText, parameters } = req.body;
    const ai = getAiClient();

    if (!ai) {
      // Return smart fallback responses when API key is not configured
      return res.json({
        success: true,
        isFallback: true,
        text: generateFallbackAssistance(action, topic, category, selectedText, prompt, parameters),
      });
    }

    try {
      let systemPrompt = `You are a Senior Technical Accounting & Audit Director (CPA, CIA, CFE, CFA) with 20+ years experience advising Big 4 accounting firms, Audit Committees, CFOs, and regulatory bodies (PCAOB, SEC, IAASB, IASB, FASB).
You write authoritative, analytically rigorous, and precise professional articles and audit working papers on finance, external audit, internal audit, SOX 404, IFRS, US GAAP, forensic investigations, corporate governance, ESG assurance, and valuation.
Format responses in clean Markdown with clear headings, bullet points, standard citations (e.g., ISA 315, IFRS 16, ASC 606, COSO Framework), and structured tables where appropriate.`;

      let userPrompt = "";

      switch (action) {
        case "generate-outline":
          userPrompt = `Generate a comprehensive, publication-ready article outline for:
Title/Topic: "${topic}"
Category: "${category || 'General Finance & Audit'}"
Additional prompt/angle: "${prompt || 'In-depth professional analysis with practical audit procedures and financial impact'}"

Include:
1. Executive Summary & Objective
2. Regulatory & Accounting Standards Context (relevant IFRS/US GAAP/ISA/PCAOB)
3. Core Technical Analysis / Real-world Mechanics
4. Audit & Risk Assessment (Inherent vs Control risks, Key Audit Matters)
5. Practical Implementation Checklist or Working Paper Template
6. Board/Audit Committee Key Takeaways & Recommendations`;
          break;

        case "draft-audit-finding":
          userPrompt = `Draft a formal Audit Observation / Finding using the 5 Cs of Internal Audit:
Topic/Issue: "${topic || prompt || 'Revenue cutoff anomaly or internal control deficiency'}"
Context/Details: "${currentContent || selectedText || 'Sample testing revealed inconsistencies in period-end accruals.'}"

Structure the finding strictly with:
- **Title**: High-impact, objective headline
- **1. Condition**: Exactly what was found during testing/fieldwork
- **2. Criteria**: The accounting/audit standard or company policy breached (e.g. ISA 240, ASC 606, Internal Controls Policy)
- **3. Cause**: Root cause analysis (system limitation, lack of secondary review, staffing)
- **4. Consequence / Impact**: Financial exposure, compliance penalty, material misstatement risk
- **5. Corrective Action / Recommendation**: Actionable, risk-based management remediation steps
- **Risk Severity Rating**: (High / Medium / Low) with justification`;
          break;

        case "polish-executive":
          userPrompt = `Rewrite and elevate the following text to an executive board-level / audit committee tone. Ensure uncompromising technical accuracy, precise financial vocabulary, active voice, and concise clarity:

Text to polish:
"""
${selectedText || currentContent}
"""`;
          break;

        case "explain-standard":
          userPrompt = `Provide a masterclass technical breakdown of the accounting or auditing standard related to: "${topic || prompt}".
Include:
- Official standard name and issuing body (e.g., IFRS / IASB, US GAAP / FASB, ISA / IAASB)
- Core principle & recognition criteria
- Typical journal entries / balance sheet & P&L impact
- Key audit assertions and risk areas (Existence, Completeness, Valuation, Rights & Obligations)
- Common pitfalls observed during inspection reviews`;
          break;

        case "materiality-memo":
          userPrompt = `Draft a formal Audit Materiality Memorandum based on the following financial parameters:
Parameters: ${JSON.stringify(parameters || {})}
Context: "${prompt || topic || 'Annual audit planning materiality'}"

Include:
- Benchmark selection rationale (Normalized PBT, Total Revenue, Total Assets, Equity)
- Overall Materiality (OM) calculation
- Performance Materiality (PM) (typically 50-75% of OM based on control risk)
- Clearly Trivial Threshold (CTT / SUM) (typically 3-5% of OM)
- Specific Materiality considerations for sensitive disclosures (Executive compensation, Related parties)`;
          break;

        case "summarize":
          userPrompt = `Generate an Executive Summary (2-3 concise paragraphs) and 4-5 bulleted Key Takeaways for the following article draft:

Draft:
"""
${currentContent}
"""`;
          break;

        case "technical-review":
          userPrompt = `Perform an objective, rigorous Peer Review of this finance/audit article draft:
Article:
"""
${currentContent}
"""

Evaluate and provide structured feedback on:
1. **Technical Soundness & Standards Alignment** (Check accuracy of IFRS/GAAP/ISA references)
2. **Audit & Analytical Depth** (Are practical implications and control tests adequately covered?)
3. **Clarity & Executive Tone**
4. **Suggested Additions or Missing Edge Cases**
5. **Readability & Citation Score** (0-100)`;
          break;

        case "custom":
        default:
          userPrompt = prompt || `Write a detailed, professional section on: ${topic}`;
          if (currentContent) {
            userPrompt += `\n\nCurrent Draft Context:\n"""\n${currentContent}\n"""`;
          }
          break;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      res.json({
        success: true,
        text: response.text,
      });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.json({
        success: true,
        isFallback: true,
        text: generateFallbackAssistance(action, topic, category, selectedText, prompt, parameters),
        errorNote: error.message,
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Finance & Audit Publishing Platform running at http://0.0.0.0:${PORT}`);
  });
}

function generateFallbackAssistance(
  action: string,
  topic: string = "",
  category: string = "",
  selectedText: string = "",
  prompt: string = "",
  _parameters: any = {}
): string {
  if (action === "generate-outline") {
    return `# Article Outline: ${topic || "Financial Risk & Audit Review"}
**Category:** ${category || "Audit & Assurance"}
**Estimated Reading Time:** 8 minutes

## 1. Executive Summary & Regulatory Framework
- Context and relevance to CFOs, Senior Controllers, and Audit Committees
- Applicable standards: **ISA 315 (Revised)**, **IFRS 9 / ASC 326**, and **COSO Internal Control - Integrated Framework**
- Scope of examination and core assertions

## 2. Inherent Risk Profiling & Materiality Considerations
- Qualitative vs. Quantitative materiality benchmarks
- Key risk indicators (KRIs) in modern enterprise environments
- Data-driven risk assessment methodologies

## 3. Substantive Procedures & Control Testing Design
- Walkthroughs, Test of Operating Effectiveness (TOE), and automated control validation
- Journal Entry Testing (JET) techniques and Benford's Law anomalies
- Evaluating segregation of duties (SoD) conflicts

## 4. Key Audit Matters (KAM) & Reporting Implications
- Structuring the audit observation memo using the **5 Cs**:
  - *Condition, Criteria, Cause, Consequence, Corrective Action*
- Management representations and disclosure obligations

## 5. Strategic Recommendations for the Audit Committee
- Governance oversight roadmap
- Tech-enabled continuous auditing implementation
- Summary of next steps for field teams`;
  }

  if (action === "draft-audit-finding") {
    return `### Audit Observation Memo: ${topic || "Control Deficiency in Period-End Journal Entries"}

**Risk Severity:** **HIGH** | **Audit Area:** General Ledger & Period-End Financial Reporting

---

#### 1. Condition
During substantive testing of Q4 period-end manual journal entries, sample testing of 45 high-value entries revealed that 14 entries (valued at $3.8M aggregate) were posted without documented secondary supervisory review prior to ledger posting.

#### 2. Criteria
Under **COSO Control Activity #10** and **SOX Section 404** internal control guidelines (as well as Company Financial Policy FP-402), all manual journal entries exceeding $50,000 must undergo independent managerial review and approval before posting to the general ledger.

#### 3. Cause
Inquiries with the finance operations team indicated that period-end system timeout thresholds and staffing shortages during the ERP migration led to temporary granting of administrative bypass privileges to senior accountants.

#### 4. Consequence (Impact)
Unreviewed manual journal entries present significant risk of undetected material misstatement, unauthorized adjustments to revenue recognition cutoff, and increased exposure to management override of controls (ISA 240 / AU-C 240).

#### 5. Corrective Action (Recommendation)
1. **Immediate Hard Control:** Re-configure the ERP workflow to enforce mandatory two-person authorization for all manual journal entries over the threshold.
2. **Lookback Review:** Direct Internal Audit to perform a 100% retrospective substantive review of all bypass entries logged in FY2025/2026.
3. **Audit Log Monitoring:** Implement automated weekly exception reports alerting the Head of Internal Audit of any administrative bypass attempts.`;
  }

  if (action === "polish-executive") {
    return `**Executive Refinement:**

${selectedText ? `"${selectedText.trim()}" has been refined to:` : ""}

> "Management maintains an effective system of internal accounting controls designed to provide reasonable assurance regarding the reliability of financial reporting in conformity with applicable reporting standards. However, ongoing evaluation of automated general IT controls (GITCs) identified specific access management configurations warranting targeted remediation to prevent unauthorized ledger modifications."`;
  }

  if (action === "materiality-memo") {
    return `### Formal Audit Materiality Memorandum

**Engagement:** Annual Financial Statement Audit
**Framework:** ISA 320 / PCAOB AS 2105

| Metric | Benchmark | Factor | Calculated Amount |
| :--- | :--- | :--- | :--- |
| **Overall Materiality (OM)** | Normalized Profit Before Tax ($12.4M) | 5.0% | **$620,000** |
| **Performance Materiality (PM)** | Overall Materiality | 75.0% | **$465,000** |
| **Clearly Trivial Threshold (CTT / SUM)** | Overall Materiality | 5.0% | **$31,000** |

#### Qualitative Materiality Considerations:
- Related-party transactions and director remuneration are evaluated at **$0 threshold**.
- Loan covenant compliance tolerances (Debt-to-EBITDA ratio headroom of 0.2x).`;
  }

  return `### Professional Analysis: ${topic || "Financial Governance Overview"}

${prompt || "Comprehensive overview of contemporary accounting standards and audit practices."}

Key considerations include rigorous application of IFRS/US GAAP disclosure mandates, internal control validation, and proactive stakeholder communication.`;
}

startServer();
