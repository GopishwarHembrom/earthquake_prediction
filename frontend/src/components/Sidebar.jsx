import LoadingSpinner from "./ui/LoadingSpinner";

export default function Sidebar({
  magnitude,
  depth,
  onMagnitudeChange,
  onDepthChange,
  onPredict,
  isPredicting,
  selectedLocationLabel,
}) {
  return (
    <aside className="w-full rounded-2xl border border-border bg-panel p-5 shadow-soft backdrop-blur lg:w-[320px]">
      <h2 className="font-heading text-xl font-semibold text-slate-50">
        Earthquake Dashboard
      </h2>
      <p className="mt-2 text-sm text-slate-300">
        Tune earthquake parameters and run your AI risk prediction.
      </p>

      <div className="mt-8 space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-200">Magnitude</label>
            <span className="rounded bg-slate-800 px-2 py-1 text-xs text-cyan-300">
              {magnitude.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            step={0.1}
            value={magnitude}
            onChange={(event) => onMagnitudeChange(Number(event.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-200">Depth (km)</label>
            <span className="rounded bg-slate-800 px-2 py-1 text-xs text-cyan-300">
              {depth.toFixed(0)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={700}
            step={1}
            value={depth}
            onChange={(event) => onDepthChange(Number(event.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        <div className="rounded-xl border border-border bg-slate-900/60 p-3 text-sm text-slate-300">
          <p className="font-medium text-slate-100">Selected coordinates</p>
          <p className="mt-1">{selectedLocationLabel}</p>
        </div>

        <button
          type="button"
          onClick={onPredict}
          disabled={isPredicting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-900 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPredicting ? <LoadingSpinner compact /> : null}
          {isPredicting ? "Predicting..." : "Predict"}
        </button>
      </div>
    </aside>
  );
}
