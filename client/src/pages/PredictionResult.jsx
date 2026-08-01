import { useLocation, Link } from "react-router-dom";
import ProbabilityChart from "../components/ProbabilityChart";
import SectionHeading from "../components/SectionHeading";
import { downloadPredictionReport } from "../services/api";

export default function PredictionResult() {
  const location = useLocation();
  const prediction =
    location.state?.prediction ||
    JSON.parse(localStorage.getItem("mango_leaf_last_prediction") || "null");

  if (!prediction) {
    return (
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl glass-card p-10 text-center">
          <h1 className="font-display text-3xl font-bold text-white">
            No prediction available
          </h1>
          <p className="mt-4 text-white/65">
            Upload a leaf image to generate a result.
          </p>
          <Link
            to="/upload"
            className="mt-6 inline-flex rounded-2xl bg-mango-300 px-5 py-3 font-bold text-slate-950"
          >
            Upload Leaf
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <SectionHeading
          eyebrow="Prediction result"
          title={prediction.diseaseName}
          description="Detailed diagnosis, probability breakdown, and recommended action plan."
        />
        <div className="grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
          <div className="glass-card overflow-hidden">
            <img
              src={prediction.imageUrl}
              alt={prediction.diseaseName}
              className="h-full min-h-[380px] w-full object-cover"
            />
          </div>
          <div className="glass-card space-y-6 p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-white/45">
                  Healthy or diseased
                </p>
                <p
                  className={`mt-2 text-3xl font-black ${prediction.healthy ? "text-leaf-300" : "text-mango-300"}`}
                >
                  {prediction.healthy ? "Healthy" : "Diseased"}
                </p>
              </div>
              <div className="rounded-3xl bg-white/5 px-5 py-4 text-right">
                <p className="text-sm text-white/55">Confidence</p>
                <p className="text-3xl font-black text-white">
                  {(prediction.confidence * 100).toFixed(2)}%
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Info title="Symptoms" list={prediction.symptoms} />
              <Info title="Causes" list={prediction.causes} />
            </div>

            <div className="space-y-3">
              <Block
                title="Disease Description"
                text={
                  prediction.description ||
                  "Detailed disease summary is available on the disease details page."
                }
              />
              <Block
                title="Recommended Treatment"
                text={prediction.treatment}
              />
              <Block title="Preventive Measures" text={prediction.prevention} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Block
                title="Prediction Time"
                text={`${prediction.predictionTimeMs} ms`}
              />
              <a
                href={prediction.reportUrl || "#"}
                className="rounded-2xl bg-leaf-400 px-5 py-3 text-center font-bold text-slate-950"
              >
                Download Prediction Report PDF
              </a>
            </div>

            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-white/45">
                Probability chart
              </p>
              <ProbabilityChart
                probabilities={prediction.probabilities || []}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({ title, list }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/45">
        {title}
      </p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-white/70">
        {list?.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function Block({ title, text }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/45">
        {title}
      </p>
      <p className="mt-3 text-sm leading-7 text-white/72">{text}</p>
    </div>
  );
}
