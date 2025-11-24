import { html, render } from "lit-html";
import { renderNavbarClientes } from "@components/navbar.mjs";
import { mostrarInicio } from "./mostrarInicio.mjs";
import { mostrarProductos } from "./mostrarProductos.mjs";
import { renderCarrito } from "@/service/renderCarrito.mjs";
import { updateTotal } from "@/service/carrito.mjs";
import { mostrarDetalleCarrito } from "./detalleCarrito.mjs";
import { mostrarPedidos } from "./mostrarPedidos.mjs";

export async function renderHomeView(selection = null, user = null) {
  await renderNavbarClientes(user);

  let template;

  if (selection === "home" || selection === null) {
    const inicioTemplate = await mostrarInicio();
    template = html`${inicioTemplate}`;
    render(template, document.getElementById("contenedor"));
  } 

  else if (selection === "productos") {
    await mostrarProductos();
  } 

  else if (selection === "carrito") {
    await mostrarDetalleCarrito(user);
  } 

  else if (selection === "pedidos") {
    await mostrarPedidos();
  }

  updateTotal();
  renderCarrito();

}
