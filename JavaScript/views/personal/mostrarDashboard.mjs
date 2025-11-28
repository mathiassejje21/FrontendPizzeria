import { html, render } from "lit-html";

export function renderDashboardView() {
    const content = html`
        <style>
        *{
            margin:0;
            padding:0;
        }
        </style>
        <h1>Bienvenido al Dashboard de Personal</h1>
        <p>Aquí puedes gestionar las tareas asignadas.</p>
    `;

    render(content, document.getElementById("contenedor"));
}