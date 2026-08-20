import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Save,
  Eye,
  Columns,
  Sparkles,
  Table as TableIcon,
  AlertCircle,
  FileCheck,
  Building,
  Check,
  Send,
  Loader2,
  Trash2,
  Download,
  Printer,
  ChevronRight,
  ChevronDown,
  BookOpen,
  HelpCircle,
  Wand2,
  FileText,
  Copy,
  Plus,
  Quote
} from 'lucide-react';
import { Article, ArticleCategory, TargetAudience, ArticleStatus, AuditFinding } from '../../types';
import { ARTICLE_TEMPLATES } from '../../data/templates';
import { STANDARDS_DATABASE } from '../../data/standardsData';
import { AuditObservationBuilder } from '../tools/AuditObservationBuilder';

interface ArticleEditorProps {
  article: Article;
  onSave: (updatedArticle: Article) => void;
  onDelete?: (id: string) => void;
  onPublish: (updatedArticle: Article) => void;
  hasApiKey: boolean;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({
  article,
  onSave,
  onDelete,
  onPublish,
  hasApiKey,
}) => {
  // Main Draft State
  const [title, setTitle] = useState(article.title || '');
  const [subtitle, setSubtitle] = useState(article.subtitle || '');
  const [category, setCategory] = useState<ArticleCategory>(article.category || 'External Audit & Assurance');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>(article.targetAudience || 'Senior Audit Managers & Partners');
  const [status, setStatus] = useState<ArticleStatus>(article.status || 'draft');
  const [content, setContent] = useState(article.content || '');
  const [materialityFocus, setMaterialityFocus] = useState(article.materialityFocus || '');
  const [standardsCited, setStandardsCited] = useState<string[]>(article.standardsCited || []);
  const [tagsInput, setTagsInput] = useState((article.tags || []).join(', '));
  
  // Author state
  const [authorName, setAuthorName] = useState(article.author?.name || 'Alexander Wright, CPA');
  const [authorRole, setAuthorRole] = useState(article.author?.role || 'Senior Audit Manager & Technical Lead');
  const [authorCredentials, setAuthorCredentials] = useState(article.author?.credentials || 'CPA, CIA');
  const [authorFirm, setAuthorFirm] = useState(article.author?.firmOrOrganization || 'Apex Assurance Advisory');

  // UI View Mode: 'split' | 'edit' | 'preview'
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [showAiSidebar, setShowAiSidebar] = useState(true);
  const [showObservationModal, setShowObservationModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  // AI Assistant State
  const [aiAction, setAiAction] = useState<string>('generate-outline');
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<string>('ISA 315 (Revised 2019)');

  // Quick stats calculation
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  // Autosave effect
  useEffect(() => {
    const timer = setTimeout(() => {
      handleAutoSave();
    }, 2500);
    return () => clearTimeout(timer);
  }, [title, subtitle, category, targetAudience, status, content, materialityFocus, standardsCited, authorName, authorRole, authorCredentials, authorFirm, tagsInput]);

  const getUpdatedArticleObject = (): Article => {
    return {
      ...article,
      title: title || 'Untitled Professional Article',
      slug: (title || 'untitled-article').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      subtitle,
      excerpt: subtitle || (content.slice(0, 160) + '...'),
      category,
      targetAudience,
      status,
      content,
      materialityFocus,
      standardsCited,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      readTimeMinutes: estimatedReadTime,
      updatedAt: new Date().toISOString(),
      author: {
        ...article.author,
        name: authorName,
        role: authorRole,
        credentials: authorCredentials,
        firmOrOrganization: authorFirm,
        avatar: article.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      },
    };
  };

  const handleAutoSave = () => {
    const updated = getUpdatedArticleObject();
    onSave(updated);
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2000);
  };

  const handlePublishNow = () => {
    const updated = {
      ...getUpdatedArticleObject(),
      status: 'published' as ArticleStatus,
      publishedAt: article.publishedAt || new Date().toISOString(),
    };
    setStatus('published');
    onPublish(updated);
  };

  // Content Insertion Helpers
  const insertTextAtCursor = (textToInsert: string) => {
    const textarea = document.getElementById('article-content-textarea') as HTMLTextAreaElement | null;
    if (!textarea) {
      setContent((prev) => prev + '\n\n' + textToInsert);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const previousContent = textarea.value;
    const newContent = previousContent.substring(0, start) + textToInsert + previousContent.substring(end);
    
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 50);
  };

  const insertAuditFindingFromBuilder = (finding: AuditFinding, markdown: string) => {
    insertTextAtCursor('\n\n' + markdown + '\n\n');
  };

  const handleLoadTemplate = (template: typeof ARTICLE_TEMPLATES[0]) => {
    if (content.trim().length > 50) {
      if (!window.confirm('Loading a template will replace current content. Continue?')) {
        return;
      }
    }
    setTitle(template.name);
    setCategory(template.category);
    setTargetAudience(template.targetAudience);
    setContent(template.initialContent);
    setStandardsCited(template.defaultStandards);
    setShowTemplateModal(false);
  };

  // AI Assistant Call
  const handleRunAiAssist = async () => {
    setAiLoading(true);
    setAiResult(null);

    try {
      const response = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: aiAction,
          topic: title || 'Financial Audit & Risk Analysis',
          category,
          currentContent: content,
          prompt: aiPrompt || undefined,
          parameters: {
            standard: selectedStandard,
            audience: targetAudience,
          },
        }),
      });

      const data = await response.json();
      if (data.text) {
        setAiResult(data.text);
      } else {
        setAiResult('Unable to generate AI assistance at this time. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setAiResult('Error communicating with server. Using offline technical template.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyAiResult = () => {
    if (!aiResult) return;
    if (aiAction === 'generate-outline' || aiAction === 'custom') {
      if (content.trim().length < 50) {
        setContent(aiResult);
      } else {
        insertTextAtCursor('\n\n' + aiResult + '\n\n');
      }
    } else {
      insertTextAtCursor('\n\n' + aiResult + '\n\n');
    }
    setAiResult(null);
  };

  const handleToggleStandard = (stdCode: string) => {
    if (standardsCited.includes(stdCode)) {
      setStandardsCited(standardsCited.filter((c) => c !== stdCode));
    } else {
      setStandardsCited([...standardsCited, stdCode]);
    }
  };

  const handleExportMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(title || 'article').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Top Studio Control Bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 py-2.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 bg-slate-100 p-0.5 rounded-lg">
              <button
                onClick={() => setViewMode('edit')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === 'edit' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center space-x-1 ${
                  viewMode === 'split' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Split View</span>
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center space-x-1 ${
                  viewMode === 'preview' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>

            <button
              onClick={() => setShowTemplateModal(true)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-md flex items-center space-x-1 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              <span>Load Template</span>
            </button>

            {/* Autosave Status indicator */}
            <div className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-500 font-mono-num pl-2">
              <span className={`w-2 h-2 rounded-full ${isSavedRecently ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              <span>Saved {lastSavedTime}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAiSidebar(!showAiSidebar)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition-all ${
                showAiSidebar
                  ? 'bg-amber-100/80 text-amber-950 border border-amber-300'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>AI Writing Copilot</span>
            </button>

            <button
              onClick={handleExportMarkdown}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1.5 rounded-md flex items-center space-x-1 transition-colors"
              title="Export as Markdown"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={handleAutoSave}
              className="text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-md flex items-center space-x-1.5 shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>

            <button
              onClick={handlePublishNow}
              className="bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold px-4 py-1.5 rounded-md flex items-center space-x-1.5 shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{status === 'published' ? 'Update Live' : 'Publish Article'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Working Editor Area */}
          <div className={`${showAiSidebar ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6 transition-all`}>
            {/* Article Metadata Card */}
            <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
              <div>
                <input
                  id="article-title-input"
                  type="text"
                  placeholder="Enter Article Title (e.g. Navigating ISA 315: Assessing IT Risks in Financial Statement Audits)..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full font-editorial text-2xl sm:text-3xl font-bold text-[#0F172A] placeholder:text-slate-300 border-b border-slate-200 pb-2 focus:outline-none focus:border-amber-600 transition-colors"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Subtitle or Executive Summary teaser..."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full text-sm text-slate-600 placeholder:text-slate-300 border-b border-slate-100 pb-1.5 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Taxonomy and Audit Config Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Primary Domain / Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="External Audit & Assurance">External Audit & Assurance</option>
                    <option value="Internal Audit & Advisory">Internal Audit & Advisory</option>
                    <option value="Forensic Accounting & Fraud">Forensic Accounting & Fraud</option>
                    <option value="Financial Reporting & IFRS">Financial Reporting & IFRS</option>
                    <option value="Corporate Governance & SOX">Corporate Governance & SOX</option>
                    <option value="Tax & Transfer Pricing">Tax & Transfer Pricing</option>
                    <option value="Valuation & Financial Modeling">Valuation & Financial Modeling</option>
                    <option value="ESG & Sustainability Assurance">ESG & Sustainability Assurance</option>
                    <option value="FinTech & AI in Finance">FinTech & AI in Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Target Professional Audience
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as TargetAudience)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="Senior Audit Managers & Partners">Senior Audit Managers & Partners</option>
                    <option value="CFO & Finance Directors">CFO & Finance Directors</option>
                    <option value="Audit Committee & Board">Audit Committee & Board</option>
                    <option value="Staff & Senior Auditors">Staff & Senior Auditors</option>
                    <option value="Financial Analysts & Controllers">Financial Analysts & Controllers</option>
                    <option value="Compliance & Risk Officers">Compliance & Risk Officers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Workflow Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ArticleStatus)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="draft">Draft in Progress</option>
                    <option value="under_review">Under Technical Review</option>
                    <option value="peer_reviewed">Peer Reviewed (Approved)</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              {/* Standard Citations Badges Bar */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center space-x-1">
                    <Building className="w-3.5 h-3.5 text-amber-700" />
                    <span>Link Standard Citations to Article</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Click to toggle</span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto p-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                  {STANDARDS_DATABASE.map((std) => {
                    const isSelected = standardsCited.includes(std.code);
                    return (
                      <button
                        key={std.code}
                        type="button"
                        onClick={() => handleToggleStandard(std.code)}
                        className={`text-[11px] font-mono-num font-medium px-2 py-0.5 rounded-md border transition-all ${
                          isSelected
                            ? 'bg-amber-900 text-white border-amber-900 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {std.code}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Specialized Financial & Audit Insertion Bar */}
            <div className="bg-white p-2.5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase px-2">Quick Insert:</span>

              <button
                type="button"
                onClick={() => setShowObservationModal(true)}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold rounded-md flex items-center space-x-1 transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>5 Cs Audit Finding</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  insertTextAtCursor(`\n\n### Financial Statement Impact & Variance Schedule\n\n| Financial Line Item | FY2025 Audited ($M) | FY2026 Preliminary ($M) | Variance ($M) | Variance (%) | Audit Assertion |\n| :--- | :---: | :---: | :---: | :---: | :--- |\n| **Revenue from Contracts** | $142.5 | $168.2 | +$25.7 | +18.0% | Occurrence & Cutoff |\n| **Cost of Goods Sold (COGS)** | ($84.0) | ($98.1) | +$14.1 | +16.8% | Accuracy & Completeness |\n| **Operating Profit (IFRS 18)** | **$58.5** | **$70.1** | **+$11.6** | **+19.8%** | Valuation & Allocation |\n| **Cash & Cash Equivalents** | $32.4 | $41.8 | +$9.4 | +29.0% | Existence & Rights |\n\n`);
                }}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium rounded-md flex items-center space-x-1"
              >
                <TableIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>Financial Table</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  insertTextAtCursor(`\n\n> **Executive Takeaway for the Audit Committee:**  \n> [Insert concise 2-sentence key risk observation, quantified impact, and direct governance action item required from executive management.]\n\n`);
                }}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium rounded-md flex items-center space-x-1"
              >
                <Quote className="w-3.5 h-3.5 text-emerald-600" />
                <span>Executive Callout</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  insertTextAtCursor(`\n\n### Substantive Audit Procedures & Testing Checklist\n- [ ] **Step 1:** Reconcile general ledger trial balance to subledger schedules.\n- [ ] **Step 2:** Sample high-risk journal entries posted near period-end cutoff.\n- [ ] **Step 3:** Confirm third-party bank and accounts receivable balances independently.\n- [ ] **Step 4:** Evaluate management accounting estimates for goodwill and intangible asset impairment.\n\n`);
                }}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium rounded-md flex items-center space-x-1"
              >
                <FileCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Audit Checklist</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  insertTextAtCursor(`\n\n\`\`\`\n[General Ledger Account]               Dr. $XXX,XXX\n    [Contra / Adjustment Account]              Cr. $XXX,XXX\n(To adjust revenue recognition cutoff in accordance with IFRS 15 / ASC 606)\n\`\`\`\n\n`);
                }}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono-num rounded-md flex items-center space-x-1"
              >
                <span>Dr / Cr Entry</span>
              </button>
            </div>

            {/* Split / Focus Editor View */}
            <div className={`grid ${viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2 gap-4' : 'grid-cols-1'}`}>
              {/* Markdown Editor Pane */}
              {(viewMode === 'edit' || viewMode === 'split') && (
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col h-[680px]">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono-num">
                    <span>Markdown Working Paper</span>
                    <span>{wordCount} words • {estimatedReadTime} min read</span>
                  </div>
                  <textarea
                    id="article-content-textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write article in Markdown. Use # for Headings, > for Callouts, | for Tables, and Dr/Cr blocks..."
                    className="flex-1 w-full p-4 text-sm font-mono leading-relaxed resize-none focus:outline-none focus:ring-0 text-slate-900 bg-white"
                  />
                </div>
              )}

              {/* Live Rendered Article Preview Pane */}
              {(viewMode === 'preview' || viewMode === 'split') && (
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col h-[680px]">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono-num">
                    <span>Live Rendered Editorial Layout</span>
                    <span className="text-amber-800 font-semibold">{category}</span>
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto prose-audit">
                    {title && <h1 className="font-editorial text-2xl font-bold text-[#0F172A] mb-2">{title}</h1>}
                    {subtitle && <p className="text-sm text-slate-600 italic mb-4">{subtitle}</p>}
                    <ReactMarkdown>{content || '*Start writing or generate an outline using the AI Writing Copilot on the right.*'}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Collapsible Right Sidebar: AI Copilot & Author Details */}
          {showAiSidebar && (
            <div className="lg:col-span-4 space-y-6">
              {/* AI Writing Copilot Card */}
              <div className="bg-white rounded-xl p-5 border border-amber-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-editorial text-base font-bold text-[#0F172A]">
                        Audit & Finance AI Copilot
                      </h3>
                      <p className="text-[11px] text-slate-500">Gemini 3.7 Technical Accounting Assistant</p>
                    </div>
                  </div>
                </div>

                {/* Copilot Action Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Task
                  </label>
                  <select
                    value={aiAction}
                    onChange={(e) => setAiAction(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="generate-outline">🌟 Generate Technical Outline</option>
                    <option value="draft-audit-finding">🔍 Draft 5 Cs Audit Observation</option>
                    <option value="polish-executive">✍️ Polish to Board/Audit Committee Tone</option>
                    <option value="explain-standard">📖 Explain Standard & Journal Entries</option>
                    <option value="materiality-memo">📊 Draft Audit Materiality Memo</option>
                    <option value="summarize">📝 Generate Executive Summary & Key Takeaways</option>
                    <option value="technical-review">🛡️ Perform Rigorous Peer Review</option>
                    <option value="custom">💬 Custom Finance/Audit Prompt</option>
                  </select>
                </div>

                {/* Additional Guidance / Standard Selector if applicable */}
                {aiAction === 'explain-standard' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Accounting / Auditing Standard
                    </label>
                    <select
                      value={selectedStandard}
                      onChange={(e) => setSelectedStandard(e.target.value)}
                      className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    >
                      {STANDARDS_DATABASE.map((std) => (
                        <option key={std.code} value={std.code}>
                          {std.code} - {std.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Custom prompt input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Specific Focus / Key Facts (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Focus on revenue recognition cutoff near Q4 close, or cloud ERP migration controls..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRunAiAssist}
                  disabled={aiLoading}
                  className="w-full bg-[#0F172A] hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-xs flex items-center justify-center space-x-2 transition-all"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Analyzing Standards & Drafting...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 text-amber-400" />
                      <span>Run AI Technical Assistant</span>
                    </>
                  )}
                </button>

                {/* AI Result Box */}
                {aiResult && (
                  <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-xs space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-amber-900 font-bold text-[11px] uppercase tracking-wider">
                      <span>Generated Technical Output</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(aiResult);
                        }}
                        className="text-amber-800 hover:text-amber-950 font-semibold flex items-center space-x-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>

                    <div className="max-h-60 overflow-y-auto text-slate-800 font-mono text-[11px] leading-relaxed p-2 bg-white rounded border border-amber-200">
                      {aiResult}
                    </div>

                    <button
                      onClick={handleApplyAiResult}
                      className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-1.5 rounded-lg text-xs flex items-center justify-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Insert Output into Article Draft</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Author & Publication Details Card */}
              <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs space-y-4">
                <h3 className="font-editorial text-base font-bold text-[#0F172A] pb-2 border-b border-slate-100">
                  Author Byline & Metadata
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Credentials
                    </label>
                    <input
                      type="text"
                      value={authorCredentials}
                      onChange={(e) => setAuthorCredentials(e.target.value)}
                      placeholder="e.g. CPA, CIA, CFE"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Firm / Org
                    </label>
                    <input
                      type="text"
                      value={authorFirm}
                      onChange={(e) => setAuthorFirm(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Professional Role
                  </label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. ISA 315, Revenue Cutoff, SOX 404"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5 Cs Observation Builder Modal */}
      <AuditObservationBuilder
        isOpen={showObservationModal}
        onClose={() => setShowObservationModal(false)}
        onInsertFinding={insertAuditFindingFromBuilder}
      />

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-[#0F172A]">
                  Select Professional Article Template
                </h3>
                <p className="text-xs text-slate-500">
                  Pre-configured technical structures for auditing, IFRS accounting, materiality memos, and governance.
                </p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {ARTICLE_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => handleLoadTemplate(tpl)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 cursor-pointer transition-all flex items-start justify-between group"
                >
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-sans font-bold text-sm text-[#0F172A] group-hover:text-amber-950">
                        {tpl.name}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-slate-100 text-slate-700">
                        {tpl.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {tpl.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-2 text-[11px] font-mono-num text-amber-800">
                      <span>Standards: {tpl.defaultStandards.join(', ')}</span>
                      <span>•</span>
                      <span>Audience: {tpl.targetAudience}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-700 shrink-0 mt-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
