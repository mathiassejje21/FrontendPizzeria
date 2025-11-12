import { html, render } from 'lit-html';
import { authController } from '@/controllers/authController.mjs';
import { mensajeAlert } from '@components/mensajeAlert.mjs';

export function renderDashboardView() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if(!user) return location.href = '/pizzeria/login';
    if (user.rol !== 'cliente') {
        mensajeAlert({
            icon: 'warning',
            title: 'Acceso denegado',
            text: 'No tienes permiso para acceder a esta vista.',
            showConfirmButton: true
        }).then(async () => {
            await sessionStorage.removeItem('user');
            location.href = '/trabajadores/login';
        });  
    }
    
    const template = html`
    <h1>${user.nombre}</h1>
    <p>${user.email}</p>
    <p>${user.rol}</p>
    <button @click=${logout}>Cerrar Sesión</button>
    `;
    render(template, document.getElementById('main'));
}

async function logout() {
    const auth = new authController();
    await auth.logout();
}