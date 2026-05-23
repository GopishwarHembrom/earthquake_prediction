import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import LoadingSpinner from "./ui/LoadingSpinner";

export default function FeatureImportanceChart({ data, isLoading }) {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className="rounded-2xl border border-border bg-panel p-5 shadow-soft backdrop-blur">
      <h3 className="font-heading text-lg font-semibold text-slate-100">Feature Importance</h3>
      <div className="mt-4 h-[260px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : !hasData ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-4 text-center text-sm text-slate-300">
            Feature data not available. Make sure backend is running and model loaded.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="name" type="category" width={70} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 12,
                  color: "#e2e8f0",
                }}
                cursor={{ fill: "rgba(6, 182, 212, 0.08)" }}
              />
              <Bar dataKey="value" fill="#06b6d4" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
