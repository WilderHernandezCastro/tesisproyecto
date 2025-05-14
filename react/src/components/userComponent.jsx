import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './UserComponent.css'; // Importa el archivo CSS

function UserComponent() {
    const [selectedGame, setSelectedGame] = useState("");
    const history = useHistory();

    const handleGameChange = (event) => {
        const game = event.target.value;
        setSelectedGame(game);
        console.log("Juego seleccionado:", game);

        if (game) {
            history.push(`/${game}`);
        }
    };

    return (
        <div className="user-component">
            <h2>Ejercicios:</h2>
            <label htmlFor="game-select">Seleccione un juego:</label>
            <select
                id="game-select"
                value={selectedGame}
                onChange={handleGameChange}
                className="game-select"
            >
                <option value="">-- Seleccione un juego --</option>
                <option value="reconocimiento-de-formas-graficas">Reconocimiento de formas gráficas</option>
                <option value="triangle">Percepción figura-fondo </option>
                <option value="square">Percepción constancia de la forma</option>
                <option value="arrow">Orientación espacial 1</option>
                <option value="drag-and-drop">Orientación espacial 2</option>
                <option value="lengths">Orientación espacial 3</option>
            </select>
        </div>
    );
}

export default UserComponent;