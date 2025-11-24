import { html, render } from "lit-html";
import { authController } from "@/controllers/authController.mjs";
import { mensajeAlert } from "@components/mensajeAlert.mjs";

export async function renderLoginView() {
  const user = sessionStorage.getItem("user");
  const path = window.location.pathname.toLowerCase();

  let h2color;
  let btncolor;
  let bgcolor;
  let text;
  let img;
  let divExtra;

  if (path === "/pizzeria/login") {
    h2color = "red";
    btncolor = "btn-danger";
    bgcolor = "rgb(254, 246, 235)";
    text = "Pizzeria Don Luigi";
    img = "/public/images/login-cliente.jpg";
    divExtra = html`
      <div style="margin-top:.5rem;text-align:center;">
        <p style="color:#686868ff;margin-bottom:2rem;">¿No tienes una cuenta?</p>
        <a href="/pizzeria/register" class="btn btn-outline-danger">Crear cuenta</a>
      </div>
    `;
  } else {
    h2color = "#c95f09ff";
    btncolor = "btn-dark";
    bgcolor = "#fff";
    text = "Panel de Trabajadores";
    img = "/public/images/login-trabajadores.jpg";
    divExtra = "";
  }

  async function handleLogin(e) {
    e.preventDefault();
    const auth = new authController();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const user = await auth.processLogin(email, password);
    const rol = user.rol?.nombre || user.rol;
    let redirectUrl = null;

    if (path === "/pizzeria/login") {
      if (rol !== "cliente") {
        return mensajeAlert({
          icon: "error",
          title: "Acceso denegado",
          text: "Este login es solo para clientes.",
          showConfirmButton: true
        }).then(() => (location.href = "/trabajadores/login"));
      }

      const carrito = JSON.parse(sessionStorage.getItem("carrito") || "[]");
      redirectUrl = carrito.length > 0 ? "/pizzeria/carrito" : "/pizzeria";
    }

    if (path === "/trabajadores/login") {
      if (rol === "personal") redirectUrl = "/personal/dashboard";
      if (rol === "administrador") redirectUrl = "/administrador/home";

      if (!redirectUrl) {
        return mensajeAlert({
          icon: "error",
          title: "Acceso denegado",
          text: "Este login es solo para personal y administradores.",
          showConfirmButton: true
        }).then(() => (location.href = "/pizzeria/login"));
      }
    }

    mensajeAlert({
      icon: "success",
      title: "¡Bienvenido!",
      text: "Has iniciado sesión correctamente",
      timer: 1400
    }).then(() => {
      location.href = redirectUrl;
    });
  }

  const template = html`
    <section id="contenedor-login" style="background-color:${bgcolor};">
      <div>
        <h2 style="color:${h2color};">${text}</h2>
        <h7 style="color:#686868ff;">Ingrese su Correo y Contraseña</h7>

        <form @submit=${handleLogin} id="loginForm">
          <div class="mb-3">
            <input type="email" class="form-control" id="email" placeholder="example@gmail.com" required>
          </div>
          <div class="mb-3">
            <input type="password" class="form-control" id="password" placeholder="********" required>
          </div>
          <button class="btn ${btncolor}">Iniciar Sesión</button>
        </form>

        ${divExtra}
      </div>

      <div>
        <img src="${img}" alt="imagen de Login">
      </div>
    </section>
  `;

  render(template, document.querySelector("main"));
}
