interface SeoSnippetPreviewProps {
  title: string;
  description: string;
  url: string;
}

export default function SeoSnippetPreview({ title, description, url }: SeoSnippetPreviewProps) {
  const titleLen = title.length;
  const descLen = description.length;

  return (
    <div className="glass rounded-xl p-4 space-y-1 border border-white/5">
      <p className="text-xs text-white/30 mb-2 font-medium uppercase tracking-wider">Google Search Preview</p>
      <p className="text-xs text-green-400/70 truncate">{url || "https://kanon.app/"}</p>
      <p className={`text-base font-medium truncate ${titleLen > 60 ? "text-orange-400" : "text-[#8ab4f8]"}`}>
        {title || "Page Title"}
      </p>
      <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">
        {description || "Page description will appear here…"}
      </p>
      <div className="flex gap-4 pt-1.5">
        <span className={`text-xs ${titleLen > 60 ? "text-orange-400" : "text-white/25"}`}>
          Title: {titleLen}/60
        </span>
        <span className={`text-xs ${descLen > 160 ? "text-orange-400" : "text-white/25"}`}>
          Description: {descLen}/160
        </span>
      </div>
    </div>
  );
}
