import { html, render } from 'lit-html';
import { authController } from '@/controllers/authController.mjs';
import { mensajeAlert } from '@components/mensajeAlert.mjs';

export function renderRegisterView() {
    
    const template = html`
        <section id="contenedor-register" style="background-color: #000;">
            <div>
                <img src="/public/images/register-cliente.jpg" alt="">
            </div> 
            <div>
                <section style="
                    background-color: #f5f3ef;
                    width: 50%;
                    padding: 1.5rem;
                    border-radius: 1.5rem;
                    margin: auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    box-shadow: -2px 5px 10px 5px rgba(255, 255, 255, 0.5);">
                    <h2 style="color: #5c2c06;">Pizzeria Don Luigi</h2>
                    <h7 style="color: #b0b0b0;">Ingrese sus datos personales</h7>
                    <form @submit="${handleRegister}">
                        <input type="text" id="nombre" placeholder="Juan Perez" class="form-control" required>
                        <input type="email" id="email" placeholder="example@gmail.com" class="form-control" required>
                        <input type="password" id="password" placeholder="********" class="form-control" autocomplete="new-password" required>
                        <button type="submit" class="btn btn-danger" style="
                        width: 70%;
                        padding: 0.6rem;
                        border-radius: 0.8rem;
                        margin: 0 auto ;
                        font-weight: bold;
                        margin-top: 0.8rem;
                        ">Registrarse</button>
                    </form>
                </section>
            </div>
        </section>
        `;
    render(template, document.querySelector('main'))
}

async function handleRegister(e){
    e.preventDefault();
    const auth = new authController();
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const res = await auth.processRegister(nombre, email, password);
    if (res === true) {
      mensajeAlert({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Tu cuenta fue creada correctamente.",
        showConfirmButton: true,
        confirmButtonText: "Ir al login"
      }).then(() => location.href = "/pizzeria/login");
    }
}