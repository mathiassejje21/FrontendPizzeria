import { html, render } from 'lit-html';
import { authController } from '@/controllers/authController.mjs';
import { mensajeAlert } from '@components/mensajeAlert.mjs'; // asegúrate de importar esto

export function renderDashboardView(user) {
  const template = html`
    <h1>${user.nombre}</h1>
    <p>${user.email}</p>
    <p>${user.rol}</p>
  `;

  render(template, document.getElementById('contenedor'));
}
