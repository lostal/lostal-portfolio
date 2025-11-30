"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const projects = [
  { id: 'parking_gruposiete', src: '/projects/parking_gruposiete.png' },
  { id: 'vivenza_redesign', src: '/projects/vivenza_redesign.png' },
  { id: 'creative_hands', src: '/projects/creative_hands.png' },
];

export default function ProjectPreview() {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isSafeZone, setIsSafeZone] = useState(false);

  useEffect(() => {
    const preview = document.getElementById("project-preview");
    const cursor = document.getElementById("cursor");

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const projectItem = target.closest(".project-item");

      if (projectItem) {
        // 1. Determine if we are in the "Safe Zone" (Right side of the card)
        const safeZoneEl = projectItem.querySelector(".safe-hover-zone");
        let safe = false;

        if (safeZoneEl) {
          const rect = safeZoneEl.getBoundingClientRect();
          // If mouse X is to the right of the safe zone's left edge, we are safe
          if (e.clientX >= rect.left) {
            safe = true;
          }
        }

        // Only update state if changed to prevent re-renders
        setIsSafeZone(prev => (prev !== safe ? safe : prev));

        // 2. Handle Cursor Visibility
        if (cursor) {
          cursor.style.opacity = safe ? "1" : "0";
        }

        // 3. Show/Update Preview if not safe
        const imageSrc = projectItem.getAttribute("data-image");
        if (imageSrc && imageSrc !== activeImage) setActiveImage(imageSrc);

        setIsVisible(true);

        // 4. Move Preview
        if (preview) {
          preview.style.left = e.clientX + "px";
          preview.style.top = e.clientY + "px";
        }

      } else {
        // Not hovering a project
        setIsVisible(false);
        setActiveImage(null);
        setIsSafeZone(false);
        if (cursor) cursor.style.opacity = "1";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      // Cleanup: ensure cursor is visible if component unmounts
      if (cursor) cursor.style.opacity = "1";
    };
  }, [activeImage]);

  return (
    <div
      id="project-preview"
      className="fixed pointer-events-none z-50 w-[300px] h-[200px] overflow-hidden rounded-lg transition-opacity duration-300 ease-out"
      style={{
        opacity: isVisible && !isSafeZone ? 1 : 0,
        transform: "translate(-50%, -50%) rotate(-5deg)"
      }}
    >
      {projects.map((p) => (
        <div
          key={p.id}
          className={`absolute inset-0 transition-opacity duration-300 ${activeImage === p.id ? "opacity-100" : "opacity-0"
            }`}
        >
          <Image
            src={p.src}
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
      ))}
    </div>
  );
}
