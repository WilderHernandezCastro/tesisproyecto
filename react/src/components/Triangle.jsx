import React, { useState, useEffect, useRef } from 'react';
import './Triangle.css';
import leonImg from '../images/leon.png'; // Ajusta la ruta si es necesario
import axios from 'axios';


function Triangle() {
    const [triangleColor, setTriangleColor] = useState('transparent');
    const [squareColor, setSquareColor] = useState('transparent');
    const [circleColor, setCircleColor] = useState('transparent');
    const [selectedColor, setSelectedColor] = useState('#ff6b6b');
    const [attempts, setAttempts] = useState(0);
    const [successes, setSuccesses] = useState(0);
    const [errors, setErrors] = useState(0); // Nuevo estado para errores
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [message, setMessage] = useState('');

    const [triangleRotation, setTriangleRotation] = useState(0);
    const [squareRotation, setSquareRotation] = useState(0);
    const [circleRotation, setCircleRotation] = useState(0);

    const [trianglePart1Color, setTrianglePart1Color] = useState('transparent');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];

    const audioRef = useRef(null);

    useEffect(() => {
        let interval = null;
        if (gameStarted) {
            interval = setInterval(() => {
                setTimeElapsed(time => time + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameStarted]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Modificado para aumentar errores si se pinta el cuadrado o el círculo
    const handleShapeClick = (shape) => {
        if (!gameStarted) setGameStarted(true);

        switch (shape) {
            case 'triangle-part1':
                setTrianglePart1Color(trianglePart1Color === 'transparent' ? selectedColor : 'transparent');
                break;
            case 'square':
                setSquareColor(squareColor === 'transparent' ? selectedColor : 'transparent');
                break;
            case 'circle':
                setCircleColor(circleColor === 'transparent' ? selectedColor : 'transparent');
                break;
        }
        setMessage('');
    };

    const sendStats = async (attempts, successes, errors, timeElapsed) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user ? user.accessToken : null;

        const data = {
            juego: {
                id: 5, // Cambia este id por el que corresponda en tu base de datos
                nombre: "Colorea el triángulo"
            },
            cantidadErrores: errors,
            cantidadIntentos: attempts,
            tiempoSegundos: timeElapsed,
            aciertos: successes
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

    const validateAnswer = () => {
        setAttempts(prev => prev + 1);

        const triangleColored = trianglePart1Color !== 'transparent';
        const squareNotColored = squareColor === 'transparent';
        const circleNotColored = circleColor === 'transparent';

        if (triangleColored && squareNotColored && circleNotColored) {
            setSuccesses(prev => {
                const newSuccess = prev + 1;
                sendStats(attempts + 1, newSuccess, errors, timeElapsed);
                return newSuccess;
            });
            setMessage('¡Excelente! Has coloreado el triángulo. 🎉');
        } else {
            setErrors(prev => {
                const newError = prev + 1;
                sendStats(attempts + 1, successes, newError, timeElapsed);
                return newError;
            });
            if (!triangleColored) {
                setMessage('❌ Debes colorear el triángulo.');
            } else {
                setMessage('❌ Solo debes colorear el triángulo. Las otras figuras deben quedar sin color.');
            }
        }
    };

    const resetGame = () => {
        clearColors();
        setAttempts(0);
        setSuccesses(0);
        setErrors(0); // Reinicia errores
        setTimeElapsed(0);
        setGameStarted(false);
        setTriangleRotation(Math.random() * 360);
        setSquareRotation(Math.random() * 360);
        setCircleRotation(Math.random() * 360);
        setMessage('');
    };

    const clearColors = () => {
        setTrianglePart1Color('transparent');
        setSquareColor('transparent');
        setCircleColor('transparent');
        setMessage('');
    };

    // Función para reproducir el audio al hacer clic en el león
    const playLeonAudio = () => {
        const audio = new Audio(require("../audio/triangle.mp3"));
        audio.play();
    };

    return (
        <div className="triangle-game-container" style={{ position: "relative" }}>
            <h1 className="triangle-header">
                Juego de Colorear Figuras
            </h1>

            <div className="triangle-stats">
                <div className="triangle-stat-card">
                    <div>Intentos: {attempts}</div>
                </div>
                <div className="triangle-stat-card">
                    <div>Aciertos: {successes}</div>
                </div>
                <div className="triangle-stat-card">
                    <div>Errores: {errors}</div>
                </div>
                <div className="triangle-stat-card">
                    <div>Tiempo: {formatTime(timeElapsed)}</div>
                </div>
            </div>

            <div className="triangle-game-area">
                <div className="triangle-shapes">
                    <svg width="320" height="320" viewBox="0 0 320 320">
                        {/* Círculo */}
                        <g transform={`rotate(${circleRotation}, 160, 160)`}>
                            <circle
                                cx="160"
                                cy="160"
                                r="120"
                                fill={circleColor}
                                stroke="#333"
                                strokeWidth="3"
                                onClick={() => handleShapeClick('circle')}
                            />
                        </g>
                        {/* Cuadrado */}
                        <g transform={`rotate(${squareRotation}, 160, 160)`}>
                            <rect
                                x="80"
                                y="80"
                                width="160"
                                height="160"
                                fill={squareColor}
                                stroke="#333"
                                strokeWidth="3"
                                onClick={() => handleShapeClick('square')}
                            />
                        </g>
                        {/* Triángulo */}
                        <g transform={`rotate(${triangleRotation}, 160, 160)`}>
                            <polygon
                                points="160,40 280,260 40,260"
                                fill={trianglePart1Color}
                                stroke="#333"
                                strokeWidth="3"
                                onClick={() => handleShapeClick('triangle-part1')}
                                style={{ cursor: 'pointer' }}
                            />
                        </g>
                    </svg>
                </div>

                <div className="triangle-controls">
                    <div className="color-selector">
                        <h5 >Selecciona un color</h5>
                        {colors.map((color) => (
                            <button
                                key={color}
                                style={{ backgroundColor: color }}
                                onClick={() => setSelectedColor(color)}
                                className='size-button'
                            />
                        ))}
                    </div>

                    <button onClick={validateAnswer} className='button-desing' >Validar</button>
                    <button onClick={clearColors} className='button-desing'>Limpiar Colores</button>
                    <button onClick={resetGame} className='button-desing'>Reiniciar Juego</button>

                    {message && (
                        <div className="message">
                            {message}
                        </div>
                    )}
                </div>
            </div>

            {/* Imagen del león con audio */}
            <img
                src={leonImg}
                alt="León"
                onClick={playLeonAudio}
                style={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    width: "200px",
                    zIndex: 10,
                    userSelect: "none",
                    cursor: "pointer"
                }}
            />
        </div>
    );
}

export default Triangle;
