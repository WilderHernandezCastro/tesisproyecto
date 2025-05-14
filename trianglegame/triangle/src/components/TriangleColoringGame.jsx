"use client";

import { useRef, useEffect, useState } from "react";
import { Paintbrush, RefreshCw } from "lucide-react";
import Confetti from 'react-confetti';

export default function TriangleColoringGame() {
  const canvasRef = useRef(null);
  const [currentColor, setCurrentColor] = useState("#FF5733");
  const [isDrawing, setIsDrawing] = useState(false);
  const [isTriangleColored, setIsTriangleColored] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const centerPoint = { x: 200, y: 200 };
  const radius = 150;

  const originalTriangle = [
    { x: 200, y: 50 },
    { x: 350, y: 275 },
    { x: 50, y: 275 },
  ];

  const originalSquare = [
    { x: 100, y: 100 },
    { x: 300, y: 100 },
    { x: 300, y: 300 },
    { x: 100, y: 300 },
  ];

  const [trianglePoints, setTrianglePoints] = useState(originalTriangle);
  const [squarePoints, setSquarePoints] = useState(originalSquare);

  const colors = ["#FF5733", "#33FF57", "#3357FF", "#FFFF33", "#FF33FF", "#33FFFF"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    generateRandomRotation();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const rotatePoint = (point, center, angle) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = point.x - center.x;
    const y = point.y - center.y;
    return {
      x: x * cos - y * sin + center.x,
      y: x * sin + y * cos + center.y,
    };
  };

  const generateRandomRotation = () => {
    const randomAngle = Math.random() * 2 * Math.PI;
    setRotation(randomAngle);

    const rotatedTriangle = originalTriangle.map((point) => rotatePoint(point, centerPoint, randomAngle));
    const rotatedSquare = originalSquare.map((point) => rotatePoint(point, centerPoint, randomAngle));

    setTrianglePoints(rotatedTriangle);
    setSquarePoints(rotatedSquare);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawShapes(ctx, rotatedTriangle, rotatedSquare);
    setIsTriangleColored(false);
  };

  const drawShapes = (ctx, trianglePoints, squarePoints) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.beginPath();
    ctx.arc(centerPoint.x, centerPoint.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(trianglePoints[0].x, trianglePoints[0].y);
    ctx.lineTo(trianglePoints[1].x, trianglePoints[1].y);
    ctx.lineTo(trianglePoints[2].x, trianglePoints[2].y);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(squarePoints[0].x, squarePoints[0].y);
    ctx.lineTo(squarePoints[1].x, squarePoints[1].y);
    ctx.lineTo(squarePoints[2].x, squarePoints[2].y);
    ctx.lineTo(squarePoints[3].x, squarePoints[3].y);
    ctx.closePath();
    ctx.stroke();
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isPointInTriangle(x, y)) {
      ctx.fillStyle = currentColor;
      ctx.beginPath();
      ctx.moveTo(trianglePoints[0].x, trianglePoints[0].y);
      ctx.lineTo(trianglePoints[1].x, trianglePoints[1].y);
      ctx.lineTo(trianglePoints[2].x, trianglePoints[2].y);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();

      setIsTriangleColored(true);
      setShowConfetti(true);
      // Ocultar el confeti después de 5 segundos
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  };

  const isPointInTriangle = (x, y) => {
    const [v1, v2, v3] = trianglePoints;

    const area = Math.abs((v1.x * (v2.y - v3.y) + v2.x * (v3.y - v1.y) + v3.x * (v1.y - v2.y)) / 2);
    const area1 = Math.abs((x * (v2.y - v3.y) + v2.x * (v3.y - y) + v3.x * (y - v2.y)) / 2);
    const area2 = Math.abs((v1.x * (y - v3.y) + x * (v3.y - v1.y) + v3.x * (v1.y - y)) / 2);
    const area3 = Math.abs((v1.x * (v2.y - y) + v2.x * (y - v1.y) + x * (v1.y - v2.y)) / 2);

    return Math.abs(area - (area1 + area2 + area3)) < 0.1;
  };

  const startNewGame = () => {
    generateRandomRotation();
  };

  return (
    <div className="flex flex-col items-center">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      <div className="mb-4 flex space-x-2">
        {colors.map((color) => (
          <button
            key={color}
            className="w-8 h-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            style={{ backgroundColor: color }}
            onClick={() => setCurrentColor(color)}
            aria-label={`Color ${color}`}
          />
        ))}
      </div>

      <div className="relative border border-gray-300 rounded-lg overflow-hidden shadow-lg">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
          className="bg-white cursor-pointer"
        />
      </div>

      <div className="mt-4 flex space-x-4">
        <button 
          onClick={startNewGame} 
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Nuevo Juego
        </button>

        <button 
          disabled={!isTriangleColored}
          className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
            isTriangleColored 
              ? 'border-green-500 text-green-700 bg-green-50 hover:bg-green-100'
              : 'border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
        >
          <Paintbrush className="mr-2 h-4 w-4" />
          {isTriangleColored ? "¡Triángulo coloreado!" : "Colorea el triángulo"}
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-600 max-w-md text-center">
        <p>
          Instrucciones: Selecciona un color y haz clic dentro del triángulo para colorearlo. Presiona "Nuevo Juego"
          para reiniciar con una nueva orientación de las figuras.
        </p>
      </div>
    </div>
  );
}
