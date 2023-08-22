import React from "react";
import ReactDOM from "react-dom/client";
import FormAuthComponent from "./FormAuth";
import "./index.css";
import ChatPage from "./Chat";
import RecieverChatMassage from "./resieverchatMassage";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
 
    ( !localStorage.token ? <FormAuthComponent /> : <ChatPage/>)
     
  // {/* </React.StrictMode> */}
);
