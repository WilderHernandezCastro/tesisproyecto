"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "./Button"; // Asegúrate de tener un componente Button o reemplázalo con un <button>
import axios from "axios";

// Definir los tipos de dirección posibles
const directions = ["right", "left", "up", "down", "upRight", "downRight"];

const saveScore = async (score) => {
    try {
        const response = await axios.post("http://localhost:8080/api/game/score", { score });
        console.log(response.data);
    } catch (error) {
        console.error("Error al guardar la puntuación:", error);
    }
};

export default function ArrowGame() {
    const [arrows, setArrows] = useState([]);
    const [targetDirection, setTargetDirection] = useState(null);
    const [gameWon, setGameWon] = useState(false);
    const [score, setScore] = useState(0);
    const [totalToFind, setTotalToFind] = useState(0);

    // Colores actualizados
    const selectedColor = "text-black"; // Flechas seleccionadas en negro
    const defaultColor = "text-black"; // Flechas no seleccionadas en negro

    useEffect(() => {
        startNewGame();
    }, []);

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
    };

    const handleArrowClick = (id) => {
        if (gameWon) return;

        const clickedArrow = arrows.find((arrow) => arrow.id === id);
        if (!clickedArrow || clickedArrow.selected) return;

        if (clickedArrow.direction === targetDirection) {
            const updatedArrows = arrows.map((arrow) => (arrow.id === id ? { ...arrow, selected: true } : arrow));

            setArrows(updatedArrows);
            setScore(score + 1);

            if (score + 1 === totalToFind) {
                setGameWon(true);
                saveScore(score + 1);
            }
        }
    };

    const renderArrow = (direction, isSelected) => {
        const size = 24;

        switch (direction) {
            case "right":
                return <ArrowRight style={{ color: "black" }} size={size} />;
            case "left":
                return <ArrowLeft style={{ color: "black" }} size={size} />;
            case "up":
                return <ArrowUp style={{ color: "black" }} size={size} />;
            case "down":
                return <ArrowDown style={{ color: "black" }} size={size} />;
            case "upRight":
                return <ArrowUpRight style={{ color: "black" }} size={size} />;
            case "downRight":
                return <ArrowDownRight style={{ color: "black" }} size={size} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="mb-6 text-center">
                <h1 class='  bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-indigo-600 text-3xl'>Juego de Flechas</h1>
                <p className="text-gray-600 mb-4">
                    Selecciona todas las flechas que apunten en la misma dirección que la primera flecha destacada.
                </p>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span>Progreso:</span>
                    <span className="font-bold">
                        {score} / {totalToFind}
                    </span>
                </div>
            </div>

            {
                gameWon && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                        ¡Felicidades! Has encontrado todas las flechas correctas.
                    </div>
                )
            }

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px",
                    border: "1px solid #ccc",
                    padding: "16px",
                    backgroundColor: "#fff", // Fondo blanco
                    borderRadius: "8px",
                }}
            >
                {arrows.map((arrow) => (
                    <div
                        key={arrow.id}
                        onClick={() => handleArrowClick(arrow.id)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "16px",
                            border: arrow.id === 0 ? "2px solid blue" : "1px solid #ccc",
                            borderRadius: "8px",
                            cursor: "pointer",
                            backgroundColor: arrow.selected ? "#e0f7ff" : "#ffffff", // Fondo blanco para cuadros no seleccionados
                        }}
                    >
                        {renderArrow(arrow.direction, arrow.selected)}
                    </div>
                ))}
            </div>

            <button onClick={startNewGame} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
                Nuevo Juego
            </button>
        </div >
    );
}