"use client";
import { useState } from "react";

// Define TypeScript interfaces for state and API interaction
interface FeaturePayload {
  features: {
    "Basic_Demos-Age": number;
    "Basic_Demos-Sex": number;
    "PreInt_EduHx-computerinternet_hoursday": number;
    "Physical-Height": number;
    "Physical-Weight": number;
    "Physical-BMI": number;
    "Physical-HeartRate": number;
    "SDS-SDS_Total_Raw": number;
    "PAQ_C-PAQ_C_Total": number;
    "CGAS-CGAS_Score": number;
    "Physical-Systolic_BP": number;
    "Physical-Diastolic_BP": number;
  };
}

interface PredictionResult {
  prediction_score: number;
  sii_index: number;
  risk_level: string;
  description: string;
  detailed_metrics: {
    hours_per_day: number | string;
    bmi: number | string;
    physical_activity: string;
    functioning_score: number | string;
  };
}

interface ValidationErrors {
  age?: string;
  hours?: string;
  height?: string;
  weight?: string;
  hr?: string;
  bp?: string;
}

export default function Home() {
  const [age, setAge] = useState<number>(10);
  const [sex, setSex] = useState<number>(0); // 0: Female, 1: Male
  const [hours, setHours] = useState<number>(2);
  const [height, setHeight] = useState<number>(150); // cm
  const [weight, setWeight] = useState<number>(45); // kg
  
  // New State Variables for Important Features
  const [hr, setHr] = useState<number>(80); // Heart Rate
  const [sleepScore, setSleepScore] = useState<number>(40); // SDS Score
  const [activityScore, setActivityScore] = useState<number>(2.5); // PAQ Score
  
  // New V2 Features
  const [systolic, setSystolic] = useState<number>(110);
  const [diastolic, setDiastolic] = useState<number>(70);
  const [functioningImp, setFunctioningImp] = useState<number>(90); // CGAS Proxy

  // Calculate BMI derived from height and weight
  const bmi = (weight / ((height / 100) ** 2)).toFixed(2);
  
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validateInputs = (): boolean => {
    const errors: ValidationErrors = {};
    if (age < 5 || age > 99) errors.age = "Age must be between 5 and 99";
    if (hours < 0 || hours > 24) errors.hours = "Hours must be between 0 and 24";
    if (height < 50 || height > 250) errors.height = "Height must be between 50cm and 250cm";
    if (weight < 10 || weight > 300) errors.weight = "Weight must be between 10kg and 300kg";
    if (hr < 30 || hr > 200) errors.hr = "Heart Rate must be reasonable (30-200)";
    if (systolic < 70 || systolic > 200) errors.bp = "Systemic BP invalid";
    if (diastolic < 40 || diastolic > 130) errors.bp = "Diastolic BP invalid";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;
    
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload: FeaturePayload = {
        features: {
          "Basic_Demos-Age": Number(age),
          "Basic_Demos-Sex": Number(sex),
          "PreInt_EduHx-computerinternet_hoursday": Number(hours),
          "Physical-Height": Number(height),
          "Physical-Weight": Number(weight),
          "Physical-BMI": Number(bmi),
          "Physical-HeartRate": Number(hr),
          "SDS-SDS_Total_Raw": Number(sleepScore),
          "PAQ_C-PAQ_C_Total": Number(activityScore),
          "CGAS-CGAS_Score": Number(functioningImp),
          "Physical-Systolic_BP": Number(systolic),
          "Physical-Diastolic_BP": Number(diastolic),
        }
      };


      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Prediction failed");
      }

      const data: PredictionResult = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Model Prediction
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter features to get a prediction.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${validationErrors.age ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                required
              />
              {validationErrors.age && <p className="text-red-500 text-xs italic">{validationErrors.age}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Sex (0=F, 1=M)
              </label>
              <select
                value={sex}
                onChange={(e) => setSex(Number(e.target.value))}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option value={0}>Female</option>
                <option value={1}>Male</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Daily Internet Use (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${validationErrors.hours ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                required
              />
              {validationErrors.hours && <p className="text-red-500 text-xs italic">{validationErrors.hours}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Height (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${validationErrors.height ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                required
              />
              {validationErrors.height && <p className="text-red-500 text-xs italic">{validationErrors.height}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${validationErrors.weight ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                required
              />
              {validationErrors.weight && <p className="text-red-500 text-xs italic">{validationErrors.weight}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                BMI (Calculated)
              </label>
              <input
                type="text"
                value={bmi}
                readOnly
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-900 rounded-b-md sm:text-sm"
              />
            </div>
            
            <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Health Vitals</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Pulse / Heart Rate
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                     <button type="button" onClick={() => setHr(60)} className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 rounded text-green-800">Athletic (60)</button>
                     <button type="button" onClick={() => setHr(80)} className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 rounded text-blue-800">Average (80)</button>
                     <button type="button" onClick={() => setHr(100)} className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 rounded text-red-800">Anxious/High (100)</button>
                  </div>
                  <input
                    type="number"
                    value={hr}
                    onChange={(e) => setHr(Number(e.target.value))}
                    className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.hr ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Avg 60-100"
                  />
                  {validationErrors.hr && <p className="text-red-500 text-xs italic">{validationErrors.hr}</p>}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Sleep Quality
                  </label>
                  <select
                    value={sleepScore}
                    onChange={(e) => setSleepScore(Number(e.target.value))}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value={30}>Good (No issues)</option>
                    <option value={45}>Fair (Some difficulty)</option>
                    <option value={60}>Poor (Frequent wake ups)</option>
                    <option value={75}>Severe (Insomnia/Disruption)</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Physical Activity Level
                  </label>
                  <select
                    value={activityScore}
                    onChange={(e) => setActivityScore(Number(e.target.value))}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value={1.5}>Low (Sedentary)</option>
                    <option value={2.5}>Moderate (Occasional)</option>
                    <option value={3.5}>High (Active/Athlete)</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Social Behavior & Interactions
                  </label>
                  <select
                    value={functioningImp}
                    onChange={(e) => setFunctioningImp(Number(e.target.value))}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value={90}>Active social life (Friends/Family)</option>
                    <option value={70}>Occasional withdrawal (Prefer online)</option>
                    <option value={50}>Frequent isolation (Avoiding events)</option>
                    <option value={30}>Complete withdrawal (No offline friends)</option>
                  </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Pressure Estimates
                    </label>
                    <div className="flex space-x-2 mb-2">
                     <button type="button" onClick={() => {setSystolic(110); setDiastolic(70);}} className="flex-1 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 rounded text-blue-800">Normal / Unknown</button>
                     <button type="button" onClick={() => {setSystolic(135); setDiastolic(90);}} className="flex-1 px-2 py-1 text-xs bg-red-100 hover:bg-red-200 rounded text-red-800">High BP History</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500">Systolic</label>
                      <input
                        type="number"
                        value={systolic}
                        onChange={(e) => setSystolic(Number(e.target.value))}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Diastolic</label>
                      <input
                        type="number"
                        value={diastolic}
                        onChange={(e) => setDiastolic(Number(e.target.value))}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                {validationErrors.bp && <p className="text-red-500 text-xs italic">{validationErrors.bp}</p>}

            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "Predict"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
            Error: {error}
          </div>
        )}

        {result && (
          <div className={`mt-6 p-4 rounded-md border ${
            result.sii_index === 0 ? "bg-green-50 border-green-200 text-green-900" :
            result.sii_index === 1 ? "bg-yellow-50 border-yellow-200 text-yellow-900" :
            "bg-red-50 border-red-200 text-red-900"
          }`}>
            <h3 className="text-xl font-bold">Prediction Result: {result.risk_level} Risk</h3>
            <p className="mt-2 text-md">
              {result.description}
            </p>
            
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
                <div>
                   <span className="font-semibold">Prediction Score:</span> {result.prediction_score.toFixed(2)}
                </div>
                <div>
                   <span className="font-semibold">SII Index:</span> {result.sii_index}
                </div>
                <div>
                   <span className="font-semibold">Reported Hours:</span> {result.detailed_metrics.hours_per_day}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
