export type ArticleStatus = 'draft' | 'under_review' | 'peer_reviewed' | 'published' | 'archived';

export type ArticleCategory =
  | 'External Audit & Assurance'
  | 'Internal Audit & Advisory'
  | 'Forensic Accounting & Fraud'
  | 'Financial Reporting & IFRS'
  | 'Corporate Governance & SOX'
  | 'Tax & Transfer Pricing'
  | 'Valuation & Financial Modeling'
  | 'ESG & Sustainability Assurance'
  | 'FinTech & AI in Finance';

export type TargetAudience =
  | 'Audit Committee & Board'
  | 'CFO & Finance Directors'
  | 'Senior Audit Managers & Partners'
  | 'Staff & Senior Auditors'
  | 'Financial Analysts & Controllers'
  | 'Compliance & Risk Officers';

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';

export interface Author {
  name: string;
  role: string;
  credentials: string; // e.g. "CPA, CIA, CFE"
  avatar: string;
  firmOrOrganization?: string;
  bio?: string;
}

export interface AuditFinding {
  id: string;
  title: string;
  severity: SeverityLevel;
  condition: string;
  criteria: string;
  cause: string;
  consequence: string;
  recommendation: string;
  managementResponse?: string;
}

export interface ReviewComment {
  id: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
  content: string;
  resolved: boolean;
  highlightedText?: string;
}

export interface StandardCitation {
  code: string; // e.g., "ISA 315", "IFRS 16", "ASC 606", "COSO #10", "PCAOB AS 2201"
  name: string;
  body: 'IAASB' | 'IASB' | 'FASB' | 'PCAOB' | 'COSO' | 'OECD' | 'EFRAG' | 'SEC';
  summary: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt: string;
  category: ArticleCategory;
  tags: string[];
  author: Author;
  status: ArticleStatus;
  publishedAt: string;
  updatedAt: string;
  readTimeMinutes: number;
  content: string; // Markdown formatted with embedded tables and callouts
  coverImage?: string;
  targetAudience: TargetAudience;
  materialityFocus?: string;
  standardsCited: string[]; // List of standard codes e.g. ["ISA 315", "IFRS 18"]
  auditFindings?: AuditFinding[];
  reviewComments?: ReviewComment[];
  viewsCount: number;
  likesCount: number;
  bookmarksCount: number;
  isFeatured?: boolean;
}

export interface MaterialityCalculation {
  benchmarkType: 'PBT' | 'Revenue' | 'TotalAssets' | 'GrossProfit' | 'Equity';
  benchmarkAmount: number;
  benchmarkPercentage: number;
  overallMateriality: number;
  performanceMaterialityPercentage: number;
  performanceMateriality: number;
  trivialThresholdPercentage: number;
  clearlyTrivialThreshold: number;
  rationale: string;
  qualitativeFactors: string[];
}

export interface AuditSamplingCalc {
  populationValue: number;
  tolerableMisstatement: number;
  expectedMisstatement: number;
  riskFactor: number; // e.g. 3.0 for High confidence (95%), 2.3 for Medium (90%)
  sampleSize: number;
  samplingInterval: number;
}
