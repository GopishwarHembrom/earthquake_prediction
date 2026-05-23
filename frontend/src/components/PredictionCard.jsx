import LoadingSpinner from "./ui/LoadingSpinner";

const riskColorMap = {
  Low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  Medium: "text-orange-300 bg-orange-500/10 border-orange-500/30",
  High: "text-red-300 bg-red-500/10 border-red-500/30",
};

export default function PredictionCard({ prediction, isLoading }) {
  const riskClass = prediction ? riskColorMap[prediction] : "text-slate-300 bg-slate-900/60 border-border";

  return (
    <div className="rounded-2xl border border-border bg-panel p-5 shadow-soft backdrop-blur">
      <h3 className="font-heading text-lg font-semibold text-slate-100">Prediction Result</h3>
      <div className={`mt-4 rounded-xl border p-4 ${riskClass}`}>
        {isLoading ? (
          <div className="flex items-center gap-3 text-slate-200">
            <LoadingSpinner />
            <span>Analyzing seismic risk...</span>
          </div>
        ) : (
          <p className="text-base font-semibold">
            {prediction ? `Risk Level: ${prediction}` : "Run prediction to view risk level."}
          </p>
        )}
      </div>
    </div>
  );
}
