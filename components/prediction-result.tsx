import { PredictResponse, PredictRequest } from "@/lib/api";
import Image from "next/image";
import { TrendingUp, Award, Download, ArrowRight, Activity, Thermometer, Calendar } from "lucide-react";

interface PredictionResultProps {
  data: PredictResponse;
  inputData?: PredictRequest; // Used to show metadata section
  onNewPrediction: () => void;
}

export function PredictionResult({ data, inputData, onNewPrediction }: PredictionResultProps) {
  // Mock Confidence Score
  const confidence = "94%";
  
  return (
    <div className="space-y-6 w-full max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="badge bg-[#DAE6DF] text-[var(--color-primary-900)] mb-3">FORECAST GENERATED: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <h2 className="text-3xl font-bold text-[var(--color-text-main)] tracking-tight text-balance">
            Prediction Results: {inputData ? `${inputData.crop} Harvest` : 'Harvest'} {new Date().getFullYear()} {inputData?.region ? `(${inputData.region} Region)` : ''}
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-2 max-w-2xl leading-relaxed">
            Analysis based on current soil moisture levels, IMD 14-day weather patterns, and regional satellite imagery of the Indo-Gangetic Plain.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_0.7fr] gap-6">
        
        {/* Yield Card with background */}
        <div className="relative rounded-xl overflow-hidden shadow-sm h-64 border border-[#EBEBEB]">
          <Image 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80" 
            alt="Wheat field" fill className="object-cover opacity-15" unoptimized 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDFCF8] via-[#FDFCF8]/90 to-transparent" />
          <div className="absolute inset-0 border-l-4 border-[var(--color-primary-900)]" />
          
          <div className="relative z-10 p-8 flex flex-col h-full justify-between">
            <div>
              <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">PREDICTED YIELD</p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold text-[var(--color-primary-900)] tracking-tighter">{data.yield_prediction.toFixed(1)}</span>
                <span className="text-sm font-medium text-[var(--color-text-muted)]">Quintals / Acre</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1 font-medium"><TrendingUp className="w-3 h-3 text-[var(--color-primary-900)]"/> +8.2% vs Punjab Avg.</span>
              <span className="italic">Confidence Level: {confidence}</span>
            </div>
          </div>
        </div>

        {/* Price Card with background */}
        <div className="relative rounded-xl overflow-hidden shadow-sm h-64 border border-[#EFF1F0] bg-white/60 backdrop-blur-md">
          <Image 
            src="/assets/mandi_bokeh.png" 
            alt="Mandi market aesthetic" fill className="object-cover opacity-20 brightness-110" unoptimized 
          />
          
          <div className="relative z-10 p-8 flex flex-col h-full">
            <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2 drop-shadow-sm">MARKET OUTLOOK</p>
            <div className="mb-1">
              <span className="text-4xl font-black text-[var(--color-primary-900)] tracking-tighter">₹{data.price_prediction.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-auto opacity-70">Estimated Selling Price (₹/Quintal)</p>
            
            <div className="mt-8 bg-neon-green/30 text-[var(--color-primary-900)] text-[10px] uppercase tracking-widest font-black px-4 py-2 rounded-full border border-neon-green/40 backdrop-blur-md flex items-center gap-2 max-w-max shadow-sm">
              {data.price_trend === 'up' ? <TrendingUp className="w-4 h-4"/> : <Activity className="w-4 h-4"/>}
              Mandi Trend: <span className="capitalize">{data.price_trend === 'up' ? 'Rising' : data.price_trend}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Card */}
      <div className="border-l-4 border-[var(--color-primary-900)] bg-white shadow-sm shadow-[#EBEBEB] p-8 rounded-r-xl relative overflow-hidden my-8">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[var(--color-primary-900)] flex items-center justify-center text-white shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-[var(--color-text-main)] tracking-tight">Digital Agronomist Recommendation</h3>
                <span className="badge bg-[#F4EBE2] text-[#865A33] text-[9px]">PRIORITY ACTION</span>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-[var(--color-text-main)] leading-relaxed text-[15px] font-medium max-w-4xl ml-16 bg-[#fafafa] p-4 rounded-lg border border-neutral-100">
          Recommended Action: <span className="text-[var(--color-primary-900)] font-bold">{data.advisory.split('.')[0]}.</span> {data.advisory.substring(data.advisory.indexOf('.') + 1)}
        </p>

        <div className="flex gap-4 mt-6 ml-16">
          <button onClick={onNewPrediction} className="bg-[var(--color-primary-900)] text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-[var(--color-primary-800)] transition-colors shadow-sm">
            Approve Strategy
          </button>
          <button className="bg-white border border-[#EBEBEB] text-[var(--color-text-main)] px-6 py-2.5 rounded text-sm font-medium hover:bg-neutral-50 transition-colors shadow-sm">
            Download Mandi Report
          </button>
        </div>
      </div>

      {/* Input Parameters / Metadata */}
      <div>
        <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4">INPUT PARAMETERS & METADATA</p>
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr_0.8fr] gap-6">
          <div className="space-y-4">
            {/* Small metric cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#F4F7F6] p-4 rounded text-center">
                <p className="text-[8px] font-bold text-[var(--color-text-muted)] tracking-widest uppercase mb-1 drop-shadow-sm">SOIL MOISTURE</p>
                <p className="text-lg font-bold text-[var(--color-text-main)]">22.4%</p>
              </div>
              <div className="bg-[#F4F7F6] p-4 rounded text-center">
                <p className="text-[8px] font-bold text-[var(--color-text-muted)] tracking-widest uppercase mb-1 drop-shadow-sm">PH LEVEL</p>
                <p className="text-lg font-bold text-[var(--color-text-main)]">6.8</p>
              </div>
              <div className="bg-[#F4F7F6] p-4 rounded text-center">
                <p className="text-[8px] font-bold text-[var(--color-text-muted)] tracking-widest uppercase mb-1 drop-shadow-sm">AVG TEMP</p>
                <p className="text-lg font-bold text-[var(--color-text-main)]">{inputData?.temperature_celsius || '19.2'}°C</p>
              </div>
              <div className="bg-[#F4F7F6] p-4 rounded text-center">
                <p className="text-[8px] font-bold text-[var(--color-text-muted)] tracking-widest uppercase mb-1 drop-shadow-sm">CROP AGE</p>
                <p className="text-lg font-bold text-[var(--color-text-main)]">{inputData?.days_to_harvest || '112'} Days</p>
              </div>
            </div>
            
            {/* Dark NDVI map block */}
            <div className="w-full h-32 bg-[#1A1F1D] rounded relative overflow-hidden flex items-center justify-center border border-[#EBEBEB]">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 mix-blend-luminosity grayscale" />
              <div className="relative z-10 bg-black/40 backdrop-blur-sm border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-900)] shadow-[0_0_8px_#385546]" />
                <span className="text-white text-[10px] font-bold tracking-widest uppercase">LIVE NDVI ANALYSIS {(inputData?.region || "NORTH INDIA").toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="relative rounded overflow-hidden min-h-[160px] shadow-sm border border-[#EBEBEB]">
            <Image 
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80" 
              alt="Crop close up" fill className="object-cover" unoptimized 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="bg-[#3A534B]/80 backdrop-blur text-white text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-sm uppercase mb-1 inline-block">HOSHIARPUR PLOT B-2</span>
              <p className="text-white font-bold text-sm">Visual confirmation of grain ripening.</p>
              <p className="text-white/70 text-[10px] mt-0.5">Captured via local drone survey, Nov 02.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
