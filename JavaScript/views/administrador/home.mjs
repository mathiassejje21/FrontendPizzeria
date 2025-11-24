import { html, render } from "lit-html";
import { renderNavbarTrabajadores } from "@components/navbarTrabajadores.mjs";

export async function renderHomeView(user) {
    await renderNavbarTrabajadores(user);
}