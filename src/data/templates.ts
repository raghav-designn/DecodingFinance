import { ArticleCategory, TargetAudience } from '../types';

export interface ArticleTemplate {
  id: string;
  name: string;
  category: ArticleCategory;
  targetAudience: TargetAudience;
  description: string;
  defaultStandards: string[];
  initialContent: string;
}

export const ARTICLE_TEMPLATES: ArticleTemplate[] = [
  {
    id: 'tpl-technical-accounting',
    name: 'Technical Accounting & Standards Deep-Dive',
    category: 'Financial Reporting & IFRS',
    targetAudience: 'CFO & Finance Directors',
    description: 'Structured analysis of a complex standard (IFRS / US GAAP), recognition criteria, balance sheet impacts, and disclosure mandates.',
    defaultStandards: ['IFRS 18', 'IFRS 15 / ASC 606'],
    initialContent: `# [Insert Title: e.g., Analyzing Technical Requirements of New Accounting Standard]

**Executive Summary:**
[Provide a 2-3 paragraph high-level overview of the standard, its effective date, scope, and strategic financial impact on reported earnings, EBITDA, and debt covenants.]

---

## 1. Regulatory Context & Scope of Standard
- **Issuing Body:** [IASB / FASB]
- **Effective Date:** [e.g., Annual reporting periods starting Jan 1, 2027]
- **Primary Scoping Criteria:** [Which transactions, contracts, or entities are affected]

---

## 2. Core Recognition & Measurement Mechanics

### Key Accounting Principles
1. **Initial Recognition:** [Criteria required to record asset/liability]
2. **Subsequent Measurement:** [Fair value vs. Amortized cost vs. Cost model]
3. **Impairment Triggers:** [Indicators and model applied]

### Financial Statement Impact Matrix
| Financial Statement | Primary Changes | Key Metric Sensitivity |
| :--- | :--- | :--- |
| **Balance Sheet** | [e.g. Asset & liability expansion] | Working Capital, Debt-to-Equity |
| **Income Statement** | [e.g. Subtotal reclassifications] | Operating Profit, Net Income |
| **Cash Flow Statement** | [e.g. Operating vs Financing shifts] | Free Cash Flow |

---

## 3. Practical Journal Entries & Transaction Examples
\`\`\`
[Account Name]               Dr. $XX,XXX
    [Contra / Liability Account]       Cr. $XX,XXX
(To recognize transition adjustment on initial application)
\`\`\`

---

## 4. Key Audit Considerations & Common Inspection Findings
- Audit assertions most at risk: **Valuation and Allocation**, **Completeness**, **Presentation and Disclosure**.
- Common documentation deficiencies noted during peer reviews.

---

## 5. Strategic Recommendations for Finance Leaders
1. [Actionable step 1: System and ERP chart of accounts update]
2. [Actionable step 2: Review of debt covenant definitions]
3. [Actionable step 3: Audit committee briefing schedule]`,
  },
  {
    id: 'tpl-audit-observation',
    name: 'Audit Observation Working Paper & 5 Cs Memo',
    category: 'Internal Audit & Advisory',
    targetAudience: 'Senior Audit Managers & Partners',
    description: 'Formal Internal / External Audit finding organized with the 5 Cs: Condition, Criteria, Cause, Consequence, and Corrective Action.',
    defaultStandards: ['ISA 315 (Revised 2019)', 'COSO 2013 Framework'],
    initialContent: `# Audit Working Paper: [Insert Audit Observation Title]

**Audit Engagement:** [e.g. FY2026 Integrated Internal Audit / Operational Review]  
**Audit Area:** [e.g. Order-to-Cash, Procure-to-Pay, General IT Controls]  
**Risk Severity:** **[CRITICAL / HIGH / MEDIUM / LOW]**

---

## Executive Summary of Observation
[Concise 3-sentence summary of the control breakdown, affected transaction volume, and primary risk exposure.]

---

## The 5 Cs Audit Analysis

### 1. Condition (What is happening?)
- During substantive testing of [Sample size, e.g., 40 transactions valued at $X.XM], audit fieldwork identified that:
- [Describe factual findings supported by documentation].

### 2. Criteria (What should be happening?)
- In accordance with **[Standard code, e.g., ISA 240 / COSO Principle #10 / Company Policy Ref]**:
- [Quote standard requirement or internal policy threshold].

### 3. Cause (Why did it happen?)
- Root-cause analysis determined that:
  - [e.g., Staff turnover and lack of supervisory review during system changeover].
  - [e.g., Absence of automated validation checks in ERP interface].

### 4. Consequence (What is the business & financial risk?)
- **Quantified Financial Exposure:** [e.g., Estimated $XXX,XXX potential duplicate payments].
- **Regulatory / Compliance Exposure:** [e.g., Potential material weakness or significant deficiency under SOX 404].

### 5. Corrective Action & Recommendations (How to fix it?)
1. **Immediate Remediation (Short-term):** [Step to halt immediate exposure].
2. **Preventative Control (Long-term):** [Automated control or policy update].
3. **Monitoring Procedure:** [Periodic management review cadence].

---

## Management Response & Action Plan
- **Management Agreement:** [Agreed / Partially Agreed]
- **Target Implementation Date:** [e.g., October 31, 2026]
- **Action Owner:** [Head of Finance Operations / Controller]`,
  },
  {
    id: 'tpl-materiality-memo',
    name: 'Audit Materiality Planning Memo',
    category: 'External Audit & Assurance',
    targetAudience: 'Senior Audit Managers & Partners',
    description: 'Formal documentation of benchmark selection, Overall Materiality (OM), Performance Materiality (PM), and Clearly Trivial Thresholds (CTT).',
    defaultStandards: ['ISA 320', 'ISA 450'],
    initialContent: `# Audit Planning Memorandum: Materiality Determination

**Client Entity:** [Entity Name]  
**Financial Period Ending:** [Date, e.g., December 31, 2026]  
**Auditing Standard Framework:** **ISA 320 / PCAOB AS 2105**

---

## 1. Selected Benchmark & Justification
- **Chosen Benchmark:** [e.g., Profit Before Tax from Continuing Operations / Total Revenue / Total Assets]
- **Benchmark Amount:** $[XX,XXX,XXX]
- **Rationale for Selection:** [Explain why this benchmark represents the primary metric relied upon by users of financial statements].

---

## 2. Calculated Materiality Thresholds

| Threshold Level | Benchmark Percentage | Calculated Amount | Rationale & Basis |
| :--- | :---: | :--- | :--- |
| **Overall Materiality (OM)** | [e.g., 5.0%] | **$[XXX,XXX]** | Basis for evaluating unadjusted misstatements at financial statement level. |
| **Performance Materiality (PM)** | [e.g., 75.0% of OM] | **$[XXX,XXX]** | Scoping threshold to reduce aggregation risk across accounts. |
| **Clearly Trivial Threshold (CTT / SUM)** | [e.g., 5.0% of OM] | **$[XX,XXX]** | Amounts below this are deemed inconsequential and not accumulated on SUM sheet. |

---

## 3. Qualitative Factors & Specific Lower Materiality Areas
The engagement team has established **lower specific materiality thresholds** for the following sensitive disclosures:
- **Related-Party Transactions & Director Remuneration:** $0 threshold (any deviation must be evaluated).
- **Loan Covenant Compliance Disclosures:** Tolerance evaluated within covenant headroom.

---

## 4. Engagement Partner & Quality Reviewer Sign-off
- **Lead Audit Partner:** [Name, Credentials] ── Date: [Date]
- **Engagement Quality Reviewer (EQR):** [Name, Credentials] ── Date: [Date]`,
  },
  {
    id: 'tpl-esg-assurance',
    name: 'ESG & CSRD Double Materiality Assurance Paper',
    category: 'ESG & Sustainability Assurance',
    targetAudience: 'Audit Committee & Board',
    description: 'Field guide and technical methodology for external assurance of sustainability reports under CSRD, ESRS, and ISSB frameworks.',
    defaultStandards: ['CSRD / ESRS (EU 2022/2464)'],
    initialContent: `# Double Materiality & Sustainability Assurance: Practical Framework for Auditors

**Framework:** **CSRD / ESRS (EU 2022/2464) & ISSB (IFRS S1/S2)**  
**Assurance Level:** [Limited Assurance transitioning to Reasonable Assurance]

---

## 1. The Architecture of Double Materiality

Auditors must evaluate sustainability disclosures across two orthogonal dimensions:

1. **Financial Materiality (Outside-In):** Sustainability matters that generate financial risks or opportunities affecting the entity's cash flows, development, performance, or cost of capital.
2. **Impact Materiality (Inside-Out):** The entity's positive or negative material impacts on people or the environment across short, medium, and long-term horizons.

---

## 2. Materiality Assessment Matrix
| ESRS Standard Topic | Impact Materiality (Severity & Likelihood) | Financial Materiality (Enterprise Value) | In-Scope for Independent Assurance? |
| :--- | :--- | :--- | :---: |
| **E1: Climate Change (Scope 1, 2, 3)** | High (Global emissions footprint) | High (Carbon pricing & transition risk) | **YES** |
| **S1: Own Workforce** | Medium (Health & safety records) | Medium (Retention & wage compliance) | **YES** |
| **G1: Business Conduct & Anti-Corruption** | High (Bribery prevention controls) | High (Regulatory fines & reputational loss) | **YES** |

---

## 3. Substantive Assurance Testing Procedures
- Testing greenhouse gas (GHG) emission activity data against raw utility invoices and fuel logs.
- Evaluating automated calculation engines used for Scope 2 market-based emission factors.
- Reviewing board oversight documentation regarding ESG risk governance.`,
  },
];
