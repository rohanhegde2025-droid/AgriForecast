"use client";

import { useState } from "react";
import { PredictRequest } from "@/lib/api";
import { TrendingUp } from "lucide-react";

const CROPS = ["Maize", "Rice", "Barley", "Wheat", "Cotton", "Soybean"];
const SOIL_TYPES = ["Sandy", "Loam", "Chalky", "Silt", "Clay", "Peaty"];
const WEATHER_CONDITIONS = ["Sunny", "Rainy", "Cloudy"]; // Mockup shows 4 (Sunny, Overcast, Showers, Windy), reducing to 3 for schema match, but using a radio/checkbox group styling.

interface PredictionFormProps {
  onSubmit: (data: PredictRequest) => void;
  isLoading: boolean;
}

export function PredictionForm({ onSubmit, isLoading }: PredictionFormProps) {
  const [formData, setFormData] = useState<PredictRequest>({
    crop: "",
    region: "", // Not shown explicitly in the new mockup form step, but required by API. Will just put it in Step 1.
    soil_type: "",
    weather_condition: "",
    rainfall_mm: 0,
    temperature_celsius: 22.5,
    days_to_harvest: 120,
    fertilizer_used: false,
    irrigation_used: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    let finalValue: string | number | boolean = value;
    if (type === "number") finalValue = Number(value);
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  // Convert boolean to radio strings for visual styling
  const handleIrrigation = (val: boolean) => setFormData(prev => ({...prev, irrigation_used: val}));
  const handleFertilizer = (val: boolean) => setFormData(prev => ({...prev, fertilizer_used: val}));
  const handleWeather = (val: string) => setFormData(prev => ({...prev, weather_condition: val}));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Top Grid: Foundations & Environment */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1.2fr] gap-6">
        
        {/* STEP 01 */}
        <div className="bg-white rounded-xl border border-neutral-200/60 p-8 shadow-sm h-full">
          <div className="flex items-center gap-3 mb-8">
            <span className="badge bg-[#DAE6DF] text-[var(--color-primary-900)] text-[10px]">STEP 01</span>
            <h3 className="text-lg font-bold text-[var(--color-text-main)]">Foundational Data</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Crop Type</label>
              <select name="crop" required value={formData.crop} onChange={handleChange} className="select-field bg-[#F7F9F8] border-transparent h-12">
                <option value="" disabled>Select crop species...</option>
                {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Soil Type</label>
              <select name="soil_type" required value={formData.soil_type} onChange={handleChange} className="select-field bg-[#F7F9F8] border-transparent h-12">
                <option value="" disabled>Select soil composition...</option>
                {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Region Path (Required)</label>
            <input type="text" name="region" required value={formData.region} onChange={handleChange} className="input-field bg-[#F7F9F8] border-transparent h-12" placeholder="e.g. Punjab" />
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Growth Window &bull; <span className="text-neutral-400 font-medium normal-case">Estimated days remaining</span></label>
              <div className="text-3xl font-bold text-[var(--color-primary-900)] leading-none">{formData.days_to_harvest} <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold">Days</span></div>
            </div>
            {/* Visual range slider styling using standard input range */}
            <input 
              type="range" min="10" max="250" name="days_to_harvest" value={formData.days_to_harvest} onChange={handleChange}
              className="w-full h-1.5 bg-[#E6EBE8] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary-900)] mt-2"
            />
          </div>
        </div>

        {/* STEP 02 */}
        <div className="bg-[#FAF9F5] rounded-xl border border-[#F0ECE1] p-8 shadow-sm h-full">
          <div className="flex items-center gap-3 mb-8">
            <span className="badge bg-[#EFE8DD] text-[#7A6D5E] text-[10px]">STEP 02</span>
            <h3 className="text-lg font-bold text-[var(--color-text-main)]">Environment</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Avg Rainfall (MM/MO)</label>
              <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-neutral-100 h-14">
                <span className="text-xs font-medium text-neutral-400 px-3">rainy</span>
                <input type="number" name="rainfall_mm" required value={formData.rainfall_mm} onChange={handleChange} className="flex-1 bg-transparent border-none focus:outline-none text-lg font-bold text-[var(--color-text-main)]" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Avg Temp (°C)</label>
              <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-neutral-100 h-14">
                <span className="text-xs font-medium text-neutral-400 px-3">thermostat</span>
                <input type="number" name="temperature_celsius" required step="0.1" value={formData.temperature_celsius} onChange={handleChange} className="flex-1 bg-transparent border-none focus:outline-none text-lg font-bold text-[var(--color-text-main)]" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Condition Outlook</label>
              <div className="grid grid-cols-2 gap-2">
                {WEATHER_CONDITIONS.map(w => (
                  <label key={w} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${formData.weather_condition === w ? 'bg-white border-[var(--color-primary-900)] shadow-sm' : 'bg-white border-neutral-100 hover:border-neutral-300'}`}>
                    <input type="radio" required name="weather_group" checked={formData.weather_condition === w} onChange={() => handleWeather(w)} className="hidden" />
                    <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${formData.weather_condition === w ? 'border-[var(--color-primary-900)] bg-[var(--color-primary-900)]' : 'border-neutral-300'}`}>
                      {formData.weather_condition === w && <span className="w-1.5 h-1.5 bg-white rounded-sm" />}
                    </div>
                    <span className="text-xs font-medium text-[var(--color-text-main)]">{w}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* STEP 03 */}
      <div className="bg-white rounded-xl border border-neutral-200/60 p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <span className="badge bg-[#EAF0EC] text-[var(--color-primary-900)] text-[10px]">STEP 03</span>
            <h3 className="text-lg font-bold text-[var(--color-text-main)]">Active Management</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-12">
            <div>
              <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-3">Irrigation</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="ir_group" checked={formData.irrigation_used} onChange={() => handleIrrigation(true)} className="w-4 h-4 accent-[var(--color-primary-900)]" />
                  <span className="text-sm text-[var(--color-text-main)]">Automated</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="ir_group" checked={!formData.irrigation_used} onChange={() => handleIrrigation(false)} className="w-4 h-4 accent-[var(--color-primary-900)]" />
                  <span className="text-sm text-[var(--color-text-main)]">None</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-3">Fertilizer Type</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="fert_group" checked={formData.fertilizer_used} onChange={() => handleFertilizer(true)} className="w-4 h-4 accent-[var(--color-primary-900)]" />
                  <span className="text-sm text-[var(--color-text-main)]">Synthetic/Mixed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="fert_group" checked={!formData.fertilizer_used} onChange={() => handleFertilizer(false)} className="w-4 h-4 accent-[var(--color-primary-900)]" />
                  <span className="text-sm text-[var(--color-text-main)]">None</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-end">
          <button type="submit" disabled={isLoading} className="bg-[#385546] text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:bg-[#2A4336] transition-colors flex items-center gap-8 min-w-[280px] justify-between">
            {isLoading ? "Processing..." : (
              <>
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-base">Generate</span>
                  <span className="text-base text-[#A2BAAD]">Prediction</span>
                </span>
                <TrendingUp className="w-6 h-6 text-[#A2BAAD]" />
              </>
            )}
          </button>
          <p className="text-[9px] text-neutral-400 font-medium uppercase tracking-widest mt-3">EXECUTION TIME: ~4.2 SECONDS VIA SATELLITE RELAY</p>
        </div>
      </div>
    </form>
  );
}
