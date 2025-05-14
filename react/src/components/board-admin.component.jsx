import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

import UserForm from "./UserForm";

const BoardAdmin = () => {
  const [content, setContent] = useState("");
  const [hasAccess, setHasAccess] = useState(true); // Estado para controlar el acceso

  useEffect(() => {
    UserService.getAdminBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const errorMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(errorMessage);

        if (error.response) {
          if (error.response.status === 401) {
            EventBus.dispatch("logout");
          } else if (error.response.status === 403) {
            setHasAccess(false); // Denegar acceso si el código es 403
          }
        }
      }
    );
  }, []); // El array vacío hace que esto solo se ejecute una vez (equivalente a componentDidMount)

  return (
    <div>
      <header>
        {/* <h3>{content}</h3> */}
        {hasAccess ? (
          <UserForm /> // Renderiza el formulario si tiene acceso
        ) : (
          <p style={{ color: "red", textAlign: "center" }}>
            Request failed with status code 403.
          </p>
        )}
      </header>
    </div>
  );
};

export default BoardAdmin;
