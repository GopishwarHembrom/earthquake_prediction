import { useEffect, useMemo, useState } from "react";
import FeatureImportanceChart from "./components/FeatureImportanceChart";
import MapView from "./components/MapView";
import PredictionCard from "./components/PredictionCard";
import Sidebar from "./components/Sidebar";
import AlertMessage from "./components/ui/AlertMessage";
import { getFeatureImportance, predictRisk } from "./services/predictionService";

const defaultLocation = {
  lat: 19.076,
  lon: 72.8777,
};

export default function App() {
  const [magnitude, setMagnitude] = useState(5);
  const [depth, setDepth] = useState(50);
  const [location, setLocation] = useState(defaultLocation);
  const [prediction, setPrediction] = useState(null);
  const [importanceData, setImportanceData] = useState([]);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [loadingChart, setLoadingChart] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchImportance = async () => {
      try {
        setLoadingChart(true);
        const features = await getFeatureImportance();
        setImportanceData(features);
      } catch (err) {
        setError(err.message || "Failed to load feature importance.");
      } finally {
        setLoadingChart(false);
      }
    };

    fetchImportance();
  }, []);

  const handlePredict = async () => {
    setError("");
    setLoadingPrediction(true);

    try {
      const result = await predictRisk({
        magnitude,
        depth,
        lat: location.lat,
        lon: location.lon,
      });
      setPrediction(result);
    } catch (err) {
      setError(err.message || "Prediction failed.");
    } finally {
      setLoadingPrediction(false);
    }
  };

  const selectedLocationLabel = useMemo(
    () => `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`,
    [location]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-4 md:p-6 lg:flex-row">
        <Sidebar
          magnitude={magnitude}
          depth={depth}
          onMagnitudeChange={setMagnitude}
          onDepthChange={setDepth}
          onPredict={handlePredict}
          isPredicting={loadingPrediction}
          selectedLocationLabel={selectedLocationLabel}
        />

        <main className="flex-1 space-y-6">
          <header className="rounded-2xl border border-border bg-panel px-6 py-5 shadow-soft backdrop-blur">
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
              Earthquake Risk Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Predict seismic risk by combining geolocation, magnitude, and depth.
            </p>
          </header>

          {error && <AlertMessage message={error} />}

          <section className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <MapView location={location} onLocationChange={setLocation} />
            </div>

            <div className="space-y-6">
              <PredictionCard prediction={prediction} isLoading={loadingPrediction} />
              <FeatureImportanceChart data={importanceData} isLoading={loadingChart} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
