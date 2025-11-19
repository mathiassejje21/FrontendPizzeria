import { html, render } from 'lit-html';
import { authController } from '@/controllers/authController.mjs';
import { mensajeAlert } from '@components/mensajeAlert.mjs';
import { renderNavbar } from '../../components/navbar.mjs';

export function renderDashboardView() {

}

async function logout() {
    const auth = new authController();
    await auth.logout();
}