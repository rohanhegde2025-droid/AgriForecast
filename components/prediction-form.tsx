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
        <div className="glass-dark border border-[var(--color-gold)]/20 rounded-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] h-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-primary-800)] to-[var(--color-gold)]/40" />
          <div className="flex items-center gap-3 mb-8">
            <span className="bg-[var(--color-primary-800)] border border-[var(--color-gold)]/30 text-[var(--color-gold)] text-[10px] font-bold px-2.5 py-1 rounded-sm tracking-widest uppercase shadow-sm">STEP 01</span>
            <h3 className="text-lg font-bold text-[#E8F0E4] tracking-wide">Foundational Data</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-[10px] font-bold text-[#CBD5C9] uppercase tracking-widest mb-2">Crop Type</label>
              <select name="crop" required value={formData.crop} onChange={handleChange} className="w-full bg-[var(--color-primary-800)]/70 border border-[var(--color-gold)]/20 text-[#E8F0E4] h-12 px-4 rounded-lg focus:outline-none focus:border-[var(--color-gold)]/60 focus:ring-1 focus:ring-[var(--color-gold)]/30 transition-all font-medium appearance-none">
                <option value="" disabled className="text-[#CBD5C9]">Select crop species...</option>
                {CROPS.map(c => <option key={c} value={c} className="bg-[var(--color-primary-900)]">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#CBD5C9] uppercase tracking-widest mb-2">Soil Type</label>
              <select name="soil_type" required value={formData.soil_type} onChange={handleChange} className="w-full bg-[var(--color-primary-800)]/70 border border-[var(--color-gold)]/20 text-[#E8F0E4] h-12 px-4 rounded-lg focus:outline-none focus:border-[var(--color-gold)]/60 focus:ring-1 focus:ring-[var(--color-gold)]/30 transition-all font-medium appearance-none">
                <option value="" disabled className="text-[#CBD5C9]">Select soil composition...</option>
                {SOIL_TYPES.map(s => <option key={s} value={s} className="bg-[var(--color-primary-900)]">{s}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-[10px] font-bold text-[#CBD5C9] uppercase tracking-widest mb-2">Region Path (Required)</label>
            <select name="region" required value={formData.region} onChange={handleChange} className="w-full bg-[var(--color-primary-800)]/70 border border-[var(--color-gold)]/20 text-[#E8F0E4] h-12 px-4 rounded-lg focus:outline-none focus:border-[var(--color-gold)]/60 focus:ring-1 focus:ring-[var(--color-gold)]/30 transition-all font-medium appearance-none">
                <option value="" disabled className="text-[#CBD5C9]">Select your region...</option>
                {["North", "South", "West", "East"].map(r => <option key={r} value={r} className="bg-[var(--color-primary-900)]">{r}</option>)}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-[10px] font-bold text-[#CBD5C9] uppercase tracking-widest">Growth Window &bull; <span className="opacity-70 font-medium normal-case">Estimated days remaining</span></label>
              <div className="text-3xl font-bold text-[var(--color-gold)] leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{formData.days_to_harvest} <span className="text-[10px] text-[#CBD5C9] uppercase tracking-widest font-bold ml-1">Days</span></div>
            </div>
            <input 
              type="range" min="10" max="250" name="days_to_harvest" value={formData.days_to_harvest} onChange={handleChange}
              className="w-full h-1.5 bg-[var(--color-primary-800)] rounded-lg appearance-none cursor-pointer accent-[var(--color-gold)] mt-2 shadow-inner"
            />
          </div>
        </div>

        {/* STEP 02 */}
        <div className="glass-dark border border-[var(--color-gold)]/20 rounded-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] h-full relative overflow-hidden bg-gradient-to-br from-[var(--color-primary-900)] to-[var(--color-primary-800)]">
          <div className="flex items-center gap-3 mb-8">
            <span className="bg-[var(--color-primary-800)] border border-[var(--color-gold)]/30 text-[var(--color-gold)] text-[10px] font-bold px-2.5 py-1 rounded-sm tracking-widest uppercase shadow-sm">STEP 02</span>
            <h3 className="text-lg font-bold text-[#E8F0E4] tracking-wide">Environment</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-[#CBD5C9] uppercase tracking-widest mb-2">Avg Rainfall (MM/MO)</label>
              <div className="flex items-center gap-3 bg-[var(--color-primary-800)]/50 p-2 rounded-lg border border-[var(--color-gold)]/20 h-14 focus-within:border-[var(--color-gold)]/60 focus-within:ring-1 focus-within:ring-[var(--color-gold)]/30 transition-all">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-gold)]/80 px-3">rainy</span>
                <input type="number" name="rainfall_mm" required value={formData.rainfall_mm === 0 ? "" : formData.rainfall_mm} onChange={handleChange} className="flex-1 bg-transparent border-none focus:outline-none text-lg font-bold text-[#E8F0E4]" placeholder="0" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#CBD5C9] uppercase tracking-widest mb-2">Avg Temp (°C)</label>
              <div className="flex items-center gap-3 bg-[var(--color-primary-800)]/50 p-2 rounded-lg border border-[var(--color-gold)]/20 h-14 focus-within:border-[var(--color-gold)]/60 focus-within:ring-1 focus-within:ring-[var(--color-gold)]/30 transition-all">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-gold)]/80 px-3">thermostat</span>
                <input type="number" name="temperature_celsius" required step="0.1" value={formData.temperature_celsius === 0 ? "" : formData.temperature_celsius} onChange={handleChange} className="flex-1 bg-transparent border-none focus:outline-none text-lg font-bold text-[#E8F0E4]" placeholder="0.0" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#CBD5C9] uppercase tracking-widest mb-2">Condition Outlook</label>
              <div className="grid grid-cols-2 gap-3">
                {WEATHER_CONDITIONS.map(w => (
                  <label key={w} className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-all duration-300 ${formData.weather_condition === w ? 'bg-[var(--color-primary-800)] border-[var(--color-gold)] shadow-[0_0_15px_rgba(212,160,23,0.15)]' : 'bg-[var(--color-primary-800)]/40 border-[var(--color-gold)]/10 hover:border-[var(--color-gold)]/40'}`}>
                    <input type="radio" required name="weather_group" checked={formData.weather_condition === w} onChange={() => handleWeather(w)} className="hidden" />
                    <div className={`w-4 h-4 rounded-full border flex flex-shrink-0 items-center justify-center transition-colors ${formData.weather_condition === w ? 'border-[var(--color-gold)] bg-[var(--color-primary-900)]' : 'border-[#CBD5C9]/30 bg-[var(--color-primary-900)]/50'}`}>
                      {formData.weather_condition === w && <span className="w-2 h-2 bg-[var(--color-gold)] rounded-full shadow-[0_0_8px_rgba(212,160,23,0.8)]" />}
                    </div>
                    <span className={`text-[13px] font-bold tracking-wide ${formData.weather_condition === w ? 'text-[#E8F0E4]' : 'text-[#CBD5C9]'}`}>{w}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* STEP 03 */}
      <div className="glass-dark border border-[var(--color-gold)]/20 rounded-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col md:flex-row gap-8 items-center justify-between relative overflow-hidden">
        {/* Subtle glow effect */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--color-gold)]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex-1 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[var(--color-primary-800)] border border-[var(--color-gold)]/30 text-[var(--color-gold)] text-[10px] font-bold px-2.5 py-1 rounded-sm tracking-widest uppercase shadow-sm">STEP 03</span>
            <h3 className="text-lg font-bold text-[#E8F0E4] tracking-wide">Active Management</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-12">
            <div>
              <label className="block text-[10px] font-bold text-[#CBD5C9] uppercase tracking-widest mb-4">Irrigation</label>
              <div className="flex gap-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="ir_group" checked={formData.irrigation_used} onChange={() => handleIrrigation(true)} className="w-4 h-4 accent-[var(--color-gold)] ring-offset-[var(--color-primary-900)] ring-offset-2" />
                  <span className="text-sm font-medium text-[#E8F0E4] group-hover:text-[var(--color-gold)] transition-colors">Automated</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="ir_group" checked={!formData.irrigation_used} onChange={() => handleIrrigation(false)} className="w-4 h-4 accent-[var(--color-gold)] ring-offset-[var(--color-primary-900)] ring-offset-2" />
                  <span className="text-sm font-medium text-[#E8F0E4] group-hover:text-[var(--color-gold)] transition-colors">None</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-[#CBD5C9] uppercase tracking-widest mb-4">Fertilizer Type</label>
              <div className="flex gap-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="fert_group" checked={formData.fertilizer_used} onChange={() => handleFertilizer(true)} className="w-4 h-4 accent-[var(--color-gold)] ring-offset-[var(--color-primary-900)] ring-offset-2" />
                  <span className="text-sm font-medium text-[#E8F0E4] group-hover:text-[var(--color-gold)] transition-colors">Synthetic/Mixed</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="fert_group" checked={!formData.fertilizer_used} onChange={() => handleFertilizer(false)} className="w-4 h-4 accent-[var(--color-gold)] ring-offset-[var(--color-primary-900)] ring-offset-2" />
                  <span className="text-sm font-medium text-[#E8F0E4] group-hover:text-[var(--color-gold)] transition-colors">None</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-end relative z-10">
          <button type="submit" disabled={isLoading} className="btn-gold relative overflow-hidden group px-8 py-5 rounded-xl text-[var(--color-primary-900)] shadow-[0_0_20px_rgba(212,160,23,0.3)] hover:shadow-[0_0_30px_rgba(212,160,23,0.5)] transition-all duration-300 flex items-center gap-8 min-w-[300px] justify-between border border-[var(--color-gold)]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            
            {isLoading ? (
              <div className="flex items-center justify-center w-full">
                <div className="w-6 h-6 border-2 border-[var(--color-primary-900)] border-t-transparent flex-shrink-0 rounded-full animate-spin mr-3"></div>
                <span className="font-bold tracking-widest uppercase text-sm">Processing Model...</span>
              </div>
            ) : (
              <>
                <span className="flex flex-col items-start leading-tight text-left">
                  <span className="text-lg font-extrabold tracking-tight">Generate</span>
                  <span className="text-sm font-bold opacity-80 mix-blend-multiply tracking-widest uppercase mt-0.5">Prediction</span>
                </span>
                <TrendingUp className="w-7 h-7" strokeWidth={2.5} />
              </>
            )}
          </button>
          <p className="text-[9px] text-[var(--color-gold)] font-bold uppercase tracking-widest mt-4 opacity-70 flex items-center gap-1.5 drop-shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] animate-pulse" /> EXECUTION TIME: ~4.2 SECONDS VIA SATELLITE RELAY
          </p>
        </div>
      </div>
    </form>
  );
}
