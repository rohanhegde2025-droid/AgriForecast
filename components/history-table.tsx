import { useState, useEffect } from "react";
import { Search, CalendarDays, ChevronLeft, ChevronRight, CheckCircle2, Clock } from "lucide-react";
import { auth } from "@/lib/firebase";
import { getHistory } from "@/lib/api";

const ALL_CROPS = ["All Crops", "Paddy", "Mustard", "Sugarcane", "Wheat", "Cotton"];

export function HistoryTable() {
  const [search, setSearch] = useState("");
  const [cropFilter, setCropFilter] = useState("All Crops");
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const data = await getHistory();
        setHistory(data);
      } else {
        setHistory([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Use dynamic data combined with mock for filled look
  const displayData = history.length > 0 ? history : [
    { id: 101, date: "No data", time: "--:-- IST", crop: "Empty", variety: "None", region: "No records found", yield_prediction: 0, price_prediction: 0, price_trend: "stable", status: "pending", advisory: "Run your first prediction to see records here." }
  ];

  return (
    <div className="w-full">
      {/* Filters Bar */}
      <div className="glass-dark border border-[var(--color-gold)]/20 p-5 rounded-xl flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.3)] mb-8">
        <div className="flex-1 max-w-md">
          <label className="block text-[9px] font-bold text-[#CBD5C9] uppercase tracking-widest mb-2 pl-1">SEARCH PREDICTION</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-gold)]/70" />
            <input
              type="text"
              placeholder="Filter by crop name, farm ID, or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-[var(--color-gold)]/20 rounded-lg text-sm focus:outline-none focus:border-[var(--color-gold)]/60 focus:ring-1 focus:ring-[var(--color-gold)]/30 bg-[var(--color-primary-800)]/70 text-[#E8F0E4] placeholder-[#CBD5C9]/50 transition-all font-medium"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-5">
          <div className="w-48">
            <label className="block text-[9px] font-bold text-[#CBD5C9] uppercase tracking-widest mb-2 pl-1">CROP TYPE</label>
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="w-full bg-[var(--color-primary-800)]/70 border border-[var(--color-gold)]/20 text-[#E8F0E4] py-2.5 px-4 rounded-lg focus:outline-none focus:border-[var(--color-gold)]/60 focus:ring-1 focus:ring-[var(--color-gold)]/30 transition-all font-medium cursor-pointer appearance-none"
            >
              {ALL_CROPS.map(c => <option key={c} value={c} className="bg-[var(--color-primary-900)]">{c}</option>)}
            </select>
          </div>
          <div className="w-48">
            <label className="block text-[9px] font-bold text-[#CBD5C9] uppercase tracking-widest mb-2 pl-1">TIMELINE</label>
            <div className="relative">
              <input type="text" value="Last 90 Days" readOnly className="w-full bg-[var(--color-primary-800)]/70 border border-[var(--color-gold)]/20 text-[#E8F0E4] py-2.5 px-4 rounded-lg focus:outline-none font-medium cursor-default" />
              <CalendarDays className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-gold)]/70 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Window */}
      <div className="glass-dark rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.4)] overflow-hidden border border-[var(--color-gold)]/20">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-[var(--color-gold)]/10 bg-[var(--color-primary-800)]/40">
                <th className="px-8 py-5 text-[10px] font-bold text-[#CBD5C9] uppercase tracking-widest w-32 border-r border-[var(--color-gold)]/5">DATE GENERATED</th>
                <th className="px-6 py-5 text-[10px] font-bold text-[#CBD5C9] uppercase tracking-widest border-r border-[var(--color-gold)]/5">CROP VARIETY</th>
                <th className="px-6 py-5 text-[10px] font-bold text-[#CBD5C9] uppercase tracking-widest border-r border-[var(--color-gold)]/5">PREDICTED YIELD</th>
                <th className="px-6 py-5 text-[10px] font-bold text-[#CBD5C9] uppercase tracking-widest border-r border-[var(--color-gold)]/5">MANDI TREND</th>
                <th className="px-6 py-5 text-[10px] font-bold text-[#CBD5C9] uppercase tracking-widest text-center border-r border-[var(--color-gold)]/5">STATUS</th>
                <th className="px-8 py-5 text-[10px] font-bold text-[#CBD5C9] uppercase tracking-widest">ADVISORY / ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-gold)]/5">
              {displayData.map((row, index) => (
                <tr key={`${row.id}-${index}`} className="hover:bg-[var(--color-primary-800)]/40 transition-colors group">
                  <td className="px-8 py-6 border-r border-[var(--color-gold)]/5 group-hover:bg-[var(--color-primary-800)]/20">
                    <p className="font-bold text-[#E8F0E4] text-[13px] tracking-wide">{row.date}</p>
                    <p className="text-[11px] text-[#CBD5C9] mt-1 font-medium">{row.time}</p>
                  </td>
                  <td className="px-6 py-6 border-r border-[var(--color-gold)]/5 group-hover:bg-[var(--color-primary-800)]/20">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[var(--color-primary-800)]/60 border border-[var(--color-gold)]/20 rounded-lg flex items-center justify-center text-[var(--color-gold)] shrink-0 shadow-inner">
                        <span className="text-lg mix-blend-plus-lighter">🌿</span>
                      </div>
                      <div>
                        <p className="font-bold text-[#E8F0E4] text-[14px]">
                          {row.crop} {row.variety && row.variety !== "None" ? <span className="text-[var(--color-gold)]/80 text-xs ml-1 font-medium">{row.variety}</span> : ""}
                        </p>
                        <p className="text-[11px] text-[#CBD5C9] mt-1 font-medium tracking-wide">{row.region || "N/A"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-[#E8F0E4] text-[16px] font-black border-r border-[var(--color-gold)]/5 group-hover:bg-[var(--color-primary-800)]/20">
                    {row.yield_prediction || row.yield || 0} <span className="text-[10px] font-bold text-[#CBD5C9] uppercase tracking-widest ml-1">Quintals/Acre</span>
                  </td>
                  <td className="px-6 py-6 border-r border-[var(--color-gold)]/5 group-hover:bg-[var(--color-primary-800)]/20">
                    <div className="flex items-center gap-2.5 text-[14px]">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border ${row.price_trend === "up" ? "bg-green-500/10 border-green-500/30 text-green-400" : row.price_trend === "down" ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-[var(--color-gold)]/10 border-[var(--color-gold)]/30 text-[var(--color-gold)]"}`}>
                        {row.price_trend === "up" ? "↗" : row.price_trend === "down" ? "↘" : "→"}
                      </span>
                      <span className="font-bold text-[#E8F0E4]">₹{(row.price_prediction || 0).toLocaleString()} <span className="text-[10px] text-[#CBD5C9] uppercase tracking-widest font-bold">/Qtl</span></span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center border-r border-[var(--color-gold)]/5 group-hover:bg-[var(--color-primary-800)]/20">
                    {row.status === "verified" ? (
                      <span className="inline-flex items-center gap-1.5 bg-[var(--color-gold)]/10 text-[var(--color-gold)] px-3 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-widest border border-[var(--color-gold)]/30 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        VERIFIED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-[var(--color-primary-800)]/50 text-[#CBD5C9] px-3 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-widest border border-[var(--color-gold)]/10">
                        <Clock className="w-3.5 h-3.5" />
                        PENDING
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 group-hover:bg-[var(--color-primary-800)]/20">
                    <p className="text-[12px] font-medium text-[#CBD5C9] max-w-xs whitespace-normal line-clamp-2 leading-relaxed italic">{row.advisory || row.action || "No action recorded"}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination bar */}
        <div className="px-8 py-5 border-t border-[var(--color-gold)]/20 bg-[var(--color-primary-800)]/50 flex items-center justify-between text-[10px] font-bold text-[#CBD5C9] uppercase tracking-widest">
          <span className="opacity-80">SHOWING {displayData.length} OF {displayData.length} PREDICTIONS</span>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center border border-[var(--color-gold)]/30 rounded-sm hover:bg-[var(--color-gold)]/10 hover:text-[var(--color-gold)] transition-colors text-[#CBD5C9] shadow-sm"><ChevronLeft className="w-4 h-4"/></button>
            <button className="w-8 h-8 flex items-center justify-center bg-[var(--color-gold)] text-[var(--color-primary-900)] rounded-sm font-black shadow-[0_0_10px_rgba(212,160,23,0.3)]">1</button>
            <button className="w-8 h-8 flex items-center justify-center border border-[var(--color-gold)]/30 rounded-sm hover:bg-[var(--color-gold)]/10 hover:text-[var(--color-gold)] transition-colors text-[#CBD5C9] shadow-sm"><ChevronRight className="w-4 h-4"/></button>
          </div>
        </div>
      </div>
    </div>
  );
}
