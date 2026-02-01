import React from 'react';
import { RefreshCcw, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import RiskGauge from './RiskGauge';

interface ResultsData {
  prediction_score: number;
  sii_index: number;
  risk_level: string;
  description: string;
  stress_factor: number;
  detailed_metrics?: any;
}

interface Props {
  data: ResultsData;
  onReset: () => void;
}

export default function ResultsDashboard({ data, onReset }: Props) {
  const isHighRisk = data.sii_index >= 2;
  const isHealthy = data.sii_index === 0;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className={`p-6 text-center ${isHighRisk ? 'bg-rose-50' : isHealthy ? 'bg-emerald-50' : 'bg-slate-50'}`}>
          <h2 className="text-gray-500 font-medium uppercase tracking-wider text-sm mb-4">
            Analysis Complete
          </h2>
          <RiskGauge score={data.prediction_score} level={data.risk_level} />
          
          <p className="max-w-md mx-auto text-gray-600 mt-4 leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Breakdown Section */}
        <div className="p-8 space-y-6">
          <h3 className="font-bold text-gray-800 text-lg flex items-center">
            <Activity className="w-5 h-5 mr-2 text-teal-600" />
            Why this score?
          </h3>

          <div className="grid gap-4">
             {/* Stress Factor */}
             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
               <div className="flex items-center">
                 <div className={`w-3 h-3 rounded-full mr-3 ${data.stress_factor > 0.6 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                 <span className="text-gray-700 font-medium">Stress & Vital Signs</span>
               </div>
               <span className="font-bold text-gray-900">
                 {(data.stress_factor * 100).toFixed(0)}%
               </span>
             </div>
             
             {/* Recommendation Cards based on Risk */}
             {isHighRisk && (
               <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 shrink-0" />
                  <div>
                    <h4 className="font-bold text-amber-800 text-sm">Action Recommended</h4>
                    <p className="text-amber-700 text-sm mt-1">
                      Your vitals indicate high stress levels linked to digital habits. Consider reducing screen time by 2 hours/day.
                    </p>
                  </div>
               </div>
             )}

             {isHealthy && (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 mr-3 shrink-0" />
                  <div>
                    <h4 className="font-bold text-emerald-800 text-sm">Doing Great!</h4>
                    <p className="text-emerald-700 text-sm mt-1">
                      Your digital habits seem balanced. Keep maintaining your current routine.
                    </p>
                  </div>
               </div>
             )}
          </div>

          <button
            onClick={onReset}
            className="w-full flex items-center justify-center p-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors mt-8"
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            Check Another Profile
          </button>
        </div>
      </div>
    </div>
  );
}