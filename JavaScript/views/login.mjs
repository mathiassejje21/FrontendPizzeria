import { html, render } from 'lit-html';
import { authController } from '@/controllers/authController.mjs';

export function renderLoginView() {
    const path = window.location.pathname.toLowerCase();

    let h2color;
    let btncolor;
    let bgcolor;
    let text;
    let img;
    let divExtra;

    if(path === '/pizzeria/login') {
        h2color = 'red';
        btncolor = 'btn-danger';
        bgcolor =  'rgb(254, 246, 235)';
        text = 'Pizzeria Don Luigi';
        img = '/public/images/login-cliente.jpg';
        divExtra = html`
            <div style="margin-top: 0.5rem; text-align: center;">
                <p style="color: #686868ff; margin-bottom: 2rem;">¿No tienes una cuenta?</p>
                <a href="/pizzeria/register" class="btn btn-outline-danger">Crear cuenta</a>
            </div>`;
    }else if(path === '/trabajadores/login') {
        h2color = '#c95f09ff';
        btncolor = 'btn-dark';
        bgcolor = '#ffffffff';
        text = 'Panel de Trabajadores';
        img = '/public/images/login-trabajadores.jpg';
    }   

    const template = html`
    <section id="contenedor-login" style=" background-color: ${bgcolor};">
        <div>
            <h2 style="color: ${h2color};">${text}</h2>
            <h7 style="color: #686868ff;">Ingrese su Correo y Contraseña</h7>
            <form @submit=${hundleLogin} id="loginForm">
                <div class="mb-3">
                    <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="example@gmail.com" required>
                </div>
                <div class="mb-3">
                    <input type="password" class="form-control" id="password" placeholder="********" autocomplete="current-password" required>
                </div>
                <button class="btn ${btncolor}">Iniciar Sesion</button>
            </form>
            ${divExtra}
        </div>
        <div>
            <img src="${img}" alt="imagen de Login">
        </div>
    </section>
  `;

  render(template, document.querySelector('main'));
}

async function hundleLogin(e){
    const auth = new authController();
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await auth.processLogin(email, password);
}