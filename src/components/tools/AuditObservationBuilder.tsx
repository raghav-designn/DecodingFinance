import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Check, 
  X, 
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { AuditFinding, SeverityLevel } from '../../types';

interface AuditObservationBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertFinding: (finding: AuditFinding, markdown: string) => void;
}

export const AuditObservationBuilder: React.FC<AuditObservationBuilderProps> = ({
  isOpen,
  onClose,
  onInsertFinding,
}) => {
  const [title, setTitle] = useState('Inadequate Segregation of Duties in Vendor Payment Approval Workflow');
  const [severity, setSeverity] = useState<SeverityLevel>('High');
  const [condition, setCondition] = useState('Sample testing of 40 disbursements identified that 8 payments totaling $1.2M were created and approved by the same accounts payable supervisor.');
  const [criteria, setCriteria] = useState('COSO Control Activity #10 and Company Financial Policy Section 4.2 mandate distinct individuals for invoice creation and payment authorization.');
  const [cause, setCause] = useState('System role assignments in the ERP were granted broad administrative privileges during system upgrades and never de-provisioned.');
  const [consequence, setConsequence] = useState('Elevated risk of unauthorized or fraudulent disbursements remaining undetected, resulting in potential direct financial loss and SOX 404 control deficiency.');
  const [recommendation, setRecommendation] = useState('Re-configure ERP workflow authorization matrix to enforce automated dual-approval for all payments > $25,000 and conduct quarterly access reviews.');
  const [managementResponse, setManagementResponse] = useState('Management agrees. Permissions updated on Aug 1st; automated workflow rule deployed.');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const finding: AuditFinding = {
    id: `finding-${Date.now()}`,
    title,
    severity,
    condition,
    criteria,
    cause,
    consequence,
    recommendation,
    managementResponse,
  };

  const generateMarkdown = () => {
    return `> ### Audit Observation: ${title}
> **Severity Rating:** **[${severity.toUpperCase()}]**
> 
> **1. Condition (What was found?):**  
> ${condition}
> 
> **2. Criteria (What standard/policy governs this?):**  
> ${criteria}
> 
> **3. Cause (Why did it happen?):**  
> ${cause}
> 
> **4. Consequence / Impact (What is the business risk?):**  
> ${consequence}
> 
> **5. Corrective Action & Recommendations:**  
> ${recommendation}
> 
> *Management Response:* ${managementResponse || 'Management concurs with recommendations.'}`;
  };

  const handleInsert = () => {
    onInsertFinding(finding, generateMarkdown());
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
              5C
            </div>
            <div>
              <h2 className="font-editorial text-lg font-bold text-white">
                5 Cs Audit Observation Builder
              </h2>
              <p className="text-xs text-slate-300">
                Condition • Criteria • Cause • Consequence • Corrective Action
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Title & Severity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Observation Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Inadequate Privileged Access Review in Cloud ERP"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Risk Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold bg-slate-50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900"
              >
                <option value="Critical">Critical (Board Level)</option>
                <option value="High">High Severity</option>
                <option value="Medium">Medium Severity</option>
                <option value="Low">Low / Operational</option>
              </select>
            </div>
          </div>

          {/* 1. Condition */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px] font-bold">1</span>
                <span>CONDITION (What was found during testing?)</span>
              </label>
              <span className="text-[11px] text-slate-400">Factual evidence & sample stats</span>
            </div>
            <textarea
              rows={2}
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs leading-relaxed focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
            />
          </div>

          {/* 2. Criteria */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px] font-bold">2</span>
                <span>CRITERIA (What standard or policy is breached?)</span>
              </label>
              <span className="text-[11px] text-slate-400">e.g. ISA 315, COSO #10, SOX 404, Policy</span>
            </div>
            <textarea
              rows={2}
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs leading-relaxed focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
            />
          </div>

          {/* 3. Cause */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px] font-bold">3</span>
                <span>CAUSE (Why did the control failure occur?)</span>
              </label>
              <span className="text-[11px] text-slate-400">Root-cause inquiry</span>
            </div>
            <textarea
              rows={2}
              value={cause}
              onChange={(e) => setCause(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs leading-relaxed focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
            />
          </div>

          {/* 4. Consequence */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px] font-bold">4</span>
                <span>CONSEQUENCE / IMPACT (Financial & Compliance Risk)</span>
              </label>
              <span className="text-[11px] text-slate-400">Exposure in $ or regulatory penalty</span>
            </div>
            <textarea
              rows={2}
              value={consequence}
              onChange={(e) => setConsequence(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs leading-relaxed focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
            />
          </div>

          {/* 5. Corrective Action */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px] font-bold">5</span>
                <span>CORRECTIVE ACTION & RECOMMENDATIONS</span>
              </label>
              <span className="text-[11px] text-slate-400">Actionable remediation steps</span>
            </div>
            <textarea
              rows={2}
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs leading-relaxed focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
            />
          </div>

          {/* Management Response */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Management Response & Target Date
            </label>
            <input
              type="text"
              value={managementResponse}
              onChange={(e) => setManagementResponse(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors flex items-center space-x-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Memo'}</span>
          </button>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-600 hover:text-slate-800 py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleInsert}
              className="bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold py-2 px-5 rounded-lg shadow-xs transition-colors flex items-center space-x-1.5"
            >
              <FileCheck className="w-4 h-4" />
              <span>Insert 5 Cs Finding into Article</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
