import { useState, useEffect } from "react";
import { Search, CalendarDays, ChevronLeft, ChevronRight, CheckCircle2, Clock } from "lucide-react";
import { getHistory } from "@/lib/api";

const ALL_CROPS = ["All Crops", "Paddy", "Mustard", "Sugarcane", "Wheat", "Cotton"];

export function HistoryTable() {
  const [search, setSearch] = useState("");
  const [cropFilter, setCropFilter] = useState("All Crops");
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Use dynamic data combined with mock for filled look
  const displayData = history.length > 0 ? history : [
    { id: 101, date: "No data", time: "--:-- IST", crop: "Empty", variety: "None", region: "No records found", yield_prediction: 0, price_prediction: 0, price_trend: "stable", status: "pending", advisory: "Run your first prediction to see records here." }
  ];

  return (
    <div className="w-full">
      {/* Filters Bar */}
      <div className="bg-[#FAFBF9] border border-[#EFF1F0] p-4 rounded-xl flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] mb-8">
        <div className="flex-1 max-w-md">
          <label className="block text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1 pl-1">SEARCH PREDICTION</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Filter by crop name, farm ID, or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded text-sm focus:outline-none focus:border-[var(--color-primary-900)] bg-white"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-48">
            <label className="block text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1 pl-1">CROP TYPE</label>
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="select-field !bg-white !py-2 !h-auto border-neutral-200"
            >
              {ALL_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="w-48">
            <label className="block text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1 pl-1">TIMELINE</label>
            <div className="relative">
              <input type="text" value="Last 90 Days" readOnly className="select-field !bg-white !py-2 !h-auto border-neutral-200 pr-10" />
              <CalendarDays className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-[#EFF1F0]">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-[#F0F2F1]">
              <th className="px-8 py-5 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest w-32">DATE GENERATED</th>
              <th className="px-6 py-5 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">CROP VARIETY</th>
              <th className="px-6 py-5 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">PREDICTED YIELD</th>
              <th className="px-6 py-5 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">MANDI TREND</th>
              <th className="px-6 py-5 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest text-center">STATUS</th>
              <th className="px-8 py-5 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">ADVISORY / ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F8F7]">
            {displayData.map((row) => (
              <tr key={row.id} className="hover:bg-[#FCFDFD] transition-colors">
                <td className="px-8 py-6">
                  <p className="font-bold text-[var(--color-text-main)] text-[13px]">{row.date}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{row.time}</p>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#EAF0EC] rounded flex items-center justify-center text-[var(--color-primary-900)] shrink-0">
                      <span className="text-xl">🌿</span>
                    </div>
                    <div>
                      <p className="font-bold text-[var(--color-text-main)] text-[14px]">
                        {row.crop} {row.variety !== "None" ? row.variety : ""}
                      </p>
                      <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{row.region || "N/A"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 font-medium text-[var(--color-text-main)] text-[15px]">
                  {row.yield_prediction || row.yield || 0} <span className="text-[10px] font-bold text-[var(--color-text-muted)] tracking-wider">Quintals/Acre</span>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2 text-[13px]">
                    <span className="text-neutral-400">
                      {row.price_trend === "up" ? "↗" : row.price_trend === "down" ? "↘" : "→"}
                    </span>
                    <span className="font-medium text-[var(--color-text-main)]">₹{(row.price_prediction || 0).toLocaleString()} /Qtl</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-center">
                  {row.status === "verified" ? (
                    <span className="inline-flex items-center gap-1 bg-[#E2EBE5] text-[var(--color-primary-900)] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#CDDBD3]">
                      <CheckCircle2 className="w-3 h-3" />
                      VERIFIED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-neutral-200">
                      <Clock className="w-3 h-3" />
                      PENDING
                    </span>
                  )}
                </td>
                <td className="px-8 py-6">
                  <p className="text-[12px] text-[var(--color-text-muted)] line-clamp-1">{row.advisory || row.action || "No action recorded"}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination bar */}
        <div className="px-8 py-5 border-t border-[#F0F2F1] flex items-center justify-between text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest bg-[#FCFDFD]">
          <span>SHOWING {displayData.length} OF {displayData.length} PREDICTIONS</span>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center border border-neutral-200 rounded hover:bg-neutral-50"><ChevronLeft className="w-4 h-4"/></button>
            <button className="w-8 h-8 flex items-center justify-center bg-[var(--color-primary-900)] text-white rounded">1</button>
            <button className="w-8 h-8 flex items-center justify-center border border-neutral-200 rounded hover:bg-neutral-50"><ChevronRight className="w-4 h-4"/></button>
          </div>
        </div>
      </div>
    </div>
  );
}
