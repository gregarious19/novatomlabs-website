"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import * as THREE from "three";

export default function Hero() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    
    // We want the background to be transparent so the page background shows through
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Particles/Nodes
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;
      velocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02,
      });
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Dark/Light mode color adaption could be done via CSS vars, but for WebGL we'll use a dynamic blue
    // corresponding to Nova Blue #2F6BF0 and Electron #5B8CFF
    const material = new THREE.PointsMaterial({
      color: 0x2f6bf0,
      size: 0.1,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Lines connecting nearby nodes
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x5b8cff,
      transparent: true,
      opacity: 0.15,
    });
    
    // Create a dynamic line mesh (will update geometry in render loop)
    const lineGeometry = new THREE.BufferGeometry();
    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineMesh);

    camera.position.z = 10;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX) * 0.001;
      mouseY = (event.clientY - windowHalfY) * 0.001;
    };

    document.addEventListener("mousemove", onDocumentMouseMove);

    // Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      targetX = mouseX * 2;
      targetY = mouseY * 2;
      
      // Rotate scene slightly based on mouse
      scene.rotation.y += 0.05 * (targetX - scene.rotation.y);
      scene.rotation.x += 0.05 * (targetY - scene.rotation.x);

      // Move particles
      const positions = particles.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i].x;
        positions[i3 + 1] += velocities[i].y;
        positions[i3 + 2] += velocities[i].z;

        // Bounce off bounds
        if (positions[i3] < -10 || positions[i3] > 10) velocities[i].x *= -1;
        if (positions[i3 + 1] < -10 || positions[i3 + 1] > 10) velocities[i].y *= -1;
        if (positions[i3 + 2] < -10 || positions[i3 + 2] > 10) velocities[i].z *= -1;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Update connecting lines
      const linePositions = [];
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 2.5) {
            linePositions.push(
              positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
              positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
            );
          }
        }
      }
      
      lineMesh.geometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", onDocumentMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* 3D Canvas Container */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 z-0 opacity-40 dark:opacity-60 pointer-events-none"
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-16">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-nova-blue/30 bg-nova-blue/5 backdrop-blur-sm text-nova-blue text-sm font-medium mb-8 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-nova-blue animate-pulse" />
          NexusLabs is now NovAtom Labs
        </div>
        
        <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-8 animate-fade-in-up delay-100">
          A research lab that <br />
          <span className="italic font-serif text-nova-blue font-normal">thinks, simulates,</span><br />
          and <span className="italic font-serif text-nova-blue font-normal">discovers</span> — 24/7.
        </h1>
        
        <p className="text-lg md:text-xl text-ink/70 dark:text-paper/70 max-w-3xl mx-auto mb-10 animate-fade-in-up delay-200 leading-relaxed">
          NovAtom Labs deploys autonomous discovery loops that hypothesise, simulate, validate, and learn — continuously, across scientific domains. One architecture. Many frontiers.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
          <Link 
            href="/products"
            className="px-8 py-4 rounded-full bg-nova-blue text-white font-semibold transition-all hover:scale-105 hover:bg-electron hover:shadow-[0_0_20px_rgba(47,107,240,0.4)] w-full sm:w-auto"
          >
            See NexCon-03
          </Link>
          <Link 
            href="/technology"
            className="px-8 py-4 rounded-full border border-ink/20 dark:border-paper/20 text-ink dark:text-paper font-semibold transition-all hover:scale-105 hover:bg-ink/5 dark:hover:bg-paper/5 w-full sm:w-auto"
          >
            View Architecture
          </Link>
        </div>

        {/* Telemetry Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-24 text-left animate-fade-in-up delay-500">
          <div className="p-4 rounded-2xl glass-dark">
            <div className="font-mono text-xs text-ink/50 dark:text-paper/50 mb-2">// uptime</div>
            <div className="text-2xl font-bold font-heading mb-1">24 / 7</div>
            <div className="text-sm text-ink/70 dark:text-paper/70">Autonomous operation</div>
          </div>
          <div className="p-4 rounded-2xl glass-dark">
            <div className="font-mono text-xs text-ink/50 dark:text-paper/50 mb-2">// throughput</div>
            <div className="text-2xl font-bold font-heading mb-1">10<sup className="text-sm">6</sup>/day</div>
            <div className="text-sm text-ink/70 dark:text-paper/70">Candidate structures</div>
          </div>
          <div className="p-4 rounded-2xl glass-dark">
            <div className="font-mono text-xs text-ink/50 dark:text-paper/50 mb-2">// loop</div>
            <div className="text-2xl font-bold font-heading mb-1">LLM → LQM</div>
            <div className="text-sm text-ink/70 dark:text-paper/70">Hypothesise · simulate · learn</div>
          </div>
          <div className="p-4 rounded-2xl glass-dark">
            <div className="font-mono text-xs text-ink/50 dark:text-paper/50 mb-2">// domain-1</div>
            <div className="text-2xl font-bold font-heading mb-1">NexCon-03</div>
            <div className="text-sm text-ink/70 dark:text-paper/70">Semiconductors · LIVE</div>
          </div>
        </div>
      </div>
    </section>
  );
}
