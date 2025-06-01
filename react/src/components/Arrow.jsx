//arrow final con estilos
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoArrowRight, GoArrowLeft, GoArrowUp, GoArrowDown, GoArrowUpRight, GoArrowDownRight } from "react-icons/go";
import './Arrow.css'

const directions = ["right", "left", "up", "down", "upRight", "downRight"];

const saveScore = async (score) => {
    try {
        const response = await axios.post("http://localhost:8080/api/game/score", { score });
        console.log(response.data);
    } catch (error) {
        console.error("Error al guardar la puntuación:", error);
    }
};

const sendStats = async (attempts, successCount, failCount, time) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.accessToken : null;

    const data = {
        juego: {
            id: 3, // Cambia este id por el que corresponda en tu base de datos
            nombre: "Juego de Flechas"
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

function Arrow() {
    const [arrows, setArrows] = useState([]);
    const [targetDirection, setTargetDirection] = useState(null);
    const [gameWon, setGameWon] = useState(false);
    const [score, setScore] = useState(0);
    const [totalToFind, setTotalToFind] = useState(0);
    const [error, setError] = useState(false);
    const [time, setTime] = useState(0);
    const [successCount, setSuccessCount] = useState(0);
    const [failCount, setFailCount] = useState(0);
    const timerRef = React.useRef(null);

    useEffect(() => {
        startNewGame();
    }, []);

    useEffect(() => {
        if (!gameWon) {
            timerRef.current = setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [gameWon]);

    const startNewGame = () => {
        let randomArrows = Array.from({ length: 16 }, (_, index) => ({
            id: index,
            direction: directions[Math.floor(Math.random() * directions.length)],
            selected: false,
        }));

        const targetDir = randomArrows[0].direction;
        setTargetDirection(targetDir);

        const minSameDirection = 6 + Math.floor(Math.random() * 3);
        const sameDirectionCount = randomArrows.filter((arrow) => arrow.direction === targetDir).length;

        if (sameDirectionCount < minSameDirection) {
            const availableIndices = randomArrows
                .filter((arrow, idx) => idx !== 0 && arrow.direction !== targetDir)
                .map((arrow) => arrow.id);

            const shuffledIndices = [...availableIndices].sort(() => Math.random() - 0.5);

            for (let i = 0; i < Math.min(minSameDirection - sameDirectionCount, shuffledIndices.length); i++) {
                const idxToChange = shuffledIndices[i];
                randomArrows = randomArrows.map((arrow) =>
                    arrow.id === idxToChange ? { ...arrow, direction: targetDir } : arrow
                );
            }
        }

        const finalCount = randomArrows.filter((arrow) => arrow.direction === targetDir).length;
        setTotalToFind(finalCount);

        randomArrows[0] = { ...randomArrows[0], selected: true };

        setArrows(randomArrows);
        setGameWon(false);
        setScore(1);
        setError(false);
        setTime(0);
    };

    const handleArrowClick = (id) => {
        if (gameWon) return;

        setArrows(arrows =>
            arrows.map((arrow) =>
                arrow.id === id
                    ? { ...arrow, selected: !arrow.selected }
                    : arrow
            )
        );
    };

    const validateSelection = () => {
        const allCorrectSelected = arrows
            .filter(arrow => arrow.direction === targetDirection)
            .every(arrow => arrow.selected);

        const noIncorrectSelected = arrows
            .filter(arrow => arrow.direction !== targetDirection)
            .every(arrow => !arrow.selected);

        if (allCorrectSelected && noIncorrectSelected) {
            setGameWon(true);
            setScore(arrows.filter(arrow => arrow.direction === targetDirection && arrow.selected).length);
            setError(false);
            setSuccessCount(prev => {
                const newSuccess = prev + 1;
                sendStats(score, newSuccess, failCount, time);
                return newSuccess;
            });
        } else {
            setGameWon(false);
            setError(true);
            setFailCount(prev => {
                const newFail = prev + 1;
                sendStats(score, successCount, newFail, time);
                return newFail;
            });
        }
    };

    const renderArrow = (direction, isSelected) => {
        const style = {
            width: "48px",
            height: "48px",
            fontSize: "48px",
            color: isSelected ? "blue" : "black",
            filter: isSelected ? "drop-shadow(0 0 4px #38bdf8)" : "none",
            transition: "filter 0.2s",
        };

        switch (direction) {
            case "right":
                return <GoArrowRight style={style} />;
            case "left":
                return <GoArrowLeft style={style} />;
            case "up":
                return <GoArrowUp style={style} />;
            case "down":
                return <GoArrowDown style={style} />;
            case "upRight":
                return <GoArrowUpRight style={style} />;
            case "downRight":
                return <GoArrowDownRight style={style} />;
            default:
                return null;
        }
    };

    const speakWelcome = () => {
        const audio = new Audio(require("../audio/arrow.mp3"));
        audio.play();
    };

    return (
        <div className="arrow-game-container">
            {/* <img
                src={require("../images/leon.png")}
                alt="León"
                onClick={speakWelcome}
                className="arrow-leon-img"
            /> */}

            <div className="mb-6 text-center">
                <h1 className="arrow-title">Juego de Flechas</h1>
                <p className="arrow-description">
                    Selecciona todas las flechas que apunten en la misma dirección que la primera flecha destacada y presiona "Validar".
                </p>
                <div className="arrow-stats-row">
                    <span>Progreso:</span>
                    <span className="font-bold">
                        {arrows.filter(arrow => arrow.direction === targetDirection && arrow.selected).length} / {totalToFind}
                    </span>
                    <span style={{ marginLeft: "1rem" }}>Tiempo: <span className="font-bold">{time}s</span></span>
                </div>
                <div className="arrow-stats-row">
                    <span>Aciertos: <span className="font-bold text-green-600">{successCount}</span></span>
                    <span>Errores: <span className="font-bold text-red-600">{failCount}</span></span>
                </div>
            </div>

            {gameWon && (
                <div className="arrow-message-success">
                    ¡Felicidades! Has encontrado todas las flechas correctas.
                </div>
            )}

            {error && !gameWon && (
                <div className="arrow-message-error">
                    Selección incorrecta. Intenta de nuevo.
                </div>
            )}

            <div className="arrow-board">
                {arrows.map((arrow) => (
                    <div
                        key={arrow.id}
                        onClick={() => handleArrowClick(arrow.id)}
                        className={
                            "arrow-cell" +
                            (arrow.selected ? " selected" : "") +
                            (arrow.id === 0 ? " model" : "")
                        }
                    >
                        {renderArrow(arrow.direction, arrow.selected)}
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div className="arrow-buttons-row" style={{ display: 'flex', gap: '20px' }}>
                    <button onClick={validateSelection} className="buttonvalidate">
                        Validar
                    </button>
                    <button onClick={startNewGame} className="resetbtnvalidate">
                        Nuevo Juego
                    </button>
                </div>

                <div style={{ width: '100px' }}>
                    <img
                        src={require("../images/leon.png")}
                        alt="León"
                        onClick={speakWelcome}
                        style={{ width: '150px', height: '150px', margin: 0 }}
                    />
                </div>
            </div>


        </div>
    );
}

export default Arrow;