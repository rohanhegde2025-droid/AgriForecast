"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PredictionForm } from "@/components/prediction-form";
import { PredictionResult } from "@/components/prediction-result";
import { predict, saveToHistory, PredictRequest, PredictResponse } from "@/lib/api";

export default function PredictPage() {
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [inputData, setInputData] = useState<PredictRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: PredictRequest) => {
    setIsLoading(true);
    setError(null);
    setInputData(data);

    try {
      const response = await predict(data);
      setResult(response);
      saveToHistory(data, response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prediction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPrediction = () => {
    setResult(null);
    setInputData(null);
    setError(null);
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-10 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-primary-900)] tracking-tight">
            {result ? "Prediction Results" : "New Prediction"}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {result
              ? "Review your crop yield and price forecast below."
              : "Enter your farm details to generate a yield and price prediction."
            }
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result ? (
          <PredictionResult
            data={result}
            inputData={inputData || undefined}
            onNewPrediction={handleNewPrediction}
          />
        ) : (
          <PredictionForm onSubmit={handleSubmit} isLoading={isLoading} />
        )}
      </div>
    </AppShell>
  );
}
