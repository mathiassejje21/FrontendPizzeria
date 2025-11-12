import { html, render } from "lit-html";
import { renderNavbar } from "@components/navbar.mjs";
import { mostrarInicio } from "./mostrarInicio.mjs";
import { mostrarProductos } from "./mostrarProductos.mjs";

export async function renderHomeView(selection = null) {
  
  await renderNavbar();
  let template;

  if (selection === "home" || selection === null) {
    const inicioTemplate = await mostrarInicio();
    template = html`${inicioTemplate}`;
    render(template, document.getElementById("contenedor"))
  } 
  else if (selection === "productos") {
    await mostrarProductos(); 
    
  }

  
  
}
