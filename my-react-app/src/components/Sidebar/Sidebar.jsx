// src/components/Sidebar/Sidebar.jsx
import React from "react";
import "./Sidebar.css";
import LogoSideBar from "../LogoSideBar/LogoSideBar";
import Boton from "../Boton/Boton";
import NavSideBar from "../NavSideBar/NavSideBar";

export default function Sidebar({ isOpen, toggleMenu }) {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <Boton clase="close-btn" onClick={toggleMenu} contenido="✖" />
      <LogoSideBar src="src/assets/images/Logo.png" alt="Logo" clase="sidebar-logo"/>
      <NavSideBar direccion1="/home" 
                  direccion2="/my-projects" 
                  direccion3="/my-stories" 
                  direccion4="/settings" 
                  contenido1="Home" 
                  contenido2="My projects" 
                  contenido3="My Stories" 
                  contenido4="Settings" 
                  onClick={toggleMenu}/>
    </div>
  );
}
