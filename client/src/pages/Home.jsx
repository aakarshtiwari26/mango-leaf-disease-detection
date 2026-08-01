import { Link } from "react-router-dom";
import { diseases } from "../constants/diseases";
import SectionHeading from "../components/SectionHeading";

const features = [
  "JWT-authenticated dashboard and profile management",
  "AI-powered disease classification with confidence scores",
  "Prediction history, filters, and downloadable PDF reports",
  "Responsive glassmorphism UI with theme toggle and animations",
];

const benefits = [
  "Faster early detection for mango growers",
  "Traceable prediction history for decision making",
  "Actionable treatment, symptoms, and prevention guidance",
  "Production-ready deployment with Docker support",
];

const steps = [
  "Upload a leaf image from the camera or gallery.",
  "The AI service classifies the leaf with InceptionV3.",
  "Results, treatment advice, and probabilities appear instantly.",
  "Every prediction is stored for history, search, and reporting.",
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pt-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/75 shadow-glass">
              Mango Leaf Disease Detection Using InceptionV3
            </div>
            <div className="space-y-5">
              <h1 className="font-display text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                Detect mango leaf diseases with{" "}
                <span className="text-gradient">AI precision</span> and
                field-ready guidance.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-white/70">
                A complete MERN + FastAPI platform for plant disease detection,
                secure user workflows, prediction history, PDF reports, and
                actionable treatment advice.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/upload"
                className="rounded-full bg-mango-300 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-mango-200"
              >
                Start a Prediction
              </Link>
              <Link
                to="/about"
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Learn How It Works
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="glass-card p-5">
                <div className="text-3xl font-black text-mango-300">8</div>
                <p className="mt-1 text-sm text-white/60">
                  Disease classes supported
                </p>
              </div>
              <div className="glass-card p-5">
                <div className="text-3xl font-black text-leaf-300">299×299</div>
                <p className="mt-1 text-sm text-white/60">
                  InceptionV3 input size
                </p>
              </div>
              <div className="glass-card p-5">
                <div className="text-3xl font-black text-white">PDF</div>
                <p className="mt-1 text-sm text-white/60">
                  Downloadable report output
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 -top-8 h-28 w-28 rounded-full bg-mango-300/20 blur-3xl" />
            <div className="absolute -bottom-8 -right-6 h-28 w-28 rounded-full bg-leaf-400/20 blur-3xl" />
            <div className="glass-card hero-glow gradient-border relative overflow-hidden p-6 shadow-glow">
              <div className="mb-4 flex items-center justify-between text-sm text-white/60">
                <span>Live system overview</span>
                <span className="rounded-full bg-leaf-400/20 px-3 py-1 text-leaf-200">
                  Online
                </span>
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                    Prediction Output
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-white">
                        Anthracnose
                      </p>
                      <p className="text-sm text-white/60">Confidence score</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-mango-300">
                        96.4%
                      </p>
                      <p className="text-sm text-white/50">High certainty</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white/5 p-4">
                    <p className="text-sm font-medium text-white/60">
                      Treatment
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/85">
                      Copper fungicide, pruning, and canopy airflow improvement.
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white/5 p-4">
                    <p className="text-sm font-medium text-white/60">Status</p>
                    <p className="mt-2 text-sm leading-6 text-white/85">
                      Leaf is diseased and should be treated early to avoid
                      spread.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeading
            eyebrow="How it works"
            title="From image upload to actionable diagnosis"
            description="The platform combines secure MERN workflows with a dedicated FastAPI inference service powered by InceptionV3."
          />
          <div className="grid gap-5 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step} className="glass-card p-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-mango-300 to-leaf-400 font-bold text-slate-950">
                  0{index + 1}
                </div>
                <p className="mt-4 text-sm leading-6 text-white/72">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div className="space-y-5">
            <SectionHeading
              eyebrow="Features"
              title="Built for growers, researchers, and field teams"
            />
            <div className="grid gap-4">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="glass-card flex items-start gap-4 p-5"
                >
                  <span className="mt-1 h-3 w-3 rounded-full bg-mango-300" />
                  <p className="text-white/75">{feature}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <SectionHeading
              eyebrow="Benefits"
              title="Operational value beyond the prediction"
            />
            <div className="grid gap-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="glass-card flex items-start gap-4 p-5"
                >
                  <span className="mt-1 h-3 w-3 rounded-full bg-leaf-300" />
                  <p className="text-white/75">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeading
            eyebrow="Disease list"
            title="Supported mango leaf classes"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {diseases.map((disease) => (
              <Link
                key={disease.slug}
                to={`/diseases/${disease.slug}`}
                className="glass-card p-5 transition hover:-translate-y-1 hover:bg-white/15"
              >
                <h3 className="font-display text-lg font-bold text-white">
                  {disease.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  {disease.short}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
