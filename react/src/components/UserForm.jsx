import React, { useState } from 'react';
import './UserForm.css'; // Importa el archivo CSS

function UserForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('ROLE_USER'); // Estado para el rol

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Creando usuario:', { username, email, password, role });

    };

    return (
        <div className="user-form-container">
            <h2>Crear Usuario</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Nombre de usuario:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Correo electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="role">Rol:</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="ROLE_USER">Usuario</option>
                        <option value="ROLE_MODERATOR">Moderador</option>
                    </select>
                </div>
                <button type="submit">Crear Usuario</button>
            </form>
        </div>
    );
}

export default UserForm;