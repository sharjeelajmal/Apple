"use client";

import { useEffect, useRef } from "react";
import type { VoicePhase } from "./voicePhase";

const WAVE_COLORS = [
  "--color-intelligence-blue",
  "--color-intelligence-purple",
  "--color-intelligence-pink",
  "--color-intelligence-coral",
  "--color-intelligence-orange",
];

const WAVES = WAVE_COLORS.map((_, index) => ({
  frequency: 2.2 + index * 0.55,
  speed: 0.9 + index * 0.35,
  offset: index * 1.3,
  weight: 1 - index * 0.12,
}));

const SAMPLE_STEP = 3;
const EASING = 0.12;

const targetAmplitude = (phase: VoicePhase, level: number, time: number) => {
  switch (phase) {
    case "listening":
      return 0.12 + Math.min(level, 1) * 0.95;
    case "speaking":
      return 0.45 + 0.25 * Math.sin(time * 5.3) * Math.sin(time * 2.1 + 1) + 0.15 * Math.sin(time * 11);
    case "thinking":
      return 0.2 + 0.08 * Math.sin(time * 3);
    default:
      return 0.04;
  }
};

const readColor = (variable: string) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

type IntelligenceWaveProps = {
  phase: VoicePhase;
  level: number;
};

export default function IntelligenceWave({ phase, level }: IntelligenceWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ phase, level });

  useEffect(() => {
    stateRef.current = { phase, level };
  }, [phase, level]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const colors = WAVE_COLORS.map(readColor);
    let amplitude = 0.04;
    let frame = 0;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * ratio;
      canvas.height = canvas.clientHeight * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (now: number) => {
      const time = now / 1000;
      const { phase: currentPhase, level: currentLevel } = stateRef.current;
      amplitude += (targetAmplitude(currentPhase, currentLevel, time) - amplitude) * EASING;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const middle = height / 2;
      const maxHeight = height * 0.42;
      const speedBoost = currentPhase === "thinking" ? 2.2 : 1;

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "source-over";

      WAVES.forEach((wave, index) => {
        context.beginPath();
        context.moveTo(0, middle);
        for (let x = 0; x <= width; x += SAMPLE_STEP) {
          const position = (x / width) * 2 - 1;
          const envelope = Math.exp(-position * position * 3.2);
          const y = Math.sin(position * wave.frequency * Math.PI + time * wave.speed * speedBoost + wave.offset);
          context.lineTo(x, middle - Math.abs(y) * envelope * amplitude * maxHeight * wave.weight);
        }
        for (let x = width; x >= 0; x -= SAMPLE_STEP) {
          const position = (x / width) * 2 - 1;
          const envelope = Math.exp(-position * position * 3.2);
          const y = Math.sin(position * wave.frequency * Math.PI + time * wave.speed * speedBoost + wave.offset);
          context.lineTo(x, middle + Math.abs(y) * envelope * amplitude * maxHeight * wave.weight * 0.85);
        }
        context.closePath();

        const gradient = context.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(0.5, colors[index]);
        gradient.addColorStop(1, "transparent");
        context.fillStyle = gradient;
        context.globalAlpha = 0.42;
        context.fill();
      });

      context.globalCompositeOperation = "source-over";
      context.globalAlpha = 0.9;
      const line = context.createLinearGradient(0, 0, width, 0);
      line.addColorStop(0, "transparent");
      line.addColorStop(0.35, colors[0]);
      line.addColorStop(0.65, colors[1]);
      line.addColorStop(1, "transparent");
      context.fillStyle = line;
      context.fillRect(0, middle - 0.75, width, 1.5);
      context.globalAlpha = 1;

      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="h-full w-full" />;
}
