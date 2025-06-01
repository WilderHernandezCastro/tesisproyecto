import React, { useState, useEffect, useRef } from "react";
import "./Formas.css";
import axios from "axios";
//reconocimiento formas graficas
const LETTER_SETS = [
    ["b", "p", "b", "p", "b", "p", "p", "b", "q", "b"],
    ["d", "b", "d", "p", "q", "d", "b", "p", "d", "q"],
    ["q", "p", "q", "b", "q", "p", "b", "q", "p", "q"],
    ["p", "b", "p", "q", "p", "b", "q", "p", "b", "p"]
];
const TARGETS = ["b", "d", "q", "p"];

function shuffle(array) {
    return array
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

function Formas() {
    const [letters, setLetters] = useState([]);
    const [target, setTarget] = useState("b");
    const [selected, setSelected] = useState([]);
    const [attempts, setAttempts] = useState(0);
    const [successCount, setSuccessCount] = useState(0);
    const [failCount, setFailCount] = useState(0);
    const [time, setTime] = useState(0);
    const [validated, setValidated] = useState(false);
    const [validationSuccess, setValidationSuccess] = useState(false);
    const timerRef = useRef(null);

    // Inicializa el juego
    const initGame = () => {
        const idx = Math.floor(Math.random() * LETTER_SETS.length);
        const targetLetter = TARGETS[idx];
        const shuffled = shuffle(LETTER_SETS[idx]);
        setLetters(shuffled);
        setTarget(targetLetter);
        setSelected([]);
        setAttempts(0);
        setSuccessCount(0);
        setFailCount(0);
        setTime(0);
        setValidated(false);
        setValidationSuccess(false);
    };

    useEffect(() => {
        initGame();
    }, []);

    useEffect(() => {
        if (!validationSuccess) {
            timerRef.current = setInterval(() => {
                setTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [validationSuccess]);

    const handleSelect = (idx) => {
        if (validated) return;
        setSelected((prev) =>
            prev.includes(idx)
                ? prev.filter((i) => i !== idx)
                : [...prev, idx]
        );
    };

    const sendStats = async (attempts, successCount, failCount, time) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user ? user.accessToken : null;

        const data = {
            juego: {
                id: 6, // Cambia este id por el que corresponda en tu base de datos
                nombre: "Reconocimiento de formas gráficas"
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

    const handleValidate = () => {
        setAttempts((prev) => prev + 1);
        const correctIndexes = letters
            .map((ltr, idx) => (ltr === target ? idx : null))
            .filter((v) => v !== null);
        const allCorrect =
            selected.length === correctIndexes.length &&
            selected.every((idx) => letters[idx] === target);

        if (allCorrect) {
            setSuccessCount((prev) => {
                const newSuccess = prev + 1;
                sendStats(attempts + 1, newSuccess, failCount, time);
                return newSuccess;
            });
            setValidationSuccess(true);
        } else {
            setFailCount((prev) => {
                const newFail = prev + 1;
                sendStats(attempts + 1, successCount, newFail, time);
                return newFail;
            });
            setValidationSuccess(false);
        }
        setValidated(true);
    };

    const handleRestart = () => {
        initGame();
    };

    // Formato de tiempo mm:ss
    const formatTime = (t) =>
        `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;

    // Letras objetivo encontradas
    const foundCount = selected.filter((idx) => letters[idx] === target).length;
    const totalTarget = letters.filter((ltr) => ltr === target).length;

    // Modifica la función speakWelcome
    const speakWelcome = () => {
        const audio = new Audio(require("../audio/reconocimientodeformasgraficas.mp3"));
        audio.play();
    };

    return (
        <div className="formas-container" style={{ position: "relative" }}>
            {/* Añade la imagen del león */}
            <img
                src={require("../images/leon.png")}
                alt="León"
                onClick={speakWelcome}
                className="formas-leon-img"
            />

            <h2 className="formas-title">Reconocimiento de formas gráficas</h2>
            <div className="formas-stats">
                <div className="formas-card">
                    <div className="formas-label">Letra Objetivo</div>
                    <div className="formas-target">{target}</div>
                </div>
                <div className="formas-card">
                    <div className="formas-label">Tiempo</div>
                    <div className="formas-value"><b>{formatTime(time)}</b></div>
                </div>
                <div className="formas-card">
                    <div className="formas-label">Errores</div>
                    <div className="formas-value">{failCount}</div>
                </div>
                <div className="formas-card">
                    <div className="formas-label">Intentos</div>
                    <div className="formas-value">{attempts}</div>
                </div>
            </div>
            <div className="formas-letters">
                {letters.map((ltr, idx) => (
                    <button
                        key={idx}
                        className={`formas-letter ${selected.includes(idx) ? "selected" : ""}`}
                        onClick={() => handleSelect(idx)}
                        disabled={validated}
                    >
                        {ltr}
                    </button>
                ))}
            </div>
            <div className="formas-progress">
                <div>Progreso:</div>
                <div className="formas-progress-bar-container">
                    <div>
                        Letras encontradas:{" "}
                        <b>
                            {foundCount} / {totalTarget}
                        </b>
                    </div>
                    <div className="formas-progress-bar-bg">
                        <div
                            className="formas-progress-bar"
                            style={{
                                width: `${(foundCount / totalTarget) * 100 || 0}%`,
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="formas-buttons">
                <button
                    className="formas-btn formas-btn-green"
                    onClick={handleValidate}
                    disabled={validated}
                >
                    Validar
                </button>
                <button className="formas-btn formas-btn-blue" onClick={handleRestart}>
                    Reiniciar
                </button>
            </div>
            {validated && (
                <div className="formas-message">
                    {validationSuccess ? (
                        <span className="formas-success">¡Correcto! Seleccionaste todas las letras objetivo.</span>
                    ) : (
                        <span className="formas-error">Hay un error en tu selección. Intenta de nuevo.</span>
                    )}
                </div>
            )}
        </div>
    );
}

export default Formas;