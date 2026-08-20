import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  ArrowLeft, 
  Bookmark, 
  Heart, 
  Share2, 
  Printer, 
  Clock, 
  Calendar, 
  Building, 
  Check, 
  Copy, 
  MessageSquare, 
  Edit3, 
  AlertCircle,
  FileText,
  Quote,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Article, ReviewComment } from '../../types';
import { STANDARDS_DATABASE } from '../../data/standardsData';

interface ArticleReaderProps {
  article: Article;
  onBack: () => void;
  onEdit: (article: Article) => void;
  onToggleBookmark: (id: string) => void;
  isBookmarked: boolean;
  onAddReviewComment?: (articleId: string, comment: ReviewComment) => void;
  allArticles?: Article[];
  onSelectArticle?: (article: Article) => void;
  bookmarkedIds?: string[];
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({
  article,
  onBack,
  onEdit,
  onToggleBookmark,
  isBookmarked,
  onAddReviewComment,
  allArticles = [],
  onSelectArticle,
  bookmarkedIds = [],
}) => {
  const [likes, setLikes] = useState(article.likesCount || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [showCitationModal, setShowCitationModal] = useState(false);
  const [citationFormat, setCitationFormat] = useState<'APA' | 'Harvard' | 'Chicago' | 'AuditMemo'>('AuditMemo');
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [commenterName, setCommenterName] = useState('Senior Reviewer');
  const [commenterRole, setCommenterRole] = useState('Partner / Quality Reviewer');
  
  // Topic selection state for articles shown down below
  const [selectedDownTopic, setSelectedDownTopic] = useState<string>(article.category || 'ALL');

  const topicOptions = [
    'ALL',
    'External Audit & Assurance',
    'Internal Audit & Advisory',
    'Forensic Accounting & Fraud',
    'Financial Reporting & IFRS',
    'Corporate Governance & SOX',
    'Tax & Transfer Pricing',
    'Valuation & Financial Modeling',
    'ESG & Sustainability Assurance',
    'FinTech & AI in Finance',
  ];

  // Articles filtered by selected topic down below
  const downArticles = allArticles
    .filter((a) => a.id !== article.id && a.status === 'published')
    .filter((a) => selectedDownTopic === 'ALL' || a.category === selectedDownTopic);

  const handleLike = (e: React.MouseEvent) => {
    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const generateCitation = () => {
    const pubYear = new Date(article.publishedAt || Date.now()).getFullYear();
    const dateFormatted = new Date(article.publishedAt || Date.now()).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    switch (citationFormat) {
      case 'APA':
        return `${article.author.name} (${pubYear}). ${article.title}. DecodingFinance Professional Intelligence. Retrieved from https://decodingfinance.com/articles/${article.slug}`;
      case 'Harvard':
        return `${article.author.name}, ${pubYear}. '${article.title}', DecodingFinance Journal, published ${dateFormatted}.`;
      case 'Chicago':
        return `${article.author.name}. "${article.title}." DecodingFinance Journal of Finance & Audit (${pubYear}).`;
      case 'AuditMemo':
      default:
        return `[Reference: ${article.author.name} (${article.author.credentials || 'CPA'}), "${article.title}", DecodingFinance. Applicable Standards: ${(article.standardsCited || []).join(', ') || 'N/A'}]`;
    }
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(generateCitation());
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    if (onAddReviewComment) {
      const comment: ReviewComment = {
        id: `rev-${Date.now()}`,
        authorName: commenterName,
        authorRole: commenterRole,
        createdAt: new Date().toISOString(),
        content: newCommentText.trim(),
        resolved: false,
      };
      onAddReviewComment(article.id, comment);
      setNewCommentText('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900">
      {/* Top Reading Navigation Bar */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 py-3 no-print shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-xs font-bold text-slate-600 hover:text-indigo-600 flex items-center space-x-1.5 py-1.5 px-3 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Library</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCitationModal(true)}
              className="text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-white border border-slate-200 hover:border-indigo-300 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Quote className="w-3.5 h-3.5" />
              <span>Cite</span>
            </button>

            <button
              onClick={handlePrint}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
              title="Print formatted paper"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={() => onEdit(article)}
              className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Article</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Article Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 print-container">
        {/* Category & Status Header */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-indigo-600 text-white shadow-xs">
            {article.category}
          </span>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700">
            Target Audience: {article.targetAudience}
          </span>

          {article.status === 'published' ? (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Published & Verified</span>
            </span>
          ) : (
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 uppercase font-mono-num">
              {article.status.replace('_', ' ')}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4 leading-[1.18]">
          {article.title}
        </h1>

        {/* Subtitle / Excerpt */}
        {article.subtitle && (
          <p className="text-lg sm:text-xl text-slate-600 font-sans leading-relaxed mb-6 font-normal">
            {article.subtitle}
          </p>
        )}

        {/* Author Byline & Meta Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <img
              src={article.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
              alt={article.author.name}
              className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-sans font-bold text-sm text-slate-900">
                  {article.author.name}
                </span>
                {article.author.credentials && (
                  <span className="text-xs font-mono-num font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {article.author.credentials}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {article.author.role} • {article.author.firmOrOrganization || 'DecodingFinance Insights'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono-num text-slate-500 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{new Date(article.publishedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{article.readTimeMinutes} min read</span>
            </div>
          </div>
        </div>

        {/* Standards Cited Banner */}
        {article.standardsCited && article.standardsCited.length > 0 && (
          <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-5 mb-8 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2.5 flex items-center space-x-2">
              <Building className="w-4 h-4 text-indigo-400" />
              <span>Governing Standards & Frameworks Cited</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.standardsCited.map((stdCode) => {
                const stdInfo = STANDARDS_DATABASE.find((s) => s.code === stdCode);
                return (
                  <div
                    key={stdCode}
                    className="bg-slate-800/90 border border-slate-700 px-3 py-1 rounded-lg text-xs font-medium text-slate-200 flex items-center space-x-1.5"
                  >
                    <span className="font-mono-num font-bold text-indigo-400">{stdCode}</span>
                    {stdInfo && (
                      <span className="text-[11px] text-slate-400 hidden sm:inline">
                        ({stdInfo.name})
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Article Body */}
        <div className="prose-audit max-w-none text-slate-800 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm leading-relaxed">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>

        {/* Structured Audit Findings Section (if present) */}
        {article.auditFindings && article.auditFindings.length > 0 && (
          <div className="mt-10 bg-indigo-50/40 border border-indigo-200 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center space-x-2 text-indigo-950 font-bold text-lg mb-4">
              <AlertCircle className="w-5 h-5 text-indigo-600" />
              <h2>Documented Findings & Working Papers (5 Cs)</h2>
            </div>

            <div className="space-y-6">
              {article.auditFindings.map((finding) => (
                <div
                  key={finding.id}
                  className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading font-bold text-base text-slate-900">
                      {finding.title}
                    </h3>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-md font-mono-num uppercase ${
                        finding.severity === 'Critical'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : finding.severity === 'High'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {finding.severity} Risk
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="font-bold text-slate-800 block mb-1">1. CONDITION</span>
                      <p className="text-slate-600 leading-relaxed">{finding.condition}</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="font-bold text-slate-800 block mb-1">2. CRITERIA</span>
                      <p className="text-slate-600 leading-relaxed">{finding.criteria}</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="font-bold text-slate-800 block mb-1">3. CAUSE</span>
                      <p className="text-slate-600 leading-relaxed">{finding.cause}</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="font-bold text-slate-800 block mb-1">4. CONSEQUENCE (IMPACT)</span>
                      <p className="text-slate-600 leading-relaxed">{finding.consequence}</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-200/80 text-xs">
                    <span className="font-bold text-indigo-950 block mb-1">5. RECOMMENDATION & CORRECTIVE ACTION</span>
                    <p className="text-indigo-900 leading-relaxed">{finding.recommendation}</p>
                  </div>

                  {finding.managementResponse && (
                    <div className="mt-2.5 text-xs text-slate-500 italic">
                      <strong>Management Response:</strong> {finding.managementResponse}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Article Footer & Actions */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 no-print">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLike}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                hasLiked
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-600 text-rose-600' : 'text-slate-400'}`} />
              <span>{likes} Professional Endorsements</span>
            </button>

            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-indigo-50 text-indigo-800 border border-indigo-300'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-indigo-600 text-indigo-600' : 'text-slate-400'}`} />
              <span>{isBookmarked ? 'Saved to Library' : 'Save Article'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Peer Review Notes ({article.reviewComments?.length || 0})</span>
            </button>
          </div>
        </div>

        {/* Peer Review Notes Section */}
        {showComments && (
          <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm no-print">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
              <h3 className="font-heading text-xl font-bold text-slate-900 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <span>Technical Review & Editorial Notes</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono-num">
                Audit Trail ID: #REV-{article.id}
              </span>
            </div>

            {/* Comments List */}
            <div className="space-y-4 mb-6">
              {article.reviewComments && article.reviewComments.length > 0 ? (
                article.reviewComments.map((comment) => (
                  <div key={comment.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{comment.authorName}</span>
                        <span className="text-[11px] text-slate-500">({comment.authorRole})</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono-num">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic py-4 text-center">
                  No technical review notes recorded yet. Add your observation below.
                </p>
              )}
            </div>

            {/* Add Review Note Form */}
            <form onSubmit={handleAddComment} className="pt-4 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Reviewer Name (e.g. Elena Rostova, CPA)"
                  value={commenterName}
                  onChange={(e) => setCommenterName(e.target.value)}
                  className="px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Reviewer Role (e.g. Partner / Technical Lead)"
                  value={commenterRole}
                  onChange={(e) => setCommenterRole(e.target.value)}
                  className="px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <textarea
                rows={3}
                placeholder="Enter technical accounting, audit procedure, or market feedback..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full p-3.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Submit Peer Review Note
              </button>
            </form>
          </div>
        )}
      </article>

      {/* Explore More Articles Down Below by Topic */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-heading text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>Explore More Professional Articles</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select a domain topic below to browse relevant research papers, audit memos, and technical briefings.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium">Topic:</span>
            <select
              value={selectedDownTopic}
              onChange={(e) => setSelectedDownTopic(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All Domain Topics</option>
              {topicOptions.slice(1).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Topic Pill Selector */}
        <div className="py-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Choose Topic to Show Articles Down Here:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {topicOptions.map((topic) => {
              const isSelected = selectedDownTopic === topic;
              const matchingCount = topic === 'ALL'
                ? allArticles.filter((a) => a.id !== article.id && a.status === 'published').length
                : allArticles.filter((a) => a.id !== article.id && a.category === topic && a.status === 'published').length;

              return (
                <button
                  key={topic}
                  onClick={() => setSelectedDownTopic(topic)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>{topic === 'ALL' ? '🌐 All Topics' : topic}</span>
                  <span
                    className={`text-[10px] font-mono-num px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-white text-indigo-900 font-extrabold'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {matchingCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Articles List Down Below */}
        <div className="mt-4">
          {downArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {downArticles.map((downArt) => {
                const isSaved = bookmarkedIds.includes(downArt.id);
                return (
                  <div
                    key={downArt.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono-num font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded">
                          {downArt.category}
                        </span>
                        <div className="flex items-center space-x-1 text-slate-400 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{downArt.readTimeMinutes} min</span>
                        </div>
                      </div>

                      <h4
                        onClick={() => {
                          if (onSelectArticle) {
                            onSelectArticle(downArt);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className="font-heading text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2 mb-1.5"
                      >
                        {downArt.title}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                        {downArt.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={downArt.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                          alt={downArt.author.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div className="text-[11px] font-medium text-slate-700 truncate max-w-[120px]">
                          {downArt.author.name}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => onToggleBookmark(downArt.id)}
                          title={isSaved ? 'Remove from Saved' : 'Save article'}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            isSaved
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : 'bg-white text-slate-400 border-slate-200 hover:text-slate-600'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (onSelectArticle) {
                              onSelectArticle(downArt);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                          className="bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer"
                        >
                          <span>Read</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-500 font-medium">
                No other published articles found in the topic "{selectedDownTopic}".
              </p>
              <button
                onClick={() => setSelectedDownTopic('ALL')}
                className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
              >
                View all topics
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Citation Modal */}
      {showCitationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="font-heading text-xl font-bold text-slate-900 mb-2 flex items-center space-x-2">
              <Quote className="w-5 h-5 text-indigo-600" />
              <span>Cite This Professional Article</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select standard format to reference in your audit working papers, board decks, or research reports.
            </p>

            {/* Format buttons */}
            <div className="flex space-x-2 mb-4">
              {(['AuditMemo', 'APA', 'Harvard', 'Chicago'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setCitationFormat(fmt)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                    citationFormat === fmt
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {fmt === 'AuditMemo' ? 'Audit Memo' : fmt}
                </button>
              ))}
            </div>

            {/* Citation Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono-num text-slate-800 leading-relaxed mb-5 select-all">
              {generateCitation()}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCitationModal(false)}
                className="text-xs font-bold text-slate-600 hover:text-slate-800 px-3 py-2 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleCopyCitation}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
              >
                {copiedCitation ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCitation ? 'Copied' : 'Copy Citation'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
