import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { ArticleFeed } from './components/feed/ArticleFeed';
import { ArticleEditor } from './components/editor/ArticleEditor';
import { ArticleReader } from './components/reader/ArticleReader';
import { MaterialityWorkbench } from './components/tools/MaterialityWorkbench';
import { StandardsLibrary } from './components/standards/StandardsLibrary';
import { INITIAL_ARTICLES } from './data/initialArticles';
import { Article, StandardCitation, ReviewComment } from './types';

const STORAGE_KEY_ARTICLES = 'decodingfinance_articles_v2';
const STORAGE_KEY_BOOKMARKS = 'decodingfinance_bookmarks_v2';

export default function App() {
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ARTICLES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading articles from localStorage', e);
    }
    return INITIAL_ARTICLES;
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading bookmarks', e);
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<'feed' | 'editor' | 'workbench' | 'standards' | 'reader'>('feed');
  const [activeArticleId, setActiveArticleId] = useState<string>(articles[0]?.id || '');
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  // Check server health and API status
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHasApiKey(data.hasGeminiKey ?? true);
      })
      .catch(() => {
        setHasApiKey(true);
      });
  }, []);

  // Save articles to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(articles));
    } catch (e) {
      console.error('Error saving articles', e);
    }
  }, [articles]);

  // Save bookmarks
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error('Error saving bookmarks', e);
    }
  }, [bookmarkedIds]);

  const activeArticle = articles.find((a) => a.id === activeArticleId) || articles[0];

  const handleSelectArticleToRead = (article: Article) => {
    setActiveArticleId(article.id);
    setActiveTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticleToEdit = (article: Article) => {
    setActiveArticleId(article.id);
    setActiveTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateNewArticle = () => {
    const newId = `art-${Date.now()}`;
    const newArticle: Article = {
      id: newId,
      title: 'Title of Your Financial or Audit Article',
      slug: `article-${Date.now()}`,
      subtitle: 'Key insights, financial principles, methodology, and strategic analysis',
      excerpt: 'Draft a succinct summary of your financial model, audit findings, or market analysis here.',
      category: 'Financial Reporting & IFRS',
      targetAudience: 'CFO & Finance Directors',
      status: 'draft',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTimeMinutes: 5,
      content: `# Title of Your Financial or Audit Article

## 1. Executive Summary & Overview
Provide a clear, high-impact introduction to this financial analysis, valuation methodology, or audit procedure.

---

## 2. Core Frameworks & Standards Cited
- **Standard / Principle 1:** Detail the regulatory or accounting context (e.g., IFRS, ISA, GAAP, DCF).
- **Control / Assertion:** Key assertions tested or financial statements affected.

---

## 3. Detailed Technical Analysis & Data Findings
| Dimension / Period | Baseline Metric | Observed Variance | Key Driver |
| :--- | :--- | :--- | :--- |
| **Q1 Operating Performance** | Budget Target | +12.4% | Volume expansion |
| **Working Capital Cycle** | 42 Days | 38 Days | DSO optimization |

---

## 4. Key Takeaways & Strategic Recommendations
1. Summarize strategic takeaways for executive leadership, investors, or the audit committee.
2. Outline specific action items, risk mitigation steps, or next audit milestone dates.`,
      tags: ['Finance', 'Audit', 'Market Analysis'],
      standardsCited: ['IFRS 18', 'ISA 315 (Revised 2019)'],
      author: {
        name: 'Author Name, CPA / CFA',
        role: 'Senior Finance Lead & Researcher',
        credentials: 'CPA, CFA',
        firmOrOrganization: 'DecodingFinance Advisory',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        bio: 'Specialist in strategic finance, auditing, and corporate valuation.',
      },
      viewsCount: 0,
      likesCount: 0,
      bookmarksCount: 0,
    };

    setArticles([newArticle, ...articles]);
    setActiveArticleId(newId);
    setActiveTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveArticle = (updatedArticle: Article) => {
    setArticles((prev) =>
      prev.map((art) => (art.id === updatedArticle.id ? updatedArticle : art))
    );
  };

  const handlePublishArticle = (updatedArticle: Article) => {
    handleSaveArticle(updatedArticle);
    setActiveTab('feed');
  };

  const handleDeleteArticle = (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      const remaining = articles.filter((a) => a.id !== id);
      setArticles(remaining);
      if (remaining.length > 0) {
        setActiveArticleId(remaining[0].id);
      } else {
        setActiveArticleId('');
      }
      setActiveTab('feed');
    }
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
    );
  };

  const handleAddReviewComment = (articleId: string, comment: ReviewComment) => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === articleId) {
          return {
            ...art,
            reviewComments: [...(art.reviewComments || []), comment],
          };
        }
        return art;
      })
    );
  };

  const handleInsertFromWorkbench = (markdown: string) => {
    if (activeArticle) {
      const updatedContent = activeArticle.content + '\n\n' + markdown + '\n\n';
      const updatedArticle = {
        ...activeArticle,
        content: updatedContent,
      };
      handleSaveArticle(updatedArticle);
      setActiveTab('editor');
    } else {
      handleCreateNewArticle();
    }
  };

  const handleCiteStandardInEditor = (std: StandardCitation) => {
    if (activeArticle) {
      const citationBadge = `> **Standard Reference:** **${std.code}** (${std.body}) - *${std.name}*\n> ${std.summary}\n\n`;
      const updatedStandards = activeArticle.standardsCited.includes(std.code)
        ? activeArticle.standardsCited
        : [...activeArticle.standardsCited, std.code];

      const updatedArticle = {
        ...activeArticle,
        content: activeArticle.content + '\n\n' + citationBadge,
        standardsCited: updatedStandards,
      };
      handleSaveArticle(updatedArticle);
      setActiveTab('editor');
    } else {
      handleCreateNewArticle();
    }
  };

  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftsCount = articles.filter((a) => a.status !== 'published').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100">
      {/* Universal Navigation Header */}
      <Navbar
        activeTab={activeTab === 'reader' ? 'feed' : activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNewArticle={handleCreateNewArticle}
        articlesCount={publishedCount}
        draftsCount={draftsCount}
        savedCount={bookmarkedIds.length}
        hasApiKey={hasApiKey}
      />

      {/* Main View Router */}
      <main className="flex-1 bg-slate-50 text-slate-900">
        {activeTab === 'feed' && (
          <ArticleFeed
            articles={articles}
            onSelectArticle={handleSelectArticleToRead}
            onEditArticle={handleSelectArticleToEdit}
            onNewArticle={handleCreateNewArticle}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {activeTab === 'editor' && (
          activeArticle ? (
            <ArticleEditor
              key={activeArticle.id}
              article={activeArticle}
              onSave={handleSaveArticle}
              onDelete={handleDeleteArticle}
              onPublish={handlePublishArticle}
              hasApiKey={hasApiKey}
            />
          ) : (
            <div className="max-w-xl mx-auto py-24 text-center px-4">
              <h2 className="text-2xl font-bold font-heading text-slate-900 mb-3">No Article Selected</h2>
              <p className="text-sm text-slate-500 mb-6">Create a new article draft to start authoring in our modern studio.</p>
              <button
                onClick={handleCreateNewArticle}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg cursor-pointer"
              >
                Create First Article
              </button>
            </div>
          )
        )}

        {activeTab === 'reader' && (
          activeArticle ? (
            <ArticleReader
              article={activeArticle}
              allArticles={articles}
              onSelectArticle={handleSelectArticleToRead}
              onBack={() => setActiveTab('feed')}
              onEdit={handleSelectArticleToEdit}
              onToggleBookmark={handleToggleBookmark}
              isBookmarked={bookmarkedIds.includes(activeArticle.id)}
              bookmarkedIds={bookmarkedIds}
              onAddReviewComment={handleAddReviewComment}
            />
          ) : (
            <div className="max-w-xl mx-auto py-24 text-center px-4">
              <h2 className="text-2xl font-bold font-heading text-slate-900 mb-3">No Article to View</h2>
              <p className="text-sm text-slate-500 mb-6">Publish an article or write a draft to read it here.</p>
              <button
                onClick={handleCreateNewArticle}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg cursor-pointer"
              >
                Write New Article
              </button>
            </div>
          )
        )}

        {activeTab === 'workbench' && (
          <MaterialityWorkbench
            onInsertIntoArticle={handleInsertFromWorkbench}
          />
        )}

        {activeTab === 'standards' && (
          <StandardsLibrary
            onCiteStandard={handleCiteStandardInEditor}
          />
        )}
      </main>

      {/* Modern High-End Footer */}
      <footer className="bg-[#0B0F19] text-slate-300 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white flex items-center justify-center font-heading font-extrabold text-base shadow-md">
              DF
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading text-lg font-extrabold text-white">DecodingFinance</span>
                <span className="text-[10px] uppercase font-mono-num font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  HUB
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Modern Publishing Platform for Finance, Auditing & Market Intelligence
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono-num">
            <span>IFRS 18 & US GAAP</span>
            <span>•</span>
            <span>ISA 315 Audit Standards</span>
            <span>•</span>
            <span>SOX 404 Controls</span>
            <span>•</span>
            <span>DCF & Valuation</span>
          </div>

          <div className="text-xs text-slate-500 font-mono-num">
            © {new Date().getFullYear()} DecodingFinance. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
