import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../services/audioEngine';

export default function AudioVisualizer({ isPlaying, mode = 'bars', accentColor = '#f59e0b', height = 48 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const dataArray = new Uint8Array(64);

    const draw = () => {
      const width = (canvas.width = canvas.parentElement.clientWidth || 300);
      const h = (canvas.height = height);

      ctx.clearRect(0, 0, width, h);

      if (isPlaying) {
        audioEngine.getAnalyserData(dataArray);
      } else {
        dataArray.fill(4);
      }

      if (mode === 'bars') {
        const barWidth = (width / dataArray.length) * 1.5;
        let x = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const barHeight = (dataArray[i] / 255) * h;
          ctx.fillStyle = accentColor;
          ctx.fillRect(x, h - barHeight, barWidth - 1, barHeight);
          x += barWidth;
        }
      } else if (mode === 'waveform') {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = accentColor;
        const sliceWidth = width / dataArray.length;
        let x = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * h) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.stroke();
      } else if (mode === 'spectrum' || mode === 'circle') {
        const centerX = width / 2;
        const centerY = h / 2;
        const radius = Math.min(centerX, centerY) * 0.6;
        for (let i = 0; i < dataArray.length; i++) {
          const rad = (i / dataArray.length) * Math.PI * 2;
          const barLen = (dataArray[i] / 255) * 20;
          const x1 = centerX + Math.cos(rad) * radius;
          const y1 = centerY + Math.sin(rad) * radius;
          const x2 = centerX + Math.cos(rad) * (radius + barLen);
          const y2 = centerY + Math.sin(rad) * (radius + barLen);

          ctx.beginPath();
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 2;
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, mode, accentColor, height]);

  return (
    <div className="w-full overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
