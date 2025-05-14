import React, { useState } from "react";
import "./App.css";

const App = () => {
  const images = [
    { id: 1, src: "/images/shape1.png", name: "shape1" },
    { id: 2, src: "/images/shape2.png", name: "shape2" },
    { id: 3, src: "/images/shape3.png", name: "shape3" },
    { id: 4, src: "/images/shape4.png", name: "shape4" },
  ];

  const [shuffledImages, setShuffledImages] = useState(
    [...images].sort(() => Math.random() - 0.5)
  );
  const [droppedImages, setDroppedImages] = useState([]);

  const handleDragStart = (e, image) => {
    e.dataTransfer.setData("imageId", image.id);
  };

  const handleDrop = (e, targetImage) => {
    const draggedImageId = e.dataTransfer.getData("imageId");
    const draggedImage = images.find((img) => img.id === parseInt(draggedImageId));

    if (draggedImage.name === targetImage.name) {
      // Agregar la figura al estado de imágenes colocadas
      setDroppedImages((prev) => [...prev, draggedImage.id]);

      // Eliminar la figura del cuadro superior
      setShuffledImages((prev) => prev.filter((img) => img.id !== draggedImage.id));
    }
  };

  const isGameComplete = droppedImages.length === images.length;

  return (
    <div className="game-container">
      <h1>Drag and Drop Game</h1>
      <div className="drag-container">
        <div className="box">
          <h2>Arrastra las figuras</h2>
          <div className="images-container">
            {shuffledImages.map((image) => (
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
            {images.map((image) => (
              <div
                key={image.id}
                className="drop-zone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, image)}
              >
                {/* Figura fija siempre visible */}
                <img src={image.src} alt={image.name} className="fixed-image" />
                {/* Figura arrastrada superpuesta si es correcta */}
                {droppedImages.includes(image.id) && (
                  <img src={image.src} alt={image.name} className="dropped-image" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {isGameComplete && <h2 className="congratulations">¡Felicidades, completaste el juego!</h2>}
    </div>
  );
};

export default App;
