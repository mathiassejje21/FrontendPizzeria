import { html, render } from "lit-html";
import { renderNavbarClientes } from "@components/navbar.mjs";
import { mostrarInicio } from "./mostrarInicio.mjs";
import { renderProductosView } from "@components/renderProductosView.mjs";
import { renderCarrito } from "@/service/renderCarrito.mjs";
import { updateTotal } from "@/service/carrito.mjs";
import { mostrarPedidos } from "./mostrarPedidos.mjs";
import { renderPerfilView } from "@components/renderPerfilView.mjs";
import { renderCarritoView } from "@components/renderCarritoView.mjs";

export async function renderHomeView(selection = null, user = null) {
  if (!user) {
    const stored = sessionStorage.getItem("user");
    user = stored ? JSON.parse(stored) : null;
  }

  await renderNavbarClientes(user);

  let template;

  if (selection === "home" || selection === null) {
    const inicioTemplate = await mostrarInicio(user);
    template = html`${inicioTemplate}`;
    render(template, document.getElementById("contenedor"));
  } 

  else if (selection === "productos") {
    await renderProductosView({ detalleRouteBase: "/pizzeria/productos" });
  } 

  else if (selection === "carrito") {
    await renderCarritoView(user);
  } 

  else if (selection === "pedidos") {
    await mostrarPedidos();
  }

  else if (selection === "perfil") {
    await renderPerfilView(user);
  }

  updateTotal();
  renderCarrito();

}
