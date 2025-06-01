import React, { useState, useEffect, useRef } from "react";
import "./DragAndDrop.css";
import axios from "axios";

function DragAndDrop() {
    const images = [
        { id: 1, src: "/images/shape1.png", name: "shape1" },
        { id: 2, src: "/images/shape2.png", name: "shape2" },
        { id: 3, src: "/images/shape3.png", name: "shape3" },
        { id: 4, src: "/images/shape4.png", name: "shape4" },
    ];

    // Añade un estado para los cuadros objetivo aleatorios
    const [targetImages, setTargetImages] = useState(
        [...images].sort(() => Math.random() - 0.5)
    );
    const [droppedImages, setDroppedImages] = useState([null, null, null, null]);
    const [attempts, setAttempts] = useState(0);
    const [successCount, setSuccessCount] = useState(0);
    const [failCount, setFailCount] = useState(0);
    const [time, setTime] = useState(0);
    const [validated, setValidated] = useState(false);
    const [validationSuccess, setValidationSuccess] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!validationSuccess) {
            timerRef.current = setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [validationSuccess]);

    const handleDragStart = (e, image) => {
        e.dataTransfer.setData("imageId", image.id);
    };

    const availableImages = images.filter(img => !droppedImages.includes(img.id));

    const handleDrop = (e, dropIndex) => {
        setAttempts(prev => prev + 1);
        const draggedImageId = parseInt(e.dataTransfer.getData("imageId"));
        setDroppedImages(prev => {
            const newDropped = prev.map(id => (id === draggedImageId ? null : id));
            newDropped[dropIndex] = draggedImageId;
            return newDropped;
        });
        setValidated(false);
    };

    const handleReturnToTop = (e) => {
        const draggedImageId = parseInt(e.dataTransfer.getData("imageId"));
        setDroppedImages(prev => prev.map(id => (id === draggedImageId ? null : id)));
        setValidated(false);
    };

    // Función para enviar los contadores al backend
    const sendStats = async (attempts, successCount, failCount, time) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user ? user.accessToken : null;

        const data = {
            juego: {
                id: 2,
                nombre: "Arrastra y Reconoce Formas"
            },

            cantidadErrores: failCount,
            cantidadIntentos: attempts,
            tiempoSegundos: time,
            aciertos: successCount
        };

        console.log("Datos enviados al backend:", data);
        console.log("Token enviado:", token);

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

    // Modifica la función handleValidate
    const handleValidate = () => {
        setValidated(true);
        const allCorrect = droppedImages.every(
            (imgId, idx) => imgId === targetImages[idx].id
        );
        if (allCorrect && droppedImages.every(id => id !== null)) {
            setValidationSuccess(true);
            setSuccessCount(prev => prev + 1);
            sendStats(attempts, successCount + 1, failCount, time);
            // Elimina el reinicio automático:
            // setTimeout(() => {
            //     handleReset();
            // }, 2000);
        } else {
            setValidationSuccess(false);
            setFailCount(prev => prev + 1);
            sendStats(attempts, successCount, failCount + 1, time);
        }
    };

    // Modifica la función handleReset para mezclar también los cuadros objetivo
    const handleReset = () => {
        setDroppedImages([null, null, null, null]);
        setAttempts(0);
        setSuccessCount(0);
        setFailCount(0);
        setTime(0);
        setValidated(false);
        setValidationSuccess(false);
        // Mezcla los cuadros objetivo
        setTargetImages([...images].sort(() => Math.random() - 0.5));
    };

    // Replace the speakWelcome function with this one:
    const speakWelcome = () => {
        const audio = new Audio(require("../audio/draganddrop.mp3"));
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
                    left: 660,
                    width: "200px",
                    zIndex: 10,
                    cursor: "pointer"
                }}
            />

            <h1>Juego de desplazamiento y reconocimiento de formas</h1>
            <h3>
                Arrastra las figuras a cualquier cuadro. Cuando termines, presiona "Validar".
            </h3>
            <h6>Recuerda puedes cambiar de figura si la mueves a otro cuadro.</h6>
            <div className="flex items-center justify-center gap-4 mb-2">
                <span>Intentos: <span className="font-bold">{attempts}</span></span>
                <span>Tiempo: <span className="font-bold">{time}s</span></span>
                <span>Aciertos: <span className="font-bold text-green-600">{successCount}</span></span>
                <span>Errores: <span className="font-bold text-red-600">{failCount}</span></span>
            </div>
            <div className="drag-container">
                <div className="box">
                    <h2>Arrastra las figuras</h2>
                    <div
                        className="images-container"
                        onDragOver={e => e.preventDefault()}
                        onDrop={handleReturnToTop}
                    >
                        {availableImages.map((image) => (
                            <img
                                key={image.id}
                                src={image.src}
                                alt={image.name}
                                draggable
                                onDragStart={(e) => handleDragStart(e, image)}
                                className="draggable-image"
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="drop-container">
                <div className="box">
                    <h2>Coloca las figuras</h2>
                    <div className="images-container">
                        {targetImages.map((image, idx) => (
                            <div
                                key={image.id}
                                className="drop-zone"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDrop(e, idx)}
                            >
                                <img src={image.src} alt={image.name} className="fixed-image" />
                                {droppedImages[idx] && (
                                    <img
                                        src={images.find(img => img.id === droppedImages[idx]).src}
                                        alt={images.find(img => img.id === droppedImages[idx]).name}
                                        className="dropped-image"
                                        draggable
                                        onDragStart={e => handleDragStart(e, images.find(img => img.id === droppedImages[idx]))}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div style={{ display: "flex", gap: "2rem", marginTop: "1.5rem" }}>
                <button onClick={handleReset} className="reset-button">
                    Reiniciar Juego
                </button>
                <button onClick={handleValidate} className="validate-button">
                    Validar
                </button>
            </div>
            {validated && (
                <div className="validation-message">
                    {validationSuccess ? (
                        <p className="text-green-600">¡Validación exitosa! Todas las figuras están en su lugar.</p>
                    ) : (
                        <p className="text-red-600">La validación falló. Algunas figuras están en el lugar incorrecto.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default DragAndDrop;