import { useAssetUrl } from "../hooks/useAssetUrl";

interface BackgroundProps {
  url?: string;
  overlay?: boolean;
}

function isVideo(path?: string): boolean {
  return !!path?.match(/\.(mp4|webm|ogg)$/i);
}

export default function Background({ url, overlay = true }: BackgroundProps) {
  const resolved = useAssetUrl(url);
  return (
    <div className="fixed inset-0 -z-10">
      {resolved ? (
        <>
          {isVideo(url) ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={resolved} />
            </video>
          ) : (
            <img
              src={resolved}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {overlay && (
            <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/60 to-navy/90" />
          )}
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#1a1a2e] to-navy" />
      )}
    </div>
  );
}
