import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Bookmark, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  PlusCircle, 
  BookOpen,
  Edit3,
  Layers,
  TrendingUp,
  FileText,
  ShieldCheck,
  Zap,
  BarChart3
} from 'lucide-react';
import { Article } from '../../types';

interface ArticleFeedProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onEditArticle: (article: Article) => void;
  onNewArticle: () => void;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
}

export const ArticleFeed: React.FC<ArticleFeedProps> = ({
  articles,
  onSelectArticle,
  onEditArticle,
  onNewArticle,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedAudience, setSelectedAudience] = useState<string>('ALL');
  const [feedViewTab, setFeedViewTab] = useState<'published' | 'drafts' | 'saved'>('published');

  const categories = [
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

  const audiences = [
    'ALL',
    'Audit Committee & Board',
    'CFO & Finance Directors',
    'Senior Audit Managers & Partners',
    'Staff & Senior Auditors',
    'Financial Analysts & Controllers',
    'Compliance & Risk Officers',
  ];

  const starterTemplates = [
    {
      title: 'IFRS 18 & Presentation of Financial Performance',
      category: 'Financial Reporting & IFRS',
      desc: 'Analyze mandatory subtotals, operating vs financing categorization, and management performance measures (MPMs).',
      icon: BarChart3,
      badge: 'Reporting'
    },
    {
      title: 'Automated Audit Procedures & GITCs under ISA 315',
      category: 'External Audit & Assurance',
      desc: 'Substantive testing protocols for automated 3-way match, ERP change management, and IT controls.',
      icon: ShieldCheck,
      badge: 'Audit & Risk'
    },
    {
      title: 'Double Materiality Matrix under CSRD & ESRS',
      category: 'ESG & Sustainability Assurance',
      desc: 'Framework for assessing inside-out stakeholder impact and outside-in enterprise value sustainability risks.',
      icon: Layers,
      badge: 'ESG Assurance'
    },
    {
      title: 'AI & Data Analytics in Fraud & Forensic Accounting',
      category: 'FinTech & AI in Finance',
      desc: 'Leveraging anomaly detection models and Benford analysis for automated journal entry risk scoring.',
      icon: Zap,
      badge: 'FinTech AI'
    }
  ];

  const filteredArticles = articles.filter((art) => {
    if (feedViewTab === 'published' && art.status !== 'published') return false;
    if (feedViewTab === 'drafts' && art.status === 'published') return false;
    if (feedViewTab === 'saved' && !bookmarkedIds.includes(art.id)) return false;

    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.tags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (art.standardsCited || []).some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || art.category === selectedCategory;
    const matchesAudience = selectedAudience === 'ALL' || art.targetAudience === selectedAudience;

    return matchesSearch && matchesCategory && matchesAudience;
  });

  const featuredArticle = articles.find((a) => a.isFeatured && a.status === 'published') || articles[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Sleek Modern Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0B0F19] via-[#131B2E] to-[#0B0F19] text-white p-8 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Glow orb backdrop */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-12 w-72 h-72 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Next-Gen Finance & Audit Publishing Platform</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Intelligence for Modern <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Finance & Markets</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Authoritative research papers, technical accounting memos, audit working papers, and valuation frameworks. Powered by AI authoring and standard citations.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onNewArticle}
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Write New Article</span>
              </button>

              <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono-num bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{articles.length} Total Articles In Library</span>
              </div>
            </div>
          </div>

          {/* Quick Stat Pill Cards */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
            <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
              <div className="text-[11px] font-medium text-slate-400">Published Articles</div>
              <div className="text-2xl font-bold font-mono-num text-white mt-1">
                {articles.filter(a => a.status === 'published').length}
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
              <div className="text-[11px] font-medium text-slate-400">Saved Research</div>
              <div className="text-2xl font-bold font-mono-num text-indigo-400 mt-1">
                {bookmarkedIds.length}
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
              <div className="text-[11px] font-medium text-slate-400">Topic Domains</div>
              <div className="text-2xl font-bold font-mono-num text-cyan-400 mt-1">
                {categories.length - 1}
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
              <div className="text-[11px] font-medium text-slate-400">Active Drafts</div>
              <div className="text-2xl font-bold font-mono-num text-amber-400 mt-1">
                {articles.filter(a => a.status !== 'published').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Feed Controls & Filters */}
      <div className="space-y-4">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div className="flex space-x-2">
            <button
              onClick={() => setFeedViewTab('published')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                feedViewTab === 'published'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Published Articles</span>
            </button>

            <button
              onClick={() => setFeedViewTab('drafts')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                feedViewTab === 'drafts'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Drafts & Reviews</span>
            </button>

            <button
              onClick={() => setFeedViewTab('saved')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                feedViewTab === 'saved'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved Articles ({bookmarkedIds.length})</span>
            </button>
          </div>

          <button
            onClick={onNewArticle}
            className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Draft</span>
          </button>
        </div>

        {/* Search & Domain Filter Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by topic, standard (IFRS 18, ISA 315, SOX), author, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All Domain Topics</option>
              {categories.slice(1).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All Target Audiences</option>
              {audiences.slice(1).map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Topic Selector Pills Bar */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Filter by Topic:
              </span>
              <span className="text-[11px] text-slate-400">
                Click any domain below to filter articles
              </span>
            </div>
            {selectedCategory !== 'ALL' && (
              <button
                onClick={() => setSelectedCategory('ALL')}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
              >
                Reset to All Topics
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = cat === 'ALL'
                ? articles.filter((a) => feedViewTab === 'published' ? a.status === 'published' : feedViewTab === 'drafts' ? a.status !== 'published' : bookmarkedIds.includes(a.id)).length
                : articles.filter((a) => (a.category === cat) && (feedViewTab === 'published' ? a.status === 'published' : feedViewTab === 'drafts' ? a.status !== 'published' : bookmarkedIds.includes(a.id))).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>{cat === 'ALL' ? '🌐 All Topics' : cat}</span>
                  <span
                    className={`text-[10px] font-mono-num px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-white text-indigo-900 font-extrabold'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
          <div className="flex items-center space-x-2">
            <span>Showing articles for topic:</span>
            <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
              {selectedCategory === 'ALL' ? 'All Financial & Audit Domains' : selectedCategory}
            </span>
            <span>({filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} found)</span>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const isSaved = bookmarkedIds.includes(article.id);
            return (
              <div
                key={article.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6">
                  {/* Category & Bookmark Bar */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">
                      {article.category}
                    </span>

                    <button
                      onClick={() => onToggleBookmark(article.id)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                      title={isSaved ? 'Remove from saved' : 'Save article'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600 text-indigo-600' : ''}`} />
                    </button>
                  </div>

                  {/* Title */}
                  <h2
                    onClick={() => onSelectArticle(article)}
                    className="font-heading text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer mb-2 line-clamp-2 leading-snug"
                  >
                    {article.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4 font-sans">
                    {article.excerpt}
                  </p>

                  {/* Standards Cited Badges */}
                  {article.standardsCited && article.standardsCited.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {article.standardsCited.slice(0, 3).map((std) => (
                        <span
                          key={std}
                          className="text-[10px] font-mono-num font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md"
                        >
                          {std}
                        </span>
                      ))}
                      {article.standardsCited.length > 3 && (
                        <span className="text-[10px] font-mono-num text-slate-500 self-center">
                          +{article.standardsCited.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer: Author & Read Time */}
                <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={article.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                      alt={article.author.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block truncate max-w-[130px]">
                        {article.author.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono-num block">
                        {article.readTimeMinutes} min read
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {article.status !== 'published' ? (
                      <button
                        onClick={() => onEditArticle(article)}
                        className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Edit Draft
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectArticle(article)}
                        className="text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-all cursor-pointer shadow-xs"
                      >
                        <span>Read</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State with Quick-Start Templates */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center">
          <div className="max-w-xl mx-auto space-y-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
              <FileText className="w-8 h-8" />
            </div>
            
            <h3 className="font-heading text-2xl font-bold text-slate-900">
              Start Writing on DecodingFinance
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Your research library is ready for your fresh publications. Create your own custom article from scratch or pick a professional finance template to jump-start your writing.
            </p>

            <button
              onClick={onNewArticle}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/20 inline-flex items-center space-x-2 cursor-pointer transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Custom Article From Scratch</span>
            </button>
          </div>

          <div className="border-t border-slate-100 pt-8">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Or Start With a Topic Template:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left max-w-5xl mx-auto">
              {starterTemplates.map((template, idx) => {
                const Icon = template.icon;
                return (
                  <div
                    key={idx}
                    onClick={onNewArticle}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100/60 text-indigo-700 flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold font-mono-num text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {template.badge}
                        </span>
                      </div>

                      <h4 className="font-heading text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
                        {template.title}
                      </h4>

                      <p className="text-xs text-slate-500 leading-relaxed">
                        {template.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                      <span>Use Template</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
