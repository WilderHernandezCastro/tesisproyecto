import React, { useState, useEffect, useCallback } from 'react';
//import Confetti from 'react-confetti';
import './Squeare.css';
import axios from 'axios';
//pinta los cuadros
function Squeare() {
    const TOTAL_SQUARES = 5;
    const SQUARE_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
    const SELECTED_OTHER_COLOR = '#ffe066'; // o el color que prefieras
    const [shapes, setShapes] = useState([]);
    const [coloredIds, setColoredIds] = useState([]);
    const [gameComplete, setGameComplete] = useState(false);
    const [targetSquares, setTargetSquares] = useState([]);
    const [attempts, setAttempts] = useState(0);
    const [successCount, setSuccessCount] = useState(0);
    const [failCount, setFailCount] = useState(0);
    const [validated, setValidated] = useState(false);
    const [validationSuccess, setValidationSuccess] = useState(false);
    const [time, setTime] = useState(0);
    const timerRef = React.useRef(null);

    const getRandomColor = () => {
        const palette = ['#ffe066', '#b2f5ea', '#fbbf24', '#f472b6', '#a3e635', '#f87171', '#60a5fa', '#facc15'];
        return palette[Math.floor(Math.random() * palette.length)];
    };

    const generateShapes = useCallback(() => {
        setColoredIds([]);
        setGameComplete(false);
        setValidated(false);
        setValidationSuccess(false);
        setTime(0); // Reinicia el tiempo

        const newShapes = [];
        const newTargetSquares = [];

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
                colorIndex: i
            });
        }

        const shapeTypes = ['circle', 'hexagon', 'pentagon', 'oval', 'parallelogram'];
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
                isTarget: false,
                otherColor: getRandomColor()
            });
        }

        const shuffledShapes = [...newShapes].sort(() => Math.random() - 0.5);
        setShapes(shuffledShapes);
        setTargetSquares(newTargetSquares);
    }, []);

    useEffect(() => {
        generateShapes();
    }, [generateShapes]);

    const handleShapeClick = (id) => {
        if (gameComplete) return;
        if (coloredIds.includes(id)) {
            setColoredIds(prev => prev.filter(coloredId => coloredId !== id));
        } else {
            setColoredIds(prev => [...prev, id]);
        }
        setValidated(false);
    };

    // Agrega esta función antes del return
    const sendStats = async (attempts, successCount, failCount, time) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user ? user.accessToken : null;

        const data = {
            juego: {
                id: 4, // Cambia este id por el que corresponda en tu base de datos
                nombre: "Pinta los cuadros"
            },
            cantidadErrores: failCount,
            cantidadIntentos: attempts,
            tiempoSegundos: time,
            aciertos: successCount
        };

        try {
            await axios.post(
                "http://localhost:8080/api/partidas",
                data,
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined
                    }
                }
            );
        } catch (error) {
            console.error("Error enviando contadores:", error);
        }
    };

    // Validar selección al presionar el botón
    const handleValidate = () => {
        setAttempts(prev => prev + 1);
        // Todos los cuadrados deben estar coloreados y ningún otro debe estar coloreado
        const allSquaresColored = targetSquares.every(id => coloredIds.includes(id));
        const onlySquaresColored = coloredIds.every(id => targetSquares.includes(id));
        if (allSquaresColored && onlySquaresColored && coloredIds.length === TOTAL_SQUARES) {
            setSuccessCount(prev => {
                const newSuccess = prev + 1;
                sendStats(attempts + 1, newSuccess, failCount, time);
                return newSuccess;
            });
            setValidationSuccess(true);
        } else {
            setFailCount(prev => {
                const newFail = prev + 1;
                sendStats(attempts + 1, successCount, newFail, time);
                return newFail;
            });
            setValidationSuccess(false);
        }
        setValidated(true);
    };

    const renderShape = (shape) => {
        const isColored = coloredIds.includes(shape.id);
        const fill = isColored
            ? (shape.type === 'square'
                ? SQUARE_COLORS[shape.colorIndex]
                : shape.otherColor || SELECTED_OTHER_COLOR)
            : 'transparent';
        const strokeWidth = 2;

        const baseStyle = {
            position: 'absolute',
            left: `${shape.x}px`,
            top: `${shape.y}px`,
            transform: `rotate(${shape.rotation}deg)`,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        };

        switch (shape.type) {
            case 'square':
                return (
                    <div
                        key={shape.id}
                        onClick={() => handleShapeClick(shape.id)}
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
                        onClick={() => handleShapeClick(shape.id)}
                        style={{
                            ...baseStyle,
                            width: `${shape.size}px`,
                            height: `${shape.size}px`,
                            borderRadius: '50%',
                            border: `${strokeWidth}px solid black`,
                            backgroundColor: fill
                        }}
                        data-type="circle"
                    />
                );
            case 'oval':
                return (
                    <div
                        key={shape.id}
                        onClick={() => handleShapeClick(shape.id)}
                        style={{
                            ...baseStyle,
                            width: `${shape.size * 1.5}px`,
                            height: `${shape.size}px`,
                            borderRadius: '50%',
                            border: `${strokeWidth}px solid black`,
                            backgroundColor: fill
                        }}
                        data-type="oval"
                    />
                );
            case 'hexagon':
                return (
                    <svg
                        key={shape.id}
                        width={shape.size}
                        height={shape.size}
                        style={baseStyle}
                        onClick={() => handleShapeClick(shape.id)}
                        data-type="hexagon"
                    >
                        <polygon
                            points={`
                                ${shape.size * 0.5},0
                                ${shape.size},${shape.size * 0.25}
                                ${shape.size},${shape.size * 0.75}
                                ${shape.size * 0.5},${shape.size}
                                0,${shape.size * 0.75}
                                0,${shape.size * 0.25}
                            `}
                            fill={fill}
                            stroke="black"
                            strokeWidth={strokeWidth}
                        />
                    </svg>
                );
            case 'parallelogram':
                return (
                    <div
                        key={shape.id}
                        onClick={() => handleShapeClick(shape.id)}
                        style={{
                            ...baseStyle,
                            width: `${shape.size * 1.5}px`,
                            height: `${shape.size}px`,
                            transform: `${baseStyle.transform} skewX(-20deg)`,
                            border: `${strokeWidth}px solid black`,
                            backgroundColor: fill
                        }}
                        data-type="parallelogram"
                    />
                );
            case 'pentagon':
                return (
                    <svg
                        key={shape.id}
                        width={shape.size}
                        height={shape.size}
                        style={baseStyle}
                        onClick={() => handleShapeClick(shape.id)}
                        data-type="pentagon"
                    >
                        <polygon
                            points={`
                                ${shape.size * 0.5},0
                                ${shape.size},${shape.size * 0.38}
                                ${shape.size * 0.81},${shape.size}
                                ${shape.size * 0.19},${shape.size}
                                0,${shape.size * 0.38}
                            `}
                            fill={fill}
                            stroke="black"
                            strokeWidth={strokeWidth}
                        />
                    </svg>
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        if (!validationSuccess) {
            timerRef.current = setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [validationSuccess, generateShapes]);

    // Reemplaza la función speakWelcome existente con esta
    const speakWelcome = () => {
        const audio = new Audio(require("../audio/pintaloscuadrados.mp3"));
        audio.play();
    };

    return (
        <div className="game-container" style={{ position: "relative" }}>
            {/* Añade la imagen del león */}
            <img
                src={require("../images/leon.png")}
                alt="León"
                onClick={speakWelcome}
                style={{
                    position: "absolute",
                    top: 370,
                    left: 760,
                    width: "200px",
                    zIndex: 10,
                    cursor: "pointer"
                }}
            />

            <h1 className="game-title">Pinta los cuadros</h1>

            <p className="game-description">
                Colorea solo los cuadros y presiona "Validar".
            </p>

            <div className="game-board-container">
                <div className="game-board">
                    {shapes.map(renderShape)}
                </div>

                <div className="game-footer">
                    <p className="game-progress">
                        Cuadrados coloreados: {coloredIds.length} / {TOTAL_SQUARES}
                    </p>
                    <div className="flex gap-4 mb-2" style={{ justifyContent: "center" }}>
                        <span>Intentos: <span className="font-bold">{attempts}</span></span>
                        <span>Aciertos: <span className="font-bold text-green-600">{successCount}</span></span>
                        <span>Errores: <span className="font-bold text-red-600">{failCount}</span></span>
                        <span>Tiempo: <span className="font-bold">{time}s</span></span>
                    </div>
                    {validated && (
                        <div className="game-message">
                            {validationSuccess ? (
                                <p className="text-green-600">¡Validación exitosa! Solo los cuadros están coloreados.</p>
                            ) : (
                                <p className="text-red-600">La validación falló. Revisa tu selección.</p>
                            )}
                        </div>
                    )}
                    <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
                        <button
                            onClick={handleValidate}
                            className="game-button"
                            disabled={validationSuccess} // Cambia esto
                        >
                            Validar
                        </button>
                        <button
                            onClick={generateShapes}
                            className="game-button"
                        >
                            {gameComplete ? "Nuevo Juego" : "Reiniciar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Squeare;