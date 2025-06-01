import React, { useState, useEffect, useRef } from 'react';
//import ReactConfetti from 'react-confetti';
import './HexagonPatternGame.css';
import axios from 'axios';
//juego longitudes
function Lengths() {
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
    const [successCount, setSuccessCount] = useState(0);
    const [failCount, setFailCount] = useState(0);
    const [time, setTime] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!hasWon) {
            timerRef.current = setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [hasWon]);

    const toggleHexagon = (index) => {
        if (index > 0 && !hasWon) {
            const newHexagons = [...hexagons];
            newHexagons[index].filled = !newHexagons[index].filled;
            setHexagons(newHexagons);
        }
    };

    const validateSelection = () => {
        const newAttempts = attempts + 1;
        let newSuccessCount = successCount;
        let newFailCount = failCount;

        const largeHexagons = hexagons.filter((hex, index) =>
            index === 0 || (index > 0 && hex.size === 'large')
        );
        const smallHexagons = hexagons.filter((hex, index) =>
            index > 0 && hex.size === 'small'
        );

        const allLargeMatch = largeHexagons.every(hex => hex.filled === true);
        const allSmallEmpty = smallHexagons.every(hex => hex.filled === false);

        if (allLargeMatch && allSmallEmpty) {
            setHasWon(true);
            newSuccessCount = successCount + 1;
            setSuccessCount(newSuccessCount);
        } else {
            newFailCount = failCount + 1;
            setFailCount(newFailCount);
        }
        setAttempts(newAttempts);

        // Envía los datos al backend
        sendStats(newAttempts, newSuccessCount, newFailCount, time);
    };

    const resetGame = () => {
        setHexagons(shuffleHexagons());
        setHasWon(false);
        setAttempts(0);
        setSuccessCount(0);
        setFailCount(0);
        setTime(0);
    };

    const speakWelcome = () => {
        const audio = new Audio(require("../audio/juegodelongitudes.mp3"));
        audio.play();
    };

    const sendStats = async (newAttempts, newSuccessCount, newFailCount, newTime) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user ? user.accessToken : null;

        const data = {
            juego: {
                id: 1,
                nombre: "Juego de Longitudes",

            },

            cantidadErrores: newFailCount,
            cantidadIntentos: newAttempts,
            tiempoSegundos: newTime,
            aciertos: newSuccessCount
        };

        console.log("Datos enviados al backend:", data);
        console.log("Token enviado:", token);

        try {
            await axios.post(
                'http://localhost:8080/api/partidas',
                data,
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined
                    }
                }
            );
        } catch (error) {
            console.error('Error enviando contadores:', error);
        }
    };

    return (
        <div className="game-container" style={{ position: "relative" }}>
            {/* <img
                src={require("../images/leon.png")}
                alt="León"
                onClick={speakWelcome}
                className="lengths-leon-img"
            /> */}

            <h1 className="game-title">Juego de Longitudes</h1>

            <p className="game-instructions">
                Haz clic en las figuras que son iguales que la primera. Luego presiona "Validar".
            </p>

            <div className="flex items-center justify-center gap-4 mb-2">
                <span>Intentos: <span className="font-bold">{attempts}</span></span>
                <span>Tiempo: <span className="font-bold">{time}s</span></span>
                <span>Aciertos: <span className="font-bold text-green-600">{successCount}</span></span>
                <span>Errores: <span className="font-bold text-red-600">{failCount}</span></span>
            </div>

            <div className="hexagons-container">
                {/* Figura modelo encerrada en un cuadrado azul */}
                <div className="model-hexagon-box">
                    <div className="hexagon-wrapper model-hexagon">
                        <svg
                            width="55"
                            height="50"
                            viewBox="0 0 60 50"
                            className="hexagon"
                        >
                            <polygon
                                points="15,5 45,5 55,25 45,45 15,45 5,25"
                                stroke="black"
                                strokeWidth="3"
                                fill="transparent"
                            />
                        </svg>
                    </div>
                </div>
                {/* Las demás figuras */}
                {hexagons.slice(1).map((hexagon, index) => (
                    <div
                        key={index + 1}
                        className="hexagon-wrapper"
                    >
                        <svg
                            width={hexagon.size === 'small' ? "60" : "55"}
                            height={hexagon.size === 'small' ? "40" : "50"}
                            viewBox="0 0 60 50"
                            onClick={() => toggleHexagon(index + 1)}
                            className="hexagon"
                        >
                            <polygon
                                points="15,5 45,5 55,25 45,45 15,45 5,25"
                                stroke="black"
                                strokeWidth="3"
                                fill={hexagon.filled ? "black" : "white"}
                            />
                        </svg>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: "2rem", marginTop: "1.5rem", alignItems: "center", justifyContent: "center" }}>
                <button onClick={validateSelection} className="reset-button" disabled={hasWon}>
                    Validar
                </button>
                <button onClick={resetGame} className="reset-button">
                    Reiniciar Juego
                </button>
                <img
                    src={require("../images/leon.png")}
                    alt="León"
                    onClick={speakWelcome}
                    className="lengths-leon-img"
                    style={{ margin: 0 }}
                />
            </div>

            {hasWon && (
                <div className="win-message">
                    ¡Felicidades! Has completado el patrón correctamente.
                </div>
            )}
        </div>
    );
}

export default Lengths;