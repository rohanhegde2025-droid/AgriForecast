export interface PredictRequest {
  region: string;
  soil_type: string;
  crop: string;
  rainfall_mm: number;
  temperature_celsius: number;
  fertilizer_used: boolean;
  irrigation_used: boolean;
  weather_condition: string;
  days_to_harvest: number;
}

export interface PredictResponse {
  yield_prediction: number;
  price_prediction: number;
  price_trend: string;
  advisory: string;
}

export async function predict(data: PredictRequest): Promise<PredictResponse> {
  const response = await fetch("http://localhost:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch prediction. The service might be unavailable.");
  }

  return response.json();
}

// Persists a prediction result to localStorage for historical tracking
export function saveToHistory(request: PredictRequest, response: PredictResponse) {
  if (typeof window === "undefined") return;

  const history = JSON.parse(localStorage.getItem("prediction_history") || "[]");
  const newEntry = {
    id: Date.now(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) + " IST",
    ...request,
    ...response,
    variety: "(Sarson)", // Default for now
    status: "verified"
  };

  localStorage.setItem("prediction_history", JSON.stringify([newEntry, ...history].slice(0, 50)));
}

// Retrieves all saved predictions from localStorage
export function getHistory() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("prediction_history") || "[]");
}
