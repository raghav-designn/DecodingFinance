import React from 'react';
import { 
   BookOpen, 
   PenTool, 
   Calculator, 
   Bookmark, 
   Sparkles,
   PlusCircle,
   TrendingUp,
   Search
 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'feed' | 'editor' | 'workbench' | 'standards';
  setActiveTab: (tab: 'feed' | 'editor' | 'workbench' | 'standards') => void;
  onNewArticle: () => void;
  articlesCount: number;
  draftsCount: number;
  savedCount: number;
  hasApiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onNewArticle,
  articlesCount,
  draftsCount,
  savedCount,
  hasApiKey,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-lg text-slate-100">
      {/* Top Ticker / Meta Bar */}
      <div className="border-b border-slate-800/60 bg-[#070A10] py-1.5 px-4 sm:px-6 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-semibold text-indigo-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="tracking-wide uppercase font-mono-num text-[10px]">DecodingFinance Network</span>
          </div>
          <span className="hidden sm:inline-block text-slate-700">•</span>
          <span className="hidden sm:inline-block text-slate-400 text-[11px]">
            Financial Modeling, IFRS, Audit Standards, Equity Research & Market Strategy
          </span>
        </div>

        <div className="flex items-center space-x-3 font-mono-num text-[11px]">
          <div className="flex items-center space-x-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
            <span>{articlesCount} Published</span>
          </div>

          {draftsCount > 0 && (
            <span className="text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 text-[10px]">
              {draftsCount} Draft{draftsCount > 1 ? 's' : ''}
            </span>
          )}

          {hasApiKey ? (
            <span className="hidden md:inline-flex items-center text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 text-[10px] font-medium">
              <Sparkles className="w-3 h-3 mr-1 text-emerald-400" /> AI Engine Active
            </span>
          ) : (
            <span className="hidden md:inline-flex items-center text-slate-400 bg-slate-800/60 px-2.5 py-0.5 rounded-full text-[10px]">
              <Sparkles className="w-3 h-3 mr-1 text-amber-400" /> AI Ready
            </span>
          )}
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('feed')}
            className="cursor-pointer flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white flex items-center justify-center font-heading font-extrabold text-base tracking-tight shadow-md shadow-indigo-500/20 border border-white/10 group-hover:scale-105 transition-all">
              DF
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading text-lg font-extrabold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  DecodingFinance
                </span>
                <span className="text-[10px] uppercase font-mono-num font-bold tracking-wider px-1.5 py-0.2 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans -mt-0.5">Finance, Audit & Market Insights</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1.5 pl-4 border-l border-slate-800">
            <button
              id="nav-feed-btn"
              onClick={() => setActiveTab('feed')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center space-x-2 ${
                activeTab === 'feed'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Articles & Research</span>
            </button>

            <button
              id="nav-editor-btn"
              onClick={() => setActiveTab('editor')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center space-x-2 ${
                activeTab === 'editor'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>Authoring Studio</span>
              {draftsCount > 0 && activeTab !== 'editor' && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              )}
            </button>

            <button
              id="nav-workbench-btn"
              onClick={() => setActiveTab('workbench')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center space-x-2 ${
                activeTab === 'workbench'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Materiality & Tools</span>
            </button>

            <button
              id="nav-standards-btn"
              onClick={() => setActiveTab('standards')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center space-x-2 ${
                activeTab === 'standards'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Standards Hub</span>
            </button>
          </nav>
        </div>

        {/* Action Button */}
        <div className="flex items-center space-x-3">
          <button
            id="header-new-article-btn"
            onClick={onNewArticle}
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-md shadow-indigo-500/20 transition-all flex items-center space-x-1.5 active:scale-95 cursor-pointer border border-indigo-400/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="flex md:hidden border-t border-slate-800/80 px-2 py-1.5 bg-[#070A10] justify-around">
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center space-x-1.5 ${
            activeTab === 'feed' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Feed</span>
        </button>
        <button
          onClick={() => setActiveTab('editor')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center space-x-1.5 ${
            activeTab === 'editor' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Write</span>
        </button>
        <button
          onClick={() => setActiveTab('workbench')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center space-x-1.5 ${
            activeTab === 'workbench' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Tools</span>
        </button>
        <button
          onClick={() => setActiveTab('standards')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center space-x-1.5 ${
            activeTab === 'standards' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Standards</span>
        </button>
      </div>
    </header>
  );
};
