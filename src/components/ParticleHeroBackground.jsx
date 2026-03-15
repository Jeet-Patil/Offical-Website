import { useEffect, useRef } from 'react';

const MOBILE_PARTICLE_COUNT = 80;
const DESKTOP_PARTICLE_COUNT = 170;
const BASE_SPEED_MIN = 0.08;
const BASE_SPEED_MAX = 0.28;
const INFLUENCE_RADIUS = 180;
const INFLUENCE_RADIUS_SQ = INFLUENCE_RADIUS * INFLUENCE_RADIUS;
const CLUSTER_FORCE = 0.035;
const DAMPING = 0.94;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function createParticle(width, height) {
  const angle = Math.random() * Math.PI * 2;
  const speed = randomBetween(BASE_SPEED_MIN, BASE_SPEED_MAX);
  const driftX = Math.cos(angle) * speed;
  const driftY = Math.sin(angle) * speed;

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: driftX,
    vy: driftY,
    driftX,
    driftY,
    radius: randomBetween(0.8, 1.8),
    alpha: randomBetween(0.18, 0.4),
    glow: randomBetween(0.2, 0.55),
    hueShift: Math.random() * 18,
  };
}

export default function ParticleHeroBackground() {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const particlesRef = useRef([]);
  const pointerRef = useRef({ x: 0, y: 0, active: false, energy: 0 });
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext('2d', { alpha: true });
    const host = canvas.parentElement;

    if (!context || !host) {
      return undefined;
    }

    const setCanvasSize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const count = width < 768 ? MOBILE_PARTICLE_COUNT : DESKTOP_PARTICLE_COUNT;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      sizeRef.current = { width, height, dpr };

      particlesRef.current = Array.from({ length: count }, () => createParticle(width, height));
    };

    const updatePointer = (clientX, clientY) => {
      const rect = host.getBoundingClientRect();
      pointerRef.current.x = clientX - rect.left;
      pointerRef.current.y = clientY - rect.top;
      pointerRef.current.active = true;
      pointerRef.current.energy = 1;
    };

    const handleMouseMove = (event) => {
      updatePointer(event.clientX, event.clientY);
    };

    const handleTouchMove = (event) => {
      const touch = event.touches[0];

      if (touch) {
        updatePointer(touch.clientX, touch.clientY);
      }
    };

    const handleLeave = () => {
      pointerRef.current.active = false;
    };

    const draw = () => {
      const { width, height } = sizeRef.current;
      const pointer = pointerRef.current;
      const particles = particlesRef.current;

      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        if (pointer.active) {
          const dx = pointer.x - particle.x;
          const dy = pointer.y - particle.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < INFLUENCE_RADIUS_SQ && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const falloff = 1 - dist / INFLUENCE_RADIUS;
            const pull = falloff * falloff * CLUSTER_FORCE * pointer.energy;

            particle.vx += (dx / dist) * pull;
            particle.vy += (dy / dist) * pull;
          }
        }

        particle.vx += (particle.driftX - particle.vx) * (1 - DAMPING);
        particle.vy += (particle.driftY - particle.vy) * (1 - DAMPING);
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -16) particle.x = width + 16;
        if (particle.x > width + 16) particle.x = -16;
        if (particle.y < -16) particle.y = height + 16;
        if (particle.y > height + 16) particle.y = -16;

        let intensity = 0;
        if (pointer.active) {
          const dx = pointer.x - particle.x;
          const dy = pointer.y - particle.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < INFLUENCE_RADIUS_SQ) {
            const dist = Math.sqrt(distSq);
            intensity = 1 - dist / INFLUENCE_RADIUS;
          }
        }

        const glowStrength = intensity * intensity;
        const radius = particle.radius + glowStrength * 2.1;
        const alpha = particle.alpha + glowStrength * 0.45;
        const red = 135 + particle.hueShift + glowStrength * 95;
        const green = 18 + glowStrength * 38;
        const blue = 24 + glowStrength * 24;

        context.beginPath();
        context.arc(particle.x, particle.y, radius + glowStrength * 5, 0, Math.PI * 2);
        context.fillStyle = `rgba(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)}, ${0.04 + glowStrength * 0.18})`;
        context.fill();

        context.beginPath();
        context.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)}, ${alpha})`;
        context.fill();
      }

      pointer.energy += ((pointer.active ? 1 : 0) - pointer.energy) * 0.06;

      frameRef.current = window.requestAnimationFrame(draw);
    };

    setCanvasSize();

    const resizeObserver = new ResizeObserver(() => {
      setCanvasSize();
    });

    resizeObserver.observe(host);
    host.addEventListener('mousemove', handleMouseMove);
    host.addEventListener('mouseleave', handleLeave);
    host.addEventListener('touchmove', handleTouchMove, { passive: true });
    host.addEventListener('touchend', handleLeave);
    host.addEventListener('touchcancel', handleLeave);

    frameRef.current = window.requestAnimationFrame(draw);

    return () => {
      resizeObserver.disconnect();
      host.removeEventListener('mousemove', handleMouseMove);
      host.removeEventListener('mouseleave', handleLeave);
      host.removeEventListener('touchmove', handleTouchMove);
      host.removeEventListener('touchend', handleLeave);
      host.removeEventListener('touchcancel', handleLeave);

      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />;
}