"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Props {
  /** Primary accent hex — colours the particle field and glow. */
  accent?: string;
  /** Secondary accent hex for depth variation. */
  secondary?: string;
}

/**
 * Fixed, full-viewport ambient particle field used on inner pages so every
 * route shares the homepage's living-space feel. Also arms the [data-reveal]
 * scroll animations for the page it sits on.
 */
export default function AmbientBackground({
  accent = "#5b8cff",
  secondary = "#9d7bff",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scroll reveals for the page content.
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries)
          if (en.isIntersecting) {
            en.target.classList.add("in-view");
            io.unobserve(en.target);
          }
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

    let renderer: THREE.WebGLRenderer | null = null;
    let raf = 0;
    let geo: THREE.BufferGeometry | null = null;
    let mat: THREE.PointsMaterial | null = null;
    let sprite: THREE.CanvasTexture | null = null;
    const pointer = { x: 0, y: 0 };
    const pointerS = { x: 0, y: 0 };

    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onResize = () => {
      if (!renderer) return;
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 13;

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      canvasWrapRef.current!.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const count = window.innerWidth < 768 ? 450 : 1000;
      const pos = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const a = new THREE.Color(accent);
      const b = new THREE.Color(secondary);
      const c = new THREE.Color();
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 38;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
        pos[i * 3 + 2] = -Math.random() * 26 + 6;
        c.copy(a).lerp(b, Math.random());
        if (Math.random() < 0.05) c.set("#f2f6ff");
        const mul = 0.35 + Math.random() * 0.65;
        colors[i * 3] = c.r * mul;
        colors[i * 3 + 1] = c.g * mul;
        colors[i * 3 + 2] = c.b * mul;
      }
      geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const spriteCanvas = document.createElement("canvas");
      spriteCanvas.width = spriteCanvas.height = 64;
      const ctx = spriteCanvas.getContext("2d")!;
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.4, "rgba(255,255,255,0.4)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      sprite = new THREE.CanvasTexture(spriteCanvas);

      mat = new THREE.PointsMaterial({
        size: 0.28,
        map: sprite,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(geo, mat);
      points.frustumCulled = false;
      scene.add(points);

      onResize();
      if (canvasWrapRef.current) canvasWrapRef.current.style.opacity = "1";

      const clock = new THREE.Clock();
      const tick = () => {
        raf = requestAnimationFrame(tick);
        const t = clock.getElapsedTime();
        pointerS.x += (pointer.x - pointerS.x) * 0.04;
        pointerS.y += (pointer.y - pointerS.y) * 0.04;
        points.rotation.y = (reduced ? 0 : Math.sin(t * 0.05) * 0.08) + pointerS.x * 0.06;
        points.rotation.x = pointerS.y * 0.04;
        points.position.y = reduced ? 0 : Math.sin(t * 0.1) * 0.4;
        renderer!.render(scene, camera);
      };
      tick();

      window.addEventListener("resize", onResize);
      window.addEventListener("pointermove", onPointer, { passive: true });
    } catch {
      // WebGL unavailable — gradient backdrop stands in.
    }

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      geo?.dispose();
      mat?.dispose();
      sprite?.dispose();
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
      }
    };
  }, [accent, secondary]);

  return (
    <div ref={wrapRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 75% 55% at 50% -10%, ${accent}2e, transparent 60%), radial-gradient(ellipse 55% 45% at 85% 110%, ${secondary}1f, transparent 60%)`,
        }}
      />
      <div
        ref={canvasWrapRef}
        className="absolute inset-0 opacity-0 transition-opacity duration-1000"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, rgba(4,6,12,0.55) 100%)",
        }}
      />
    </div>
  );
}
