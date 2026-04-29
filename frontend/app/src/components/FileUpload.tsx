import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Check, RotateCcw } from "lucide-react";
import { useI18n } from "../i18n";
import { useAssetUrl } from "../hooks/useAssetUrl";

interface Props {
  value: string;
  onChange: (url: string) => void;
  token: string;
  label: string;
  accept?: string;
}

interface CompressPreview {
  originalUrl: string;
  compressedUrl: string;
  originalSize: number;
  compressedSize: number;
  compressedBlob: Blob;
  fileName: string;
}

const SIZE_THRESHOLD = 200_000; // 200 KB
const MAX_UPLOAD = 1_500_000; // 1.5 MB

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(2)} MB`;
}

async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  // Scale down large images (max 1920px on longest side)
  const maxDim = 1920;
  if (width > maxDim || height > maxDim) {
    const scale = maxDim / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // Try quality steps until under threshold or give up
  for (const q of [0.7, 0.5, 0.35]) {
    const blob = await canvas.convertToBlob({ type: "image/webp", quality: q });
    if (blob.size <= SIZE_THRESHOLD) return blob;
  }
  // Return lowest quality attempt
  return canvas.convertToBlob({ type: "image/webp", quality: 0.3 });
}

export default function FileUpload({ value, onChange, token, label, accept = "image/*,video/*" }: Props) {
  const { t } = useI18n();
  const resolvedValue = useAssetUrl(value);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<CompressPreview | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const doUpload = useCallback(async (blob: Blob, name: string, type: string) => {
    setUploading(true);
    setError("");
    try {
      const data = new Uint8Array(await blob.arrayBuffer());
      const { backend } = await import("../actor");
      const key = await backend.uploadAsset(token, name, type, data);
      onChange(key);
    } catch {
      setError(t("uploadFailed"));
    }
    setUploading(false);
  }, [token, onChange, t]);

  const handleFile = useCallback(async (file: File) => {
    setError("");
    setPreview(null);

    const isImage = file.type.startsWith("image/");

    // Non-image: enforce 1.5 MB and upload directly
    if (!isImage) {
      if (file.size > MAX_UPLOAD) { setError(t("fileTooLarge")); return; }
      await doUpload(file, file.name, file.type);
      return;
    }

    // Small image: upload directly
    if (file.size <= SIZE_THRESHOLD) {
      if (file.size > MAX_UPLOAD) { setError(t("fileTooLarge")); return; }
      await doUpload(file, file.name, file.type);
      return;
    }

    // Large image: compress and show preview
    try {
      const compressedBlob = await compressImage(file);
      if (compressedBlob.size > MAX_UPLOAD) { setError(t("fileTooLarge")); return; }
      const originalUrl = URL.createObjectURL(file);
      const compressedUrl = URL.createObjectURL(compressedBlob);
      const baseName = file.name.replace(/\.[^.]+$/, "");
      setPreview({
        originalUrl,
        compressedUrl,
        originalSize: file.size,
        compressedSize: compressedBlob.size,
        compressedBlob,
        fileName: `${baseName}.webp`,
      });
    } catch {
      setError(t("uploadFailed"));
    }
  }, [doUpload, t]);

  const acceptCompressed = useCallback(async () => {
    if (!preview) return;
    URL.revokeObjectURL(preview.originalUrl);
    URL.revokeObjectURL(preview.compressedUrl);
    await doUpload(preview.compressedBlob, preview.fileName, "image/webp");
    setPreview(null);
  }, [preview, doUpload]);

  const cancelPreview = useCallback(() => {
    if (!preview) return;
    URL.revokeObjectURL(preview.originalUrl);
    URL.revokeObjectURL(preview.compressedUrl);
    setPreview(null);
  }, [preview]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (fileRef.current) fileRef.current.value = "";
  }, [handleFile]);

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors text-sm";

  // Before / After preview
  if (preview) {
    const saved = preview.originalSize - preview.compressedSize;
    const pct = Math.round((saved / preview.originalSize) * 100);

    return (
      <div>
        <label className="block text-sm text-white/50 mb-1.5">{label}</label>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="grid grid-cols-2 gap-4 mb-3">
            {/* Original */}
            <div className="space-y-1.5">
              <span className="block text-xs text-white/40 font-medium">{t("originalImage")}</span>
              <div className="aspect-video rounded-lg overflow-hidden bg-black/30 border border-white/10">
                <img src={preview.originalUrl} alt="Original" className="w-full h-full object-cover" />
              </div>
              <span className="block text-xs text-white/30">{formatSize(preview.originalSize)}</span>
            </div>
            {/* Compressed */}
            <div className="space-y-1.5">
              <span className="block text-xs text-primary font-medium">{t("compressedImage")}</span>
              <div className="aspect-video rounded-lg overflow-hidden bg-black/30 border border-primary/30">
                <img src={preview.compressedUrl} alt="Compressed" className="w-full h-full object-cover" />
              </div>
              <span className="block text-xs text-primary/70">{formatSize(preview.compressedSize)}</span>
            </div>
          </div>

          <p className="text-xs text-white/40 mb-3 text-center">
            {t("sizeReduced")} <span className="text-primary font-semibold">{pct}%</span> ({formatSize(saved)})
          </p>

          <div className="flex gap-2 justify-center">
            <button
              type="button"
              disabled={uploading}
              onClick={acceptCompressed}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {t("acceptUpload")}
            </button>
            <button
              type="button"
              disabled={uploading}
              onClick={cancelPreview}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 transition-colors text-sm disabled:opacity-50"
            >
              <RotateCcw size={14} />
              {t("cancel")}
            </button>
          </div>
        </div>
        {error && <p className="text-accent text-xs mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm text-white/50 mb-1.5">{label}</label>

      {/* Current value or preview */}
      {value && (
        <div className="mb-2 flex items-center gap-2">
          {(value.match(/\.(jpe?g|png|gif|webp|svg|mp4|webm|ogg)$/i) || value.startsWith("/uploads/")) ? (
            <div className="relative group shrink-0">
              <div className="w-20 h-14 rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                {resolvedValue ? (
                  value.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video src={resolvedValue} muted className="w-full h-full object-cover" />
                  ) : (
                    <img src={resolvedValue} alt="" className="w-full h-full object-cover" />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={16} className="text-white/30" />
                  </div>
                )}
              </div>
            </div>
          ) : null}
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className={`${inputClass} flex-1`}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-2 rounded-lg hover:bg-accent/10 text-white/40 hover:text-accent transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Drop zone */}
      {!value && (
        <div
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
            dragOver
              ? "border-primary/60 bg-primary/5"
              : "border-white/15 hover:border-white/30 bg-white/[0.02]"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={24} className="text-primary animate-spin" />
              <span className="text-sm text-white/40">{t("uploading")}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload size={24} className="text-white/30" />
              <span className="text-sm text-white/40">{t("dropOrClick")}</span>
              <span className="text-xs text-white/20">{t("maxFileSize")}</span>
            </div>
          )}
        </div>
      )}

      {/* URL input when no file uploaded */}
      {!value && !uploading && (
        <div className="mt-2">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t("orPasteUrl")}
            className={inputClass}
          />
        </div>
      )}

      {error && (
        <p className="text-accent text-xs mt-1">{error}</p>
      )}

      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
