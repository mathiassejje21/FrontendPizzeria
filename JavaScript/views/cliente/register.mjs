import { html, render } from 'lit-html';
import { authController } from '@/controllers/authController.mjs';
import { mensajeAlert } from '@components/mensajeAlert.mjs';

export function renderRegisterView() {

  const template = html`
    <section id="contenedor-register">
      <img 
        src="https://img.freepik.com/vector-gratis/papel-pintado-mural-restaurante_23-2148697601.jpg?t=st=1764091985~exp=1764095585~hmac=03cb98917a0ad4bc273e01b0b1e70b0aff59e2b418c39b1c8e37783dfaaeb6ee&w=1480"
        alt="img-register"
      >
      <div class="contenido">
        <h2 style="color:#000; font-weight: 600; border-bottom: 0.15rem solid #c2831fff; width: 100%; text-align: center;
        padding-bottom: 0.5rem;">Registrar</h2>
        <p style="color: #ffd500ff ;margin-bottom:0.5rem; text-align: center;">Ingrese sus datos personales</p>
        <form @submit="${handleRegister}" class="contenido-form">
            <div style="display: flex; flex-direction: row; width: 100%;">
                <label for="nombre">Nombre</label>
                <input type="text" id="nombre" placeholder="Nombre" required>
            </div>  
            <div style="display: flex; flex-direction: row; width: 100%;">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="E-mail" required>
            </div>
            <input style=" border-bottom-left-radius: 0.5rem;
                border-top-left-radius: 0.5rem;" 
                type="password" id="password" placeholder="Contraseña" autocomplete="new-password" required>
            <input style=" border-bottom-left-radius: 0.5rem;
                border-top-left-radius: 0.5rem;" 
                type="password" id="confirmar" placeholder="Confirmar contraseña" autocomplete="new-password" required>
            <button>Crear cuenta</button>
        </form>
      </div>
    </section>
  `;

  render(template, document.querySelector('main'));
}

async function handleRegister(e) {
  e.preventDefault();

  const auth = new authController();
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmar = document.getElementById('confirmar').value;

  if (password !== confirmar) {
    mensajeAlert({
      icon: "error",
      title: "Contraseñas no coinciden",
      text: "Asegúrate de escribir la misma contraseña en ambos campos.",
      showConfirmButton: true,
      confirmButtonText: "Entendido"
    });
    return;
  }

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
