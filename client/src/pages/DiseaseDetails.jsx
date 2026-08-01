import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Spinner from "../components/Spinner";
import SectionHeading from "../components/SectionHeading";

export default function DiseaseDetails() {
  const { slug } = useParams();
  const [disease, setDisease] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDisease = async () => {
      try {
        const { data } = await api.get(`/diseases/${slug}`);
        setDisease(data.disease);
      } finally {
        setLoading(false);
      }
    };

    loadDisease();
  }, [slug]);

  if (loading) return <Spinner fullscreen />;
  if (!disease) return null;

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <SectionHeading
          eyebrow="Disease details"
          title={disease.name}
          description={disease.description}
        />
        <div className="grid gap-5 lg:grid-cols-3">
          <Card title="Symptoms" items={disease.symptoms} />
          <Card title="Causes" items={disease.causes} />
          <Card title="Prevention" items={[disease.prevention]} />
        </div>
        <div className="glass-card p-8">
          <h3 className="font-display text-2xl font-bold text-white">
            Recommended treatment
          </h3>
          <p className="mt-4 leading-7 text-white/70">{disease.treatment}</p>
        </div>
      </div>
    </section>
  );
}

function Card({ title, items }) {
  return (
    <div className="glass-card p-6">
      <p className="text-sm uppercase tracking-[0.2em] text-white/45">
        {title}
      </p>
      <ul className="mt-4 space-y-2 text-sm leading-6 text-white/70">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
