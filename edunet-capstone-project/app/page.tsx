"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import PersonaSelector from "./components/PersonaSelector";
import AssessmentForm from "./components/AssessmentForm";
import ResultsDashboard from "./components/ResultsDashboard";
import { ArrowLeft } from "lucide-react";

type Step = 'selection' | 'assessment' | 'loading' | 'results';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('selection');
  const [formData, setFormData] = useState<any>(null);
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePersonaSelect = (data: any) => {
    setFormData(data);
    setCurrentStep('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCustomStart = () => {
    setFormData(null); // Reset to defaults in Form
    setCurrentStep('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (currentStep === 'results') {
      setCurrentStep('selection');
      setFormData(null);
      setResults(null);
    } else if (currentStep === 'assessment') {
      setCurrentStep('selection');
    }
  };

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);

    // Calculate BMI
    const bmi = parseFloat((data.weight / ((data.height / 100) ** 2)).toFixed(2));

    // Construct the payload expected by the API
    const payload = {
      features: {
        "Basic_Demos-Age": data.age,
        "Basic_Demos-Sex": data.sex,
        "PreInt_EduHx-computerinternet_hoursday": data.hours,
        "Physical-Height": data.height,
        "Physical-Weight": data.weight,
        "Physical-BMI": bmi,
        "Physical-HeartRate": data.hr,
        "Physical-Systolic_BP": data.systolic,
        "Physical-Diastolic_BP": data.diastolic,
        "SDS-SDS_Total_Raw": data.sds || 40, 
        "PAQ_C-PAQ_C_Total": data.paq || 2.5,
        "CGAS-CGAS_Score": data.cgas || 75
      }
    };

    try {
      // Use environment variable for API URL or fallback to localhost
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch prediction");
      }

      const resultData = await response.json();
      setResults(resultData);
      setCurrentStep('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the analysis engine. Please ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-teal-100 flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 flex-grow flex flex-col justify-center pt-24 pb-12">
        
        {/* Back Button */}
        {currentStep !== 'selection' && (
          <button 
            onClick={handleBack}
            className="mb-6 flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        )}

        {/* Error Banner */}
        {error && (
          <div className="bg-rose-100 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg mb-6 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Views */}
        {currentStep === 'selection' && (
          <PersonaSelector 
            onSelect={handlePersonaSelect} 
            onCustom={handleCustomStart} 
          />
        )}

        {currentStep === 'assessment' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Health Assessment</h2>
              <p className="text-gray-500">Adjust the values below to match the profile.</p>
            </div>
            <AssessmentForm 
              initialData={formData} 
              onSubmit={handleSubmit} 
              isLoading={isLoading} 
            />
          </div>
        )}

        {currentStep === 'results' && results && (
          <div className="animate-in zoom-in-95 duration-500">
             <ResultsDashboard 
               data={results} 
               onReset={() => {
                 setCurrentStep('selection');
                 setFormData(null);
                 setResults(null);
               }} 
             />
          </div>
        )}

      </main>
    </div>
  );
}
