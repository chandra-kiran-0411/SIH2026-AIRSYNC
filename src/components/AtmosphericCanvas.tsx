'use client';

import React, { useEffect, useRef } from 'react';

export default function AtmosphericCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Streamline particles moving from North-West (top-left) to South-East (bottom-right)
    const particleCount = Math.min(Math.floor(width / 24), 65);
    const particles: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      thickness: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 25 + Math.random() * 45,
        speed: 0.35 + Math.random() * 0.7,
        opacity: 0.04 + Math.random() * 0.12,
        thickness: 0.6 + Math.random() * 0.8
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Angle: ~35 degrees (North-West to South-East flow)
      const angle = (35 * Math.PI) / 180;
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        ctx.beginPath();
        const startX = p.x;
        const startY = p.y;
        const endX = p.x + dx * p.length;
        const endY = p.y + dy * p.length;

        const grad = ctx.createLinearGradient(startX, startY, endX, endY);
        grad.addColorStop(0, `rgba(148, 163, 184, 0)`);
        grad.addColorStop(0.5, `rgba(186, 230, 253, ${p.opacity})`);
        grad.addColorStop(1, `rgba(148, 163, 184, 0)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = p.thickness;
        ctx.lineCap = 'round';
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Advance particle
        p.x += dx * p.speed;
        p.y += dy * p.speed;

        // Wrap around boundaries
        if (p.x > width + 50 || p.y > height + 50) {
          if (Math.random() > 0.5) {
            p.x = -50;
            p.y = Math.random() * height;
          } else {
            p.x = Math.random() * width;
            p.y = -50;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      aria-hidden="true"
    />
  );
}
