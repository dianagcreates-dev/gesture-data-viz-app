"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

class Particle {
  constructor(x, y, size, color, dispersion, returnSpd, entranceScatter = 5) {
    // Particles start scattered around their target and spring into place —
    // entranceScatter controls how far the fly-in starts from (default is
    // the original subtle jitter).
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * entranceScatter;
    this.x = x + Math.cos(angle) * distance;
    this.y = y + Math.sin(angle) * distance;
    this.originX = x;
    this.originY = y;
    this.vx = (Math.random() - 0.5) * 5;
    this.vy = (Math.random() - 0.5) * 5;
    this.size = size;
    this.color = color;
    this.dispersion = dispersion;
    this.returnSpd = returnSpd;
  }

  update(mouseX, mouseY) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Physics interaction with mouse
    const interactionRadius = 120; // 120px interaction radius

    if (distance < interactionRadius && mouseX !== -1000 && mouseY !== -1000) {
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;

      const force = (interactionRadius - distance) / interactionRadius;

      // Calculate repulsion
      const repulsionX = forceDirectionX * force * this.dispersion;
      const repulsionY = forceDirectionY * force * this.dispersion;

      this.vx -= repulsionX;
      this.vy -= repulsionY;
    }

    // Return to origin (spring physics)
    this.vx += (this.originX - this.x) * this.returnSpd;
    this.vy += (this.originY - this.y) * this.returnSpd;

    // Friction
    this.vx *= 0.85;
    this.vy *= 0.85;

    // Add subtle noise/jitter when close to origin
    const distToOrigin = Math.sqrt(
      Math.pow(this.x - this.originX, 2) + Math.pow(this.y - this.originY, 2)
    );
    if (distToOrigin < 1 && Math.random() > 0.95) {
      this.vx += (Math.random() - 0.5) * 0.2;
      this.vy += (Math.random() - 0.5) * 0.2;
    }

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function CursorDrivenParticleTypography({
  className,
  text,
  fontSize = 120,
  fontFamily = "Inter, sans-serif",
  particleSize = 1.5,
  particleDensity = 6,
  dispersionStrength = 15,
  returnSpeed = 0.08,
  entranceScatter = 5,
  color,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId;
    let particles = [];

    let mouseX = -1000;
    let mouseY = -1000;

    let containerWidth = 0;
    let containerHeight = 0;

    const init = () => {
      const container = containerRef.current;
      if (!container) return;

      containerWidth = container.clientWidth;
      containerHeight = container.clientHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = containerWidth * dpr;
      canvas.height = containerHeight * dpr;
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;
      ctx.scale(dpr, dpr);

      // Keep the visible canvas untouched by fillText — sample the text
      // shape on an offscreen canvas instead, or the crisp text flashes on
      // screen for a frame before the particle loop takes over (this
      // matters because ResizeObserver fires its first callback almost
      // immediately, well before the startup delay below).
      const offscreen = document.createElement("canvas");
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const offCtx = offscreen.getContext("2d");
      offCtx.scale(dpr, dpr);

      // Determine text color
      const computedStyle = window.getComputedStyle(container);
      const textColor = color || computedStyle.color || "#000000";

      ctx.clearRect(0, 0, containerWidth, containerHeight);

      // Draw text to generate pixel map
      offCtx.fillStyle = textColor;
      // Responsive font size based on container width if text is large
      let effectiveFontSize = Math.min(fontSize, containerWidth * 0.15);
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";

      // Shrink further if the actual measured text is wider than the
      // container — the heuristic above doesn't know the text's real
      // width, so long phrases can otherwise render clipped off-canvas.
      offCtx.font = `bold ${effectiveFontSize}px ${fontFamily}`;
      const measuredWidth = offCtx.measureText(text).width;
      const maxWidth = containerWidth * 0.94;
      if (measuredWidth > maxWidth) {
        effectiveFontSize *= maxWidth / measuredWidth;
        offCtx.font = `bold ${effectiveFontSize}px ${fontFamily}`;
      }

      // Draw standard text first to measure it
      offCtx.fillText(text, containerWidth / 2, containerHeight / 2);

      // Get pixel data
      const textCoordinates = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
      particles = [];

      // Create particles from text pixels
      // Step by density multiplied by dpr
      const step = Math.max(1, Math.floor(particleDensity * dpr));
      for (let y = 0; y < textCoordinates.height; y += step) {
        for (let x = 0; x < textCoordinates.width; x += step) {
          const index = (y * textCoordinates.width + x) * 4;
          const alpha = textCoordinates.data[index + 3] || 0;

          if (alpha > 128) {
            particles.push(
              new Particle(
                x / dpr,
                y / dpr,
                particleSize,
                textColor,
                dispersionStrength,
                returnSpeed,
                entranceScatter
              )
            );
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, containerWidth, containerHeight);

      particles.forEach((particle) => {
        particle.update(mouseX, mouseY);
        particle.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const handleResize = () => {
      init();
    };

    // Initialize with a short delay to ensure fonts/layout are ready
    const timeoutId = setTimeout(() => {
      init();
      animate();
    }, 100);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Re-initialize particles when the theme changes (detects class changes on html tag)
    const themeObserver = new MutationObserver(() => {
      init();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const handleTouchStart = (e) => {
      if (!e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = e.touches[0].clientX - rect.left;
      mouseY = e.touches[0].clientY - rect.top;
    };
    const handleTouchMove = (e) => {
      if (!e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = e.touches[0].clientX - rect.left;
      mouseY = e.touches[0].clientY - rect.top;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleMouseLeave);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    text,
    fontSize,
    fontFamily,
    particleSize,
    particleDensity,
    dispersionStrength,
    returnSpeed,
    entranceScatter,
    color,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn("w-full h-full min-h-[400px] flex items-center justify-center relative touch-none", className)}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
