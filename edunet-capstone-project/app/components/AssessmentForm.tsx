import React, { useState, useEffect } from 'react';
import { ChevronRight, Activity, Clock, User, Ruler, Moon, Heart, Users } from 'lucide-react';

interface AssessmentData {
  age: number;
  sex: number;
  hours: number;
  height: number;
  weight: number;
  hr: number;
  systolic: number;
  diastolic: number;
  sds: number;
  paq: number;
  cgas: number;
}

interface Props {
  initialData?: AssessmentData;
  onSubmit: (data: AssessmentData) => void;
  isLoading: boolean;
}

export default function AssessmentForm({ initialData, onSubmit, isLoading }: Props) {
  const [mode, setMode] = useState<'hybrid' | 'manual'>('hybrid');
  const [stressLevel, setStressLevel] = useState(5); // 1-10

  // Standard ranges for calculations
  // CGAS: High=Good, Low=Bad. Range 0-100?
  // PAQ: 1 (Low) to 5 (High).
  // SDS: High=Bad (Insomnia), Low=Good. Range 20-90.

  const [formData, setFormData] = useState<AssessmentData>({
    age: 15,
    sex: 0, 
    hours: 4,
    height: 165,
    weight: 60,
    hr: 75,
    systolic: 120,
    diastolic: 80,
    sds: 40,
    paq: 2.5,
    cgas: 75,
    ...initialData
  });

  // Calculate BMI for display
  const bmi = (formData.weight / ((formData.height / 100) ** 2)).toFixed(1);

  // Helper mappings for Sliders
  // CGAS (Social): 4 steps. 
  // 1=Withdrawn(50), 2=Struggling(65), 3=Okay(80), 4=Excellent(95)
  const getCgasStep = (val: number) => {
    if (val >= 90) return 4;
    if (val >= 75) return 3;
    if (val >= 60) return 2;
    return 1;
  };
  const cgasFromStep = (step: number) => {
    if (step === 4) return 95;
    if (step === 3) return 80;
    if (step === 2) return 65;
    return 50;
  };

  // PAQ (Physical): 3 steps.
  // 1=Sedentary(1.5), 2=Moderate(3.0), 3=Active(4.5)
  const getPaqStep = (val: number) => {
      if (val >= 4) return 3;
      if (val >= 2.5) return 2;
      return 1;
  };
  const paqFromStep = (step: number) => {
      if (step === 3) return 4.5;
      if (step === 2) return 3.0;
      return 1.5;
  };

  // SDS (Sleep): 3 steps (Backend expects raw number ~20-90)
  // 1=Good Sleep(30), 2=Average(50), 3=Poor Sleep(70)
  const getSdsStep = (val: number) => {
      if (val >= 65) return 3;
      if (val >= 45) return 2;
      return 1;
  };
  const sdsFromStep = (step: number) => {
      if (step === 3) return 70; // Poor
      if (step === 2) return 50; // Average
      return 30; // Good
  };

  // Hybrid Approach: Estimate Vitals based on Stress used if in hybrid mode
  useEffect(() => {
    if (mode === 'hybrid') {
      const newHr = Math.round(60 + (stressLevel * 3.5));
      const newSys = Math.round(105 + (stressLevel * 3));
      const newDia = Math.round(65 + (stressLevel * 2));
      
      setFormData(prev => ({
        ...prev,
        hr: newHr,
        systolic: newSys,
        diastolic: newDia
      }));
    }
  }, [stressLevel, mode]);

  const handleChange = (field: keyof AssessmentData, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8 space-y-8">
          
          {/* Section 1: Demographics */}
          <div className="space-y-4">
            <h3 className="flex items-center text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
              <User className="w-5 h-5 mr-2 text-teal-500" />
              Basics
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm font-medium text-gray-500 mb-1">Age</label>
                 <input 
                    type="range" min="8" max="19" step="1"
                    value={formData.age}
                    onChange={(e) => handleChange('age', parseInt(e.target.value))}
                    className="w-full accent-teal-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                 />
                 <div className="text-right font-bold text-gray-900 mt-1">{formData.age} years</div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-500 mb-2">Sex</label>
                 <div className="flex bg-gray-100 rounded-lg p-1">
                   <button
                     onClick={() => handleChange('sex', 0)}
                     className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${formData.sex === 0 ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                   >
                     Female
                   </button>
                   <button
                     onClick={() => handleChange('sex', 1)}
                     className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${formData.sex === 1 ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                   >
                     Male
                   </button>
                 </div>
               </div>
            </div>
          </div>

          {/* Section 2: Lifestyle */}
          <div className="space-y-4">
             <h3 className="flex items-center text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
              <Clock className="w-5 h-5 mr-2 text-indigo-500" />
              Digital & Physical Habits
            </h3>
            
            {/* Screen Time */}
            <div>
               <label className="block text-sm font-medium text-gray-500 mb-1">Daily Screen Time (Hours)</label>
               <input 
                  type="range" min="0" max="24" step="1"
                  value={formData.hours}
                  onChange={(e) => handleChange('hours', parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
               />
               <div className="flex justify-between items-center mt-2">
                 <span className="text-xs text-gray-400">Low (0h)</span>
                 <span className="font-bold text-indigo-600 text-lg">{formData.hours} hrs</span>
                 <span className="text-xs text-gray-400">Extreme (24h)</span>
               </div>
            </div>

            {/* Physical Activity (PAQ) - 3 STEPS */}
            <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Physical Activity</label>
                <input 
                  type="range" min="1" max="3" step="1"
                  value={getPaqStep(formData.paq)}
                  onChange={(e) => handleChange('paq', paqFromStep(parseInt(e.target.value)))}
                  className="w-full accent-emerald-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-xs ${getPaqStep(formData.paq) === 1 ? 'font-bold text-emerald-600' : 'text-gray-400'}`}>Sedentary</span>
                  <span className={`text-xs ${getPaqStep(formData.paq) === 2 ? 'font-bold text-emerald-600' : 'text-gray-400'}`}>Moderate</span>
                  <span className={`text-xs ${getPaqStep(formData.paq) === 3 ? 'font-bold text-emerald-600' : 'text-gray-400'}`}>Active</span>
                </div>
            </div>
            
             {/* Sleep Quality (SDS) - 3 STEPS */}
            <div>
               <label className="block text-sm font-medium text-gray-500 mb-1">Sleep Quality</label>
               <input 
                  type="range" min="1" max="3" step="1"
                  value={getSdsStep(formData.sds)}
                  onChange={(e) => handleChange('sds', sdsFromStep(parseInt(e.target.value)))}
                  className="w-full accent-purple-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
               />
               <div className="flex justify-between items-center mt-2">
                 <span className={`text-xs ${getSdsStep(formData.sds) === 1 ? 'font-bold text-purple-600' : 'text-gray-400'}`}>Good Sleep</span>
                 <span className={`text-xs ${getSdsStep(formData.sds) === 2 ? 'font-bold text-purple-600' : 'text-gray-400'}`}>Average</span>
                 <span className={`text-xs ${getSdsStep(formData.sds) === 3 ? 'font-bold text-purple-600' : 'text-gray-400'}`}>Troubled/Insomnia</span>
               </div>
            </div>
          </div>

          {/* Section 3: Social & Mental */}
          <div className="space-y-4">
            <h3 className="flex items-center text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Social Behavior
            </h3>

             {/* Social Behavior (CGAS) - 4 STEPS */}
             <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">How social do you feel lately?</label>
                <input 
                  type="range" min="1" max="4" step="1"
                  value={getCgasStep(formData.cgas)} 
                  onChange={(e) => handleChange('cgas', cgasFromStep(parseInt(e.target.value)))}
                  className="w-full accent-blue-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                
                <div className="grid grid-cols-4 text-center mt-2">
                    <span className={`text-xs ${getCgasStep(formData.cgas) === 1 ? 'font-bold text-rose-500' : 'text-gray-400'}`}>
                        Withdrawn
                    </span>
                     <span className={`text-xs ${getCgasStep(formData.cgas) === 2 ? 'font-bold text-amber-500' : 'text-gray-400'}`}>
                        Struggling
                    </span>
                     <span className={`text-xs ${getCgasStep(formData.cgas) === 3 ? 'font-bold text-teal-500' : 'text-gray-400'}`}>
                        Okay
                    </span>
                     <span className={`text-xs ${getCgasStep(formData.cgas) === 4 ? 'font-bold text-emerald-500' : 'text-gray-400'}`}>
                        Super Social
                    </span>
                </div>
                
                <p className="text-xs text-gray-400 mt-2 italic text-center">
                  * Evaluates ability to interact with peers and participate in group activities.
                </p>
             </div>
          </div>

          {/* Section 4: Vitals (Hybrid Approach) */}
          <div className="space-y-4">
             <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="flex items-center text-lg font-bold text-gray-900">
                  <Heart className="w-5 h-5 mr-2 text-rose-500" />
                  Heart & Stress
                </h3>
                
                {/* Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                   <button
                     onClick={() => setMode('hybrid')}
                     className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mode === 'hybrid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                   >
                     Checkup Mode
                   </button>
                   <button
                     onClick={() => setMode('manual')}
                     className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mode === 'manual' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                   >
                     Manual Input
                   </button>
                </div>
             </div>
            
             {mode === 'hybrid' ? (
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6">
                  <label className="block text-sm font-medium text-rose-800 mb-3">
                     How anxious or stressed do you feel right now?
                  </label>
                  <input 
                      type="range" min="1" max="10" step="1"
                      value={stressLevel}
                      onChange={(e) => setStressLevel(parseInt(e.target.value))}
                      className="w-full accent-rose-500 h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer"
                   />
                   <div className="flex justify-between items-center mt-3">
                     <span className="text-xs text-rose-400">Calm & Relaxed</span>
                     <span className="font-bold text-rose-700 text-lg">Level {stressLevel}</span>
                     <span className="text-xs text-rose-400">Highly Stressed</span>
                   </div>
                   
                   <div className="mt-6 grid grid-cols-2 gap-4 text-center border-t border-rose-100 pt-4">
                      <div>
                        <div className="text-xs uppercase text-rose-400 font-bold">Est. Heart Rate</div>
                        <div className="text-xl font-mono font-bold text-rose-600">{formData.hr} <span className="text-sm">bpm</span></div>
                      </div>
                      <div>
                        <div className="text-xs uppercase text-rose-400 font-bold">Est. BP</div>
                        <div className="text-xl font-mono font-bold text-rose-600">{formData.systolic}/{formData.diastolic}</div>
                      </div>
                   </div>
                   <p className="text-center text-xs text-rose-400 mt-2">
                     * These values are estimated based on your stress level. Switch to Manual Input if you know your exact numbers.
                   </p>
                </div>
             ) : (
                <div className="grid grid-cols-2 gap-6 animate-in fade-in">
                   <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Heart Rate (BPM)</label>
                         <input 
                          type="number" 
                          value={formData.hr}
                          onChange={(e) => handleChange('hr', parseInt(e.target.value))}
                          className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                        />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Blood Pressure</label>
                        <div className="flex space-x-2 mt-1">
                          <input 
                            placeholder="Sys"
                            type="number" 
                            value={formData.systolic}
                            onChange={(e) => handleChange('systolic', parseInt(e.target.value))}
                            className="w-1/2 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-center"
                          />
                          <input 
                            placeholder="Dia"
                            type="number" 
                            value={formData.diastolic}
                            onChange={(e) => handleChange('diastolic', parseInt(e.target.value))}
                            className="w-1/2 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-center"
                          />
                        </div>
                      </div>
                   </div>
                </div>
             )}
            
             <div className="grid grid-cols-2 gap-6 pt-2">
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Height (cm)</label>
                    <input 
                      type="number" 
                      value={formData.height}
                      onChange={(e) => handleChange('height', parseInt(e.target.value))}
                      className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Weight (kg)</label>
                    <input 
                      type="number" 
                      value={formData.weight}
                      onChange={(e) => handleChange('weight', parseInt(e.target.value))}
                      className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    />
                  </div>
            </div>
          </div>

          <button
            onClick={() => onSubmit(formData)}
            disabled={isLoading}
            className="w-full py-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
          >
            {isLoading ? (
               <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Analyze Health Score
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
           
          </button>

        </div>
      </div>
    </div>
  );
}