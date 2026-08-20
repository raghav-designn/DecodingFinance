import { StandardCitation } from '../types';

export const STANDARDS_DATABASE: StandardCitation[] = [
  {
    code: 'ISA 315 (Revised 2019)',
    name: 'Identifying and Assessing the Risks of Material Misstatement',
    body: 'IAASB',
    summary: 'Core auditing standard mandating enhanced risk assessment procedures, understanding IT environment, and identifying Risks of Material Misstatement at assertion level.',
  },
  {
    code: 'ISA 240',
    name: 'The Auditor\'s Responsibilities Relating to Fraud in an Audit of Financial Statements',
    body: 'IAASB',
    summary: 'Establishes requirements for maintaining professional skepticism, evaluating fraud risk factors, and performing Journal Entry Testing (JET) to address management override.',
  },
  {
    code: 'ISA 320',
    name: 'Materiality in Planning and Performing an Audit',
    body: 'IAASB',
    summary: 'Guidelines on determining Planning/Overall Materiality (OM), Performance Materiality (PM), and Clearly Trivial Thresholds (CTT) to evaluate detected misstatements.',
  },
  {
    code: 'ISA 700 / ISA 701',
    name: 'Forming an Opinion and Reporting on Key Audit Matters (KAM)',
    body: 'IAASB',
    summary: 'Framework for audit opinion formation and articulating matters of highest significance in the audit of listed entities to investors and governance boards.',
  },
  {
    code: 'IFRS 18',
    name: 'Presentation and Disclosure in Financial Statements',
    body: 'IASB',
    summary: 'Replacing IAS 1 (effective 2027), introduces defined operating profit subtotals, mandatory classification of financing/investing, and MPM (Management-defined Performance Measures) disclosures.',
  },
  {
    code: 'IFRS 16',
    name: 'Leases',
    body: 'IASB',
    summary: 'Requires lessees to recognize assets and liabilities for all leases on the balance sheet with Right-of-Use (ROU) asset and corresponding lease liability calculations.',
  },
  {
    code: 'IFRS 15 / ASC 606',
    name: 'Revenue from Contracts with Customers',
    body: 'IASB',
    summary: '5-step model for revenue recognition: identify contract, performance obligations, transaction price, allocation, and recognition over time or at a point in time.',
  },
  {
    code: 'IFRS 9 / ASC 326',
    name: 'Financial Instruments & Current Expected Credit Loss (CECL)',
    body: 'IASB',
    summary: 'Classification, measurement, impairment based on forward-looking Expected Credit Loss (ECL) models, and hedge accounting requirements.',
  },
  {
    code: 'SOX Section 404',
    name: 'Management Assessment of Internal Controls',
    body: 'PCAOB',
    summary: 'Mandates management and independent auditors to test and report on the operating effectiveness of Internal Control over Financial Reporting (ICFR).',
  },
  {
    code: 'PCAOB AS 2201',
    name: 'An Audit of Internal Control Over Financial Reporting Integrated with Financial Statements',
    body: 'PCAOB',
    summary: 'Top-down, risk-based approach for auditing internal controls, identifying entity-level controls, and evaluating control deficiencies (MW vs. SD).',
  },
  {
    code: 'COSO 2013 Framework',
    name: 'Internal Control - Integrated Framework',
    body: 'COSO',
    summary: '17 principles across 5 components: Control Environment, Risk Assessment, Control Activities, Information & Communication, and Monitoring Activities.',
  },
  {
    code: 'CSRD / ESRS (EU 2022/2464)',
    name: 'Corporate Sustainability Reporting Directive & European Sustainability Reporting Standards',
    body: 'EFRAG',
    summary: 'Mandatory Double Materiality assessment (Financial & Impact Materiality) and limited-to-reasonable assurance on ESG metrics by statutory auditors.',
  },
  {
    code: 'OECD Pillar Two (GloBE)',
    name: 'Global Minimum Tax (15% Effective Tax Rate)',
    body: 'OECD',
    summary: 'Rules requiring large multinational enterprises (MNEs > €750M revenue) to calculate jurisdictional effective tax rates and pay top-up tax where rates fall below 15%.',
  },
  {
    code: 'ASC 842',
    name: 'US GAAP Lease Accounting',
    body: 'FASB',
    summary: 'US GAAP counterpart to IFRS 16 distinguishing operating leases from finance leases with dual-presentation model on income statement.',
  },
];
