import { html, render } from 'lit-html';

export function renderDashboardView() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if(!user) return location.href = '/trabajadores/login';
    if(user.rol !== 'administrador') return location.href = '/logout';

    const template = html`
    <h1>${user.nombre}</h1>
    <p>${user.email}</p>
    <p>${user.rol}</p>
    `;
    render(template, document.getElementById('main'));
}