import { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import './HexagonPatternGame.css';

export default function HexagonPatternGame() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

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

  const shuffleHexagons = () => {
    const model = { filled: true };
    const others = [
      { filled: false, size: 'large' },
      { filled: false, size: 'small' },
      { filled: false, size: 'large' },
      { filled: false, size: 'small' },
      { filled: false, size: 'large' },
      { filled: false, size: 'small' }
    ];

    for (let i = others.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [others[i], others[j]] = [others[j], others[i]];
    }

    return [model, ...others];
  };

  const [hexagons, setHexagons] = useState(shuffleHexagons());
  const [hasWon, setHasWon] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const toggleHexagon = (index) => {
    if (index > 0) {
      const newHexagons = [...hexagons];
      newHexagons[index].filled = !newHexagons[index].filled;
      setHexagons(newHexagons);
      setAttempts(attempts + 1);
      checkWin(newHexagons);
    }
  };

  const checkWin = (currentHexagons) => {
    const largeHexagons = currentHexagons.filter((hex, index) =>
      index === 0 || (index > 0 && currentHexagons[index].size === 'large')
    );
    const smallHexagons = currentHexagons.filter((hex, index) =>
      index > 0 && currentHexagons[index].size === 'small'
    );

    const allLargeMatch = largeHexagons.every(hex => hex.filled === true);
    const allSmallEmpty = smallHexagons.every(hex => hex.filled === false);

    setHasWon(allLargeMatch && allSmallEmpty);
  };

  const resetGame = () => {
    setHexagons(shuffleHexagons());
    setHasWon(false);
    setAttempts(0);
  };

  return (
    <div className="game-container">
      {hasWon && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={200}
          recycle={false}
          colors={['#f44336', '#2196f3', '#4caf50', '#ff9800', '#9c27b0']}
        />
      )}

      <h1 className="game-title">Juego de Longitudes</h1>

      <p className="game-instructions">
        Haz clic en las figuras que son iguales que la primera.
      </p>

      <div className="hexagons-container">
        {hexagons.map((hexagon, index) => (
          <div
            key={index}
            className={`hexagon-wrapper ${index === 0 ? 'model-hexagon' : ''}`}
          >
            <svg
              width={hexagon.size === 'small' ? "60" : "55"}
              height={hexagon.size === 'small' ? "40" : "50"}
              viewBox="0 0 60 50"
              onClick={() => toggleHexagon(index)}
              className="hexagon"
            >
              <polygon
                points="15,5 45,5 55,25 45,45 15,45 5,25"
                stroke="black"
                strokeWidth="3"
                fill={index === 0 ? "transparent" : (hexagon.filled ? "black" : "white")}
              />
            </svg>
          </div>
        ))}
      </div>

      <div>
        <p className="attempts-counter">Intentos: {attempts}</p>
        {hasWon && (
          <div className="win-message">
            ¡Felicidades! Has completado el patrón correctamente.
          </div>
        )}
        <button onClick={resetGame} className="reset-button">
          Reiniciar Juego
        </button>
      </div>
    </div>
  );
}