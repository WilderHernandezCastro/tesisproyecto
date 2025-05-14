import { useState, useEffect, useCallback } from 'react';
import Confetti from 'react-confetti';
import './ColoringGame.css';

export default function ColoringGame() {
  const TOTAL_SQUARES = 5; // Cantidad fija de cuadrados
  const SQUARE_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD']; // Colores para los cuadrados
  const [shapes, setShapes] = useState([]);
  const [coloredIds, setColoredIds] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [targetSquares, setTargetSquares] = useState([]);

  const generateShapes = useCallback(() => {
    // Clear previous state
    setColoredIds([]);
    setGameComplete(false);

    const newShapes = [];
    const newTargetSquares = [];

    // Generate exactly TOTAL_SQUARES squares
    for (let i = 0; i < TOTAL_SQUARES; i++) {
      const squareId = `square-${i}`;
      newTargetSquares.push(squareId);
      newShapes.push({
        id: squareId,
        type: 'square',
        size: Math.floor(Math.random() * 40) + 30,
        x: Math.floor(Math.random() * 550),
        y: Math.floor(Math.random() * 250),
        rotation: Math.floor(Math.random() * 360),
        isTarget: true,
        colorIndex: i // Índice del color para este cuadrado
      });
    }

    // Generate other shapes (8-12 additional shapes)
    const shapeTypes = ['circle', 'triangle', 'oval', 'parallelogram'];
    const otherShapesCount = Math.floor(Math.random() * 5) + 8;

    for (let i = 0; i < otherShapesCount; i++) {
      const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      newShapes.push({
        id: `other-${i}`,
        type: shapeType,
        size: Math.floor(Math.random() * 40) + 30,
        x: Math.floor(Math.random() * 550),
        y: Math.floor(Math.random() * 250),
        rotation: Math.floor(Math.random() * 360),
        isTarget: false
      });
    }

    // Shuffle shapes to mix their render order
    const shuffledShapes = [...newShapes].sort(() => Math.random() - 0.5);
    setShapes(shuffledShapes);
    setTargetSquares(newTargetSquares);
  }, []);

  // Initialize the game
  useEffect(() => {
    generateShapes();
  }, [generateShapes]);

  // Check win condition
  useEffect(() => {
    if (coloredIds.length === TOTAL_SQUARES && coloredIds.every(id => targetSquares.includes(id))) {
      setGameComplete(true);
    } else {
      setGameComplete(false);
    }
  }, [coloredIds, targetSquares]);

  const handleShapeClick = (id, type, isTarget) => {
    if (gameComplete) return;

    // Only allow coloring target squares
    if (type === 'square' && isTarget) {
      if (coloredIds.includes(id)) {
        // Uncolor the square
        setColoredIds(prev => prev.filter(coloredId => coloredId !== id));
      } else {
        // Color the square
        setColoredIds(prev => [...prev, id]);
      }
    }
  };

  const renderShape = (shape) => {
    const isColored = coloredIds.includes(shape.id);
    const fill = isColored && shape.type === 'square' ? SQUARE_COLORS[shape.colorIndex] : 'transparent';
    const strokeWidth = 2;

    const baseStyle = {
      position: 'absolute',
      left: `${shape.x}px`,
      top: `${shape.y}px`,
      transform: `rotate(${shape.rotation}deg)`,
      cursor: shape.isTarget ? 'pointer' : 'default',
      transition: 'all 0.3s ease'
    };

    switch (shape.type) {
      case 'square':
        return (
          <div
            key={shape.id}
            onClick={() => handleShapeClick(shape.id, shape.type, shape.isTarget)}
            style={{
              ...baseStyle,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              border: `${strokeWidth}px solid black`,
              backgroundColor: fill
            }}
            data-type="square"
          />
        );
      case 'circle':
        return (
          <div
            key={shape.id}
            onClick={() => handleShapeClick(shape.id, shape.type, shape.isTarget)}
            style={{
              ...baseStyle,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              borderRadius: '50%',
              border: `${strokeWidth}px solid black`,
              backgroundColor: 'transparent'
            }}
            data-type="circle"
          />
        );
      case 'oval':
        return (
          <div
            key={shape.id}
            onClick={() => handleShapeClick(shape.id, shape.type, shape.isTarget)}
            style={{
              ...baseStyle,
              width: `${shape.size * 1.5}px`,
              height: `${shape.size}px`,
              borderRadius: '50%',
              border: `${strokeWidth}px solid black`,
              backgroundColor: 'transparent'
            }}
            data-type="oval"
          />
        );
      case 'triangle':
        return (
          <div
            key={shape.id}
            onClick={() => handleShapeClick(shape.id, shape.type, shape.isTarget)}
            style={{
              ...baseStyle,
              width: 0,
              height: 0,
              borderLeft: `${shape.size / 2}px solid transparent`,
              borderRight: `${shape.size / 2}px solid transparent`,
              borderBottom: `${shape.size}px solid black`,
              backgroundColor: 'transparent'
            }}
            data-type="triangle"
          />
        );
      case 'parallelogram':
        return (
          <div
            key={shape.id}
            onClick={() => handleShapeClick(shape.id, shape.type, shape.isTarget)}
            style={{
              ...baseStyle,
              width: `${shape.size * 1.5}px`,
              height: `${shape.size}px`,
              transform: `${baseStyle.transform} skewX(-20deg)`, // Inclinación para crear el paralelogramo
              border: `${strokeWidth}px solid black`,
              backgroundColor: 'transparent'
            }}
            data-type="parallelogram"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="game-container">
      {gameComplete && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      <h1 className="game-title">Pinta los cuadros</h1>

      <p className="game-description">
        Colorea solo los cuadros
      </p>

      <div className="game-board-container">
        <div className="game-board">
          {shapes.map(renderShape)}
        </div>

        <div className="game-footer">
          {/* Progreso */}
          <p className="game-progress">
            Cuadrados coloreados: {coloredIds.length} / {TOTAL_SQUARES}
          </p>

          {/* Mensaje de victoria */}
          {gameComplete && (
            <div className="game-message">
              <p >
                ¡Felicidades! Has encontrado y coloreado todos los cuadrados.
              </p>
            </div>
          )}

          {/* Botón de control */}
          <button
            onClick={generateShapes}
            className="game-button"
          >
            {gameComplete ? "Nuevo Juego" : "Reiniciar"}
          </button>
        </div>
      </div>
    </div>
  );
}