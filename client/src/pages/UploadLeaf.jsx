import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SectionHeading from "../components/SectionHeading";
import Spinner from "../components/Spinner";
import api from "../services/api";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function UploadLeaf() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const uploadHint = useMemo(
    () => "Accepted formats: JPG, JPEG, PNG, WEBP. Maximum size: 5 MB.",
    [],
  );

  const handleFile = (selected) => {
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      toast.error("Image must be smaller than 5 MB");
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0]);
  };

  const handlePrediction = async () => {
    if (!file) {
      toast.error("Upload a leaf image first");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await api.post("/predictions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      localStorage.setItem(
        "mango_leaf_last_prediction",
        JSON.stringify(data.prediction),
      );
      toast.success("Prediction completed");
      navigate("/result", { state: { prediction: data.prediction } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <SectionHeading
          eyebrow="Upload leaf"
          title="Drop a mango leaf image to analyze"
          description={uploadHint}
        />
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          className="glass-card grid gap-6 p-6 lg:grid-cols-[1fr_.9fr]"
        >
          <label className="flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/5 p-6 text-center transition hover:bg-white/10">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
            <span className="rounded-full bg-mango-300/20 px-4 py-2 text-sm font-semibold text-mango-200">
              Drag & drop or click to upload
            </span>
            <p className="mt-5 text-lg font-semibold text-white">
              Preview your mango leaf image
            </p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-white/60">
              The image is validated before upload and sent securely to the AI
              service for inference.
            </p>
          </label>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70">
              {preview ? (
                <img
                  src={preview}
                  alt="Leaf preview"
                  className="h-[320px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[320px] items-center justify-center text-white/40">
                  Image preview appears here
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handlePrediction}
                type="button"
                className="rounded-2xl bg-mango-300 px-5 py-3 font-bold text-slate-950 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? <Spinner /> : "Run Prediction"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreview("");
                }}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
