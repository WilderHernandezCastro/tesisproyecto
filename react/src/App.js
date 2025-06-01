import React, { useState, useEffect, useCallback } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardModerator from "./components/board-moderator.component";
import BoardAdmin from "./components/board-admin.component";



import Formas from "./components/Formas";
import EjerciciosPalabras from "./components/EjerciciosPalabras";
import Concentrese from "./components/Concentrese";
import Triangle from "./components/Triangle";
import Squeare from "./components/Squeare";
import Swiper from "./components/Swiper";
import Arrow from "./components/Arrow";
import DragAndDrop from "./components/DragAndDrop";
import Lengths from "./components/Lengths";



import EventBus from "./common/EventBus";

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);

  const logOut = useCallback(() => {
    AuthService.logout();
    setCurrentUser(undefined);
    setShowModeratorBoard(false);
    setShowAdminBoard(false);
  }, []);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", logOut);

    return () => {
      EventBus.remove("logout");
    };
  }, [logOut]);

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">
          Dis-Ortho-Grafia
        </Link>
        <div className="navbar-nav mr-auto">
          {/* <li className="nav-item">
            <Link to={"/home"} className="nav-link">
              Home
            </Link>
          </li> */}

          {showModeratorBoard && (
            <li className="nav-item">
              <Link to={"/mod"} className="nav-link">
                Moderador Dash
              </Link>
            </li>
          )}
          {showModeratorBoard && (
            <li className="nav-item">
              <Link to={"/mod"} className="nav-link">
                Moderador Statistics
              </Link>
            </li>
          )}

          {showAdminBoard && (
            <li className="nav-item">
              <Link to={"/admin"} className="nav-link">
                Administrador tablero
              </Link>
            </li>
          )}

          {currentUser && (
            <li className="nav-item">
              <Link to={"/user"} className="nav-link">
                Usuario {currentUser.username}
              </Link>
            </li>
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                {/* {currentUser.username} */}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                Cerrar sesión
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Iniciar sesión
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Crear cuenta
              </Link>
            </li>
          </div>
        )}
      </nav>

      <div>
        <Switch>
          <Route exact path={["/", "/home"]} component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          {/* <Route exact path="/profile" component={Profile} /> */}
          <Route path="/user" component={BoardUser} />
          <Route path="/mod" component={BoardModerator} />
          <Route path="/admin" component={BoardAdmin} />


          <Route path="/reconocimiento-de-formas-graficas" component={Formas} />
          <Route path="/triangle" component={Triangle} />
          <Route path="/square" component={Squeare} />
          <Route path="/arrow" component={Arrow} />
          <Route path="/drag-and-drop" component={DragAndDrop} />
          <Route path="/lengths" component={Lengths} />



        </Switch>

      </div>
    </div>
  );
};

export default App;
