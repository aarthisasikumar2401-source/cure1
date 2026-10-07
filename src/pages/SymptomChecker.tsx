import React, { useState } from 'react';
import {
  Stethoscope,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Info,
  HelpCircle,
  PhoneCall,
  Search,
} from 'lucide-react';
import { symptomService, SymptomAnalysisResult } from '../services/symptomService';

interface SymptomCheckerProps {
  onNavigateToResources: () => void;
}

const SAMPLE_PROMPTS = [
  {
    label: 'Mild headache & fatigue for 2 days',
    text: 'I have had a mild dull headache and felt slightly fatigued for the past two days, with no fever.',
  },
  {
    label: 'Sore throat & cough',
    text: 'Scratchy sore throat, dry cough, and mild nasal congestion starting yesterday.',
  },
  {
    label: 'Knee joint pain after walking',
    text: 'Aching pain and stiffness in right knee after long walks, no swelling or redness.',
  },
  {
    label: 'Emergency Test: Chest pain & breathing trouble',
    text: 'Severe chest pain radiating to left arm and sudden shortness of breath.',
  },
];

export const SymptomChecker: React.FC<SymptomCheckerProps> = ({ onNavigateToResources }) => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<SymptomAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = (textToAnalyze?: string) => {
    const text = textToAnalyze !== undefined ? textToAnalyze : inputText;
    if (!text.trim()) return;

    setAnalyzing(true);
    // Simulate instantaneous local deterministic evaluation with smooth settle
    setTimeout(() => {
      const res = symptomService.analyze(text);
      setResult(res);
      setAnalyzing(false);
    }, 200);
  };

  const handleSelectSample = (sample: string) => {
    setInputText(sample);
    handleAnalyze(sample);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
          <span>Deterministic Clinical Triaging</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Explainable Health Guidance
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Describe any symptoms or physical sensations in plain words. CureLink analyzes your input
          against clinical protocols to provide explainable next-step recommendations and screening for
          urgent red flags.
        </p>
      </div>

      {/* Crucial Educational & Safety Disclaimer */}
      <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-2xl flex items-start gap-3 text-xs text-teal-900">
        <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-teal-950">Educational Support Boundary:</span>
          <p className="leading-relaxed text-teal-900/90">
            This tool provides supportive healthcare navigation and general guidance. It does{' '}
            <strong>NOT diagnose diseases</strong>, <strong>prescribe medication</strong>, or{' '}
            <strong>provide medication dosage instructions</strong>. If you feel you are having a
            medical emergency, call local emergency services immediately.
          </p>
        </div>
      </div>

      {/* Input Box Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
        <label className="block text-sm font-semibold text-slate-800">
          What symptoms are you experiencing?
        </label>

        <div className="relative">
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe what you feel (e.g. 'I woke up with a sharp throbbing headache and light sensitivity', 'Mild dry cough for 3 days', 'Severe chest tightness')..."
            className="w-full p-4 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-slate-50/40 text-slate-900 resize-none leading-relaxed"
          />
        </div>

        {/* Quick Sample Prompts */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-500">Quick Test Scenarios:</span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample.text)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                  idx === 3
                    ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              setInputText('');
              setResult(null);
            }}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleAnalyze()}
            disabled={!inputText.trim() || analyzing}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-sm font-semibold transition-colors shadow-2xs cursor-pointer disabled:cursor-not-allowed"
          >
            <Stethoscope className="w-4 h-4" />
            <span>{analyzing ? 'Evaluating Factors...' : 'Analyze Symptoms'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Output Section */}
      {result && (
        <div className="space-y-6 pt-2">
          {/* Urgency Status Banner */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              result.urgency === 'urgent'
                ? 'bg-rose-50 border-rose-300 text-rose-950 shadow-xs ring-2 ring-rose-500/20'
                : result.urgency === 'soon'
                ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-xs'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  result.urgency === 'urgent'
                    ? 'bg-rose-600 text-white'
                    : result.urgency === 'soon'
                    ? 'bg-amber-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {result.urgency === 'urgent' ? (
                  <Flame className="w-6 h-6 animate-pulse" />
                ) : result.urgency === 'soon' ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <CheckCircle2 className="w-6 h-6" />
                )}
              </div>

              <div className="space-y-1 flex-1">
                <span className="text-xs uppercase font-bold tracking-wider opacity-80">
                  Evaluated Triage Level
                </span>
                <h3 className="text-lg font-bold">{result.urgencyLabel}</h3>
                <p className="text-sm font-medium leading-relaxed opacity-95 pt-1">
                  {result.assessmentSummary}
                </p>
              </div>
            </div>

            {result.detectedEmergency && (
              <div className="mt-4 pt-4 border-t border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-rose-900 font-semibold flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-rose-700 shrink-0" />
                  <span>Call Emergency Dispatch (911) or go to the nearest Emergency Room.</span>
                </div>
                <button
                  onClick={onNavigateToResources}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs shrink-0"
                >
                  Find Emergency Hospitals
                </button>
              </div>
            )}
          </div>

          {/* Explainability Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Detected Factors */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-slate-800">
                <Search className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-semibold">Detected Factors</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {result.keyFactors.map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Why This Guidance? */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-slate-800">
                <HelpCircle className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-semibold">Why This Guidance?</h3>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                {result.whyThisGuidance}
              </p>
              <div className="pt-1">
                <span className="text-[11px] text-slate-400">
                  Evaluated via deterministic rule hierarchy based on clinical emergency markers.
                </span>
              </div>
            </div>

            {/* 3. Recommended Next Steps */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-semibold">Recommended Next Steps</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {result.recommendedActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-teal-600 font-bold shrink-0">{idx + 1}.</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Warning Signs / Red Flags */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-slate-800">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-semibold">Warning Signs to Watch For</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {result.redFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-rose-50/50 p-2.5 rounded-lg border border-rose-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* When to Seek Care Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800">
                <Clock className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-semibold">When to Seek In-Person Clinical Care</h3>
              </div>
              <button
                onClick={onNavigateToResources}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
              >
                <span>Find local clinic</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-2">
              {result.whenToSeekCare.map((item, idx) => (
                <p key={idx} className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {item}
                </p>
              ))}
            </div>
          </div>

          {/* Disclaimer Footer */}
          <div className="p-4 bg-slate-100/70 border border-slate-200 rounded-2xl text-[11px] text-slate-500 leading-relaxed text-center">
            {result.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
};
