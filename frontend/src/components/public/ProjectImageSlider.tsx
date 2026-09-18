"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { asset } from "@/lib/api";

export function ProjectImageSlider({
  title,
  imageUrl,
  imageUrl2,
}: {
  title: string;
  imageUrl: string;
  imageUrl2?: string;
}) {
  const images = useMemo(
    () => [imageUrl, imageUrl2].filter(Boolean) as string[],
    [imageUrl, imageUrl2]
  );

  const activeRef = useRef(0);
  const [display, setDisplay] = useState<{
    active: number;
    prev: number | null;
    reveal: boolean;
  }>({ active: 0, prev: null, reveal: false });

  const transitioning = display.prev !== null;

  useEffect(() => {
    if (images.length < 2) return;

    const advance = () => {
      const next = (activeRef.current + 1) % images.length;
      activeRef.current = next;
      const prev = next === 0 ? images.length - 1 : next - 1;

      setDisplay({ active: next, prev, reveal: false });

      requestAnimationFrame(() => {
        setDisplay((s) =>
          s.prev === prev ? { ...s, reveal: true } : s
        );
      });

      window.setTimeout(() => {
        setDisplay((s) =>
          s.active === next ? { active: next, prev: null, reveal: false } : s
        );
      }, 1000);
    };

    const timer = window.setInterval(advance, 5000);
    return () => window.clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative h-56 w-full overflow-hidden bg-[#071b3f]">
      {images.length > 1 && transitioning && (
        <div
          className="absolute inset-0"
          style={{
            zIndex: 1,
            opacity: display.reveal ? 0 : 1,
            transform: display.reveal ? "scale(1.08)" : "scale(1)",
            transition: "opacity 1s ease-out, transform 1s ease-out",
          }}
        >
          <img
            src={asset(images[display.prev!])}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div
        className="absolute inset-0"
        style={{
          zIndex: 2,
          clipPath:
            transitioning && !display.reveal
              ? "inset(0 100% 0 0)"
              : "inset(0 0% 0 0)",
          transition: transitioning ? "clip-path 1s ease-out" : "none",
        }}
      >
        <div
          className="h-full w-full"
          style={{
            animation:
              !transitioning
                ? "ken-burns-zoom 5s ease-in-out forwards"
                : "none",
          }}
        >
          <img
            src={asset(images[display.active])}
            alt={`${title} project image ${display.active + 1}`}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {transitioning && (
        <div
          className="absolute top-0 bottom-0 w-[3px] pointer-events-none"
          style={{
            zIndex: 3,
            background:
              "linear-gradient(180deg, transparent, #D4AF37 25%, #D4AF37 75%, transparent)",
            boxShadow:
              "0 0 10px rgba(212,175,55,0.6), 0 0 30px rgba(212,175,55,0.2)",
            animation: "gold-wipe-line 1s ease-out forwards",
          }}
        />
      )}

      <div
        className="absolute inset-0 bg-gradient-to-t from-[#071b3f]/35 to-transparent pointer-events-none"
        style={{ zIndex: 4 }}
      />

      {images.length > 1 ? (
        <div
          className="absolute bottom-3 right-3 flex gap-1.5"
          style={{ zIndex: 5 }}
        >
          {images.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                display.active === index ? "bg-[#d6a842]" : "bg-white/60"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
