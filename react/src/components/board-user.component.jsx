import React, { Component } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import UserComponent from "./userComponent";
import './Board.css'

export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  speakWelcome = () => {
    const audio = new Audio(require("../audio/saludoinicial.mp3"));
    audio.play();
  };

  componentDidMount() {
    UserService.getUserBoard().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
    // Elimina o comenta esta línea:
    // this.speakWelcome();
  }

  render() {
    return (
      <div style={{ position: "relative", minHeight: "100vh" }}>

        <img

          src={require("../images/leon.png")}
          alt="León"
          onClick={this.speakWelcome}
          className="leon-responsive"
          style={{
            position: "absolute",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "14vw",
            maxWidth: "180px",
            minWidth: "80px",
            zIndex: 10,
            cursor: "pointer"
          }}

        />

        {/* Mensaje pequeño debajo del león */}
        <div
          style={{
            position: "absolute",
            top: "58%",
            left: "50%",
            transform: "translate(-50%, 0)",
            zIndex: 11,
            background: "rgba(37,99,235,0.90)",
            color: "#fff",
            padding: "0.3rem 1rem",
            borderRadius: "8px",
            fontWeight: "500",
            fontSize: "0.98rem",
            boxShadow: "0 2px 8px rgba(30,64,175,0.10)",
            textAlign: "center"
          }}
        >
          👉 Haz clic en el león para escuchar el mensaje
        </div>

        <header>
          <UserComponent />
        </header>
      </div>
    );
  }
}

