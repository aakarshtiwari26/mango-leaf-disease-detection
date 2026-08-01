import SectionHeading from "../components/SectionHeading";

const blocks = [
  {
    title: "Image preprocessing",
    text: "The AI service standardizes images to 299×299 and normalizes pixel data for transfer learning with InceptionV3.",
  },
  {
    title: "Transfer learning",
    text: "ImageNet pretrained weights provide a strong visual feature backbone that is fine-tuned for mango diseases.",
  },
  {
    title: "Decision support",
    text: "The platform returns confidence, symptoms, causes, treatment, and prevention guidance to support real-world action.",
  },
];

export default function AboutDiseaseDetection() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <SectionHeading
          eyebrow="About disease detection"
          title="Why this system is designed the way it is"
          description="Mango leaf disease detection benefits from a full application stack: secure access, structured history, and a dedicated AI inference service."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {blocks.map((block) => (
            <div key={block.title} className="glass-card p-6">
              <h3 className="font-display text-xl font-bold text-white">
                {block.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/70">
                {block.text}
              </p>
            </div>
          ))}
        </div>
        <div className="glass-card p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-mango-300">
            Model summary
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Backbone" value="InceptionV3" />
            <Stat label="Input Size" value="299×299" />
            <Stat label="Loss" value="Categorical Crossentropy" />
            <Stat label="Optimizer" value="Adam" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-white/45">
        {label}
      </p>
      <p className="mt-3 text-lg font-bold text-white">{value}</p>
    </div>
  );
}
