import React, { useState } from 'react';
import { 
  Calculator, 
  Copy, 
  Check, 
  ArrowRight, 
  HelpCircle, 
  Percent, 
  FileText
} from 'lucide-react';
import { MaterialityCalculation, AuditSamplingCalc } from '../../types';

interface MaterialityWorkbenchProps {
  onInsertIntoArticle?: (markdown: string) => void;
}

export const MaterialityWorkbench: React.FC<MaterialityWorkbenchProps> = ({
  onInsertIntoArticle,
}) => {
  const [activeTab, setActiveTab] = useState<'materiality' | 'sampling'>('materiality');
  const [copied, setCopied] = useState(false);

  // Materiality State
  const [benchmarkType, setBenchmarkType] = useState<'PBT' | 'Revenue' | 'TotalAssets' | 'GrossProfit' | 'Equity'>('PBT');
  const [benchmarkAmount, setBenchmarkAmount] = useState<number>(12500000); // e.g. $12.5M
  const [benchmarkPercentage, setBenchmarkPercentage] = useState<number>(5.0);
  const [performanceMaterialityPercentage, setPerformanceMaterialityPercentage] = useState<number>(75);
  const [trivialThresholdPercentage, setTrivialThresholdPercentage] = useState<number>(5);
  const [clientType, setClientType] = useState<'listed' | 'private' | 'not_for_profit'>('listed');
  const [engagementRisk, setEngagementRisk] = useState<'low' | 'medium' | 'high'>('medium');

  // Sampling State
  const [populationValue, setPopulationValue] = useState<number>(45000000);
  const [tolerableMisstatement, setTolerableMisstatement] = useState<number>(468750); // Usually PM
  const [expectedMisstatement, setExpectedMisstatement] = useState<number>(46875); // ~10% of PM
  const [confidenceLevel, setConfidenceLevel] = useState<number>(95); // 95% -> risk factor 3.0, 90% -> 2.31, 80% -> 1.61

  // Materiality Calculations
  const overallMateriality = (benchmarkAmount * benchmarkPercentage) / 100;
  const performanceMateriality = (overallMateriality * performanceMaterialityPercentage) / 100;
  const clearlyTrivialThreshold = (overallMateriality * trivialThresholdPercentage) / 100;

  // Sampling Calculations
  const riskFactor = confidenceLevel === 95 ? 3.0 : confidenceLevel === 90 ? 2.31 : 1.61;
  const netTolerable = Math.max(1, tolerableMisstatement - (expectedMisstatement * 1.5));
  const samplingInterval = Math.round(netTolerable / riskFactor);
  const calculatedSampleSize = samplingInterval > 0 ? Math.ceil(populationValue / samplingInterval) : 0;

  // Preset benchmarks handler
  const handleBenchmarkPreset = (type: 'PBT' | 'Revenue' | 'TotalAssets' | 'GrossProfit' | 'Equity') => {
    setBenchmarkType(type);
    switch (type) {
      case 'PBT':
        setBenchmarkPercentage(5.0);
        break;
      case 'Revenue':
        setBenchmarkPercentage(1.0);
        break;
      case 'TotalAssets':
        setBenchmarkPercentage(0.5);
        break;
      case 'GrossProfit':
        setBenchmarkPercentage(2.0);
        break;
      case 'Equity':
        setBenchmarkPercentage(2.5);
        break;
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const generateMarkdownTable = () => {
    return `### Formal Audit Materiality Schedule (ISA 320 / PCAOB AS 2105)

| Materiality Level | Benchmark Metric | Rate Applied | Calculated Amount | Audit Scope Application |
| :--- | :--- | :---: | :--- | :--- |
| **Overall Materiality (OM)** | ${benchmarkType} (${formatCurrency(benchmarkAmount)}) | ${benchmarkPercentage.toFixed(1)}% | **${formatCurrency(overallMateriality)}** | Maximum acceptable aggregate misstatement on financial statements |
| **Performance Materiality (PM)** | Overall Materiality | ${performanceMaterialityPercentage}% | **${formatCurrency(performanceMateriality)}** | Working threshold for scoping accounts & substantive sample sizes |
| **Clearly Trivial Threshold (CTT / SUM)** | Overall Materiality | ${trivialThresholdPercentage}% | **${formatCurrency(clearlyTrivialThreshold)}** | Minimum threshold for posting to the Summary of Unadjusted Misstatements |

*Risk Classification: ${engagementRisk.toUpperCase()} | Entity Classification: ${clientType.toUpperCase()}*`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownTable());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-[#0F172A] text-white rounded-xl p-8 mb-8 border border-amber-900/20 shadow-md">
        <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono-num font-semibold uppercase tracking-wider mb-2">
          <Calculator className="w-4 h-4" />
          <span>Audit Technical Workbench</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
          Materiality & Audit Sampling Workbench
        </h1>
        <p className="text-slate-300 text-base max-w-3xl leading-relaxed">
          Interactive planning calculator compliant with <strong>ISA 320</strong>, <strong>ISA 530</strong>, and <strong>PCAOB AS 2105</strong>. Compute planning thresholds, determine MUS sample sizes, and insert audit working paper schedules directly into articles.
        </p>

        {/* Tab switch */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => setActiveTab('materiality')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
              activeTab === 'materiality'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>Audit Materiality Calculator</span>
          </button>
          <button
            onClick={() => setActiveTab('sampling')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
              activeTab === 'sampling'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Monetary Unit Sampling (MUS)</span>
          </button>
        </div>
      </div>

      {activeTab === 'materiality' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-xs">
              <h2 className="font-sans font-bold text-lg text-[#0F172A] mb-4 flex items-center justify-between">
                <span>1. Benchmark Selection & Parameters</span>
                <span className="text-xs font-mono-num text-slate-500 font-normal">ISA 320.A4</span>
              </h2>

              {/* Benchmark Type Presets */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Primary Financial Benchmark
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['PBT', 'Revenue', 'TotalAssets', 'GrossProfit', 'Equity'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => handleBenchmarkPreset(type)}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left transition-all ${
                        benchmarkType === type
                          ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold">{type === 'PBT' ? 'Profit Before Tax' : type === 'TotalAssets' ? 'Total Assets' : type === 'GrossProfit' ? 'Gross Profit' : type}</div>
                      <div className="text-[11px] text-slate-500 font-normal">
                        {type === 'PBT' ? 'Typical: 5% - 10%' : type === 'Revenue' ? 'Typical: 0.5% - 1%' : type === 'TotalAssets' ? 'Typical: 0.5% - 1%' : 'Typical: 1% - 2%'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Benchmark Financial Amount ($)
                  </label>
                  <input
                    type="number"
                    value={benchmarkAmount}
                    onChange={(e) => setBenchmarkAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono-num focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 font-medium"
                  />
                  <span className="text-[11px] text-slate-500 font-mono-num mt-1 block">
                    Formatted: {formatCurrency(benchmarkAmount)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Benchmark Applied Rate (%)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={benchmarkPercentage}
                      onChange={(e) => setBenchmarkPercentage(Number(e.target.value))}
                      className="flex-1 accent-amber-600"
                    />
                    <span className="w-14 font-mono-num font-bold text-sm text-right px-2 py-1 bg-slate-100 rounded">
                      {benchmarkPercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Engagement Risk & Entity Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Performance Materiality (PM) Rate
                  </label>
                  <div className="flex space-x-2">
                    {[50, 65, 75, 80].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setPerformanceMaterialityPercentage(rate)}
                        className={`flex-1 py-1.5 text-xs font-mono-num font-bold rounded border ${
                          performanceMaterialityPercentage === rate
                            ? 'bg-[#0F172A] text-white border-[#0F172A]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {performanceMaterialityPercentage <= 50 ? 'High Risk / Initial Year' : 'Recurring Audit / Strong Controls'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Clearly Trivial (CTT) Rate
                  </label>
                  <div className="flex space-x-2">
                    {[3, 5, 10].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setTrivialThresholdPercentage(rate)}
                        className={`flex-1 py-1.5 text-xs font-mono-num font-bold rounded border ${
                          trivialThresholdPercentage === rate
                            ? 'bg-[#0F172A] text-white border-[#0F172A]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Standard is 3% - 5% of Overall Materiality
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm">
              <h2 className="font-sans font-bold text-lg text-[#0F172A] mb-4">
                Calculated Audit Thresholds
              </h2>

              <div className="space-y-4">
                {/* OM */}
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-900 mb-1">
                    <span>OVERALL MATERIALITY (OM)</span>
                    <span className="font-mono-num">{benchmarkPercentage}% of {benchmarkType}</span>
                  </div>
                  <div className="font-editorial text-3xl font-bold text-amber-950 font-mono-num">
                    {formatCurrency(overallMateriality)}
                  </div>
                  <p className="text-xs text-amber-800/80 mt-1">
                    Misstatements exceeding this aggregate amount will result in a modified audit opinion.
                  </p>
                </div>

                {/* PM */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>PERFORMANCE MATERIALITY (PM)</span>
                    <span className="font-mono-num">{performanceMaterialityPercentage}% of OM</span>
                  </div>
                  <div className="font-editorial text-2xl font-bold text-slate-900 font-mono-num">
                    {formatCurrency(performanceMateriality)}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Threshold for account testing scope and aggregation risk buffer.
                  </p>
                </div>

                {/* CTT */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>CLEARLY TRIVIAL THRESHOLD (CTT / SUM)</span>
                    <span className="font-mono-num">{trivialThresholdPercentage}% of OM</span>
                  </div>
                  <div className="font-editorial text-xl font-bold text-slate-800 font-mono-num">
                    {formatCurrency(clearlyTrivialThreshold)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Errors below this amount are not recorded on the unadjusted error schedule.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCopyMarkdown}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Schedule' : 'Copy Markdown Table'}</span>
                </button>

                {onInsertIntoArticle && (
                  <button
                    onClick={() => onInsertIntoArticle(generateMarkdownTable())}
                    className="flex-1 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Insert into Draft</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Sampling Tab */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-xs space-y-5">
            <h2 className="font-sans font-bold text-lg text-[#0F172A] mb-2 flex items-center justify-between">
              <span>Monetary Unit Sampling (MUS) Calculator</span>
              <span className="text-xs font-mono-num text-slate-500 font-normal">ISA 530</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Total Population Book Value ($)
              </label>
              <input
                type="number"
                value={populationValue}
                onChange={(e) => setPopulationValue(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono-num font-medium text-slate-900"
              />
              <span className="text-[11px] text-slate-500 font-mono-num mt-1 block">
                {formatCurrency(populationValue)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tolerable Misstatement ($)
                </label>
                <input
                  type="number"
                  value={tolerableMisstatement}
                  onChange={(e) => setTolerableMisstatement(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono-num font-medium text-slate-900"
                />
                <span className="text-[11px] text-slate-500 font-mono-num mt-1 block">
                  Usually set to Performance Materiality ({formatCurrency(tolerableMisstatement)})
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Expected Misstatement ($)
                </label>
                <input
                  type="number"
                  value={expectedMisstatement}
                  onChange={(e) => setExpectedMisstatement(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono-num font-medium text-slate-900"
                />
                <span className="text-[11px] text-slate-500 font-mono-num mt-1 block">
                  Anticipated errors based on prior audits ({formatCurrency(expectedMisstatement)})
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Audit Confidence Level
              </label>
              <div className="flex space-x-3">
                {[95, 90, 80].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setConfidenceLevel(lvl)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border ${
                      confidenceLevel === lvl
                        ? 'bg-[#0F172A] text-white border-[#0F172A]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}% Confidence (Risk Factor {lvl === 95 ? '3.00' : lvl === 90 ? '2.31' : '1.61'})
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm space-y-5">
            <h2 className="font-sans font-bold text-lg text-[#0F172A]">
              Sampling Plan Outputs
            </h2>

            <div className="p-5 rounded-xl bg-amber-50/70 border border-amber-200 text-center">
              <div className="text-xs font-semibold text-amber-900 uppercase tracking-wider mb-1">
                Required Substantive Sample Size
              </div>
              <div className="font-editorial text-5xl font-bold text-amber-950 font-mono-num my-2">
                {calculatedSampleSize}
              </div>
              <div className="text-xs text-amber-800">
                Individual monetary units / sample items to test
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
                <span>Sampling Interval ($)</span>
                <span className="font-mono-num font-bold text-slate-900">{formatCurrency(samplingInterval)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
                <span>Risk of Incorrect Acceptance</span>
                <span className="font-mono-num font-bold text-slate-900">{100 - confidenceLevel}%</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-600">
                <span>Individually Significant Item Cutoff</span>
                <span className="font-mono-num font-bold text-amber-900">{formatCurrency(tolerableMisstatement)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic">
              *All items in the population with book value exceeding {formatCurrency(tolerableMisstatement)} must be tested 100% as key items outside the random sample.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
