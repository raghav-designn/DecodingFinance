import React, { useState } from 'react';
import { Search, Bookmark, ExternalLink, Copy, Check, Filter } from 'lucide-react';
import { STANDARDS_DATABASE } from '../../data/standardsData';
import { StandardCitation } from '../../types';

interface StandardsLibraryProps {
  onCiteStandard?: (standard: StandardCitation) => void;
}

export const StandardsLibrary: React.FC<StandardsLibraryProps> = ({ onCiteStandard }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBody, setSelectedBody] = useState<string>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const bodies = ['ALL', 'IAASB', 'IASB', 'FASB', 'PCAOB', 'COSO', 'EFRAG', 'OECD'];

  const filteredStandards = STANDARDS_DATABASE.filter((std) => {
    const matchesSearch =
      std.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBody = selectedBody === 'ALL' || std.body === selectedBody;

    return matchesSearch && matchesBody;
  });

  const handleCopy = (standard: StandardCitation) => {
    const citationText = `[Standard: ${standard.code} (${standard.body}) - ${standard.name}]`;
    navigator.clipboard.writeText(citationText);
    setCopiedCode(standard.code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="bg-[#0F172A] text-white rounded-xl p-8 mb-8 border border-amber-900/20 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono-num font-semibold uppercase tracking-wider mb-2">
            <Bookmark className="w-4 h-4" />
            <span>Authoritative Standards Repository</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Standards & Regulatory Frameworks Hub
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Instant technical reference for International Standards on Auditing (ISA), IFRS, US GAAP (ASC), PCAOB Auditing Standards, and COSO Internal Control principles. Cite directly into your articles and working papers.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="standards-search-input"
            type="text"
            placeholder="Search standards by code, keyword, or asserting body (e.g. ISA 315, IFRS 18, COSO, Leases, Revenue)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center">
            <Filter className="w-3 h-3 mr-1" /> Body:
          </span>
          {bodies.map((body) => (
            <button
              key={body}
              onClick={() => setSelectedBody(body)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedBody === body
                  ? 'bg-[#0F172A] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {body}
            </button>
          ))}
        </div>
      </div>

      {/* Standards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStandards.map((std) => (
          <div
            key={std.code}
            className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs hover:border-amber-300 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono-num font-bold text-sm text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  {std.code}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {std.body}
                </span>
              </div>

              <h3 className="font-sans font-bold text-base text-[#0F172A] mb-2 line-clamp-2">
                {std.name}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {std.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => handleCopy(std)}
                className="text-slate-600 hover:text-amber-800 font-medium flex items-center space-x-1 transition-colors"
                title="Copy standard citation"
              >
                {copiedCode === std.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Citation</span>
                  </>
                )}
              </button>

              {onCiteStandard && (
                <button
                  onClick={() => onCiteStandard(std)}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-900 font-medium px-2.5 py-1 rounded border border-amber-200 transition-colors flex items-center space-x-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Insert in Article</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredStandards.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500 font-medium">No standards found matching your filter criteria.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedBody('ALL'); }}
            className="mt-3 text-xs text-amber-800 underline font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
