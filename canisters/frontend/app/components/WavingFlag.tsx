import { useEffect, useRef } from "react";

interface WavingFlagProps {
  src: string;
  alt?: string;
  className?: string;
  amplitude?: number;
  frequency?: number;
  speed?: number;
}

export default function WavingFlag({
  src,
  alt = "Flag",
  className = "",
  amplitude = 3,
  frequency = 0.1,
  speed = 0.1,
}: WavingFlagProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = src;

    let animationId: number;
    let time = 0;

    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      for (let x = 0; x < w; x++) {
        const currentAmplitude = amplitude * (x / w);
        const yOffset = Math.sin(x * frequency - time) * currentAmplitude;

        // Draw a 1px vertical slice, filling the full canvas height
        ctx.drawImage(
          img,
          x * (img.naturalWidth / w), 0,
          1 * (img.naturalWidth / w), img.naturalHeight,
          x, yOffset + amplitude, 1, h - amplitude * 2
        );
      }

      time += speed;
      animationId = requestAnimationFrame(animate);
    };

    img.onload = () => {
      updateCanvasSize();
      animate();
    };

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [src, amplitude, frequency, speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={alt}
      role="img"
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
