import { html, render } from "lit-html";
import { authController } from "@/controllers/authController.mjs";
import { mensajeAlert } from "@components/mensajeAlert.mjs";

export async function renderLoginView() {
  const path = window.location.pathname.toLowerCase();
  let btncolor;
  let bgcolor;
  let text;
  let img;
  let divExtra;

  if (path === "/pizzeria/login") {
    btncolor = "#ff0000";
    bgcolor = "linear-gradient(135deg, rgba(234,158,53,1) 0%, rgba(255,180,90,1) 100%)";
    text = "Pizzeria Don Mario !";
    img = "https://images.pexels.com/photos/2233348/pexels-photo-2233348.jpeg";
    divExtra = html`
      <div style="margin-top:.5rem;text-align:center;">
        <p style="color:#686868ff;margin:1rem 0;">¿No tienes una cuenta?</p>
        <a href="/pizzeria/register">Crear cuenta</a>
      </div>
    `;
  } else {
    btncolor = "#381e65ff";
bgcolor = "linear-gradient(135deg, #6d3feaff 0%, #c8aaffff 100%)";
    text = "Panel de Trabajadores";
    img = "https://img.freepik.com/vector-gratis/empresario-red-datos_24908-57814.jpg?t=st=1764086985~exp=1764090585~hmac=f186e4ffb07155df75be4f2d1de0f53e7c0a92c6443defcfd805e282c12ea855&w=1480";
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
    <style>
      button {
        background-color: ${btncolor};
      }
      button:hover {
        background-color: color-mix(in srgb, ${btncolor} 75%, #000 35%);
        transform: scale(1.02);
      }
    </style>
    <section id="contenedor-login" style="background:${bgcolor};">
      <div class="contenido">
        <form @submit=${handleLogin} class="contenido-form">
          <h2 style="color:#000; font-weight: 600; border-bottom: 0.15rem solid #dbc609ff; width: 100%; margin:0">${text}</h2>
          <input type="email" id="email" placeholder="E-mail" required>
          <input type="password" id="password" placeholder="Contraseña" required>
          <button>Iniciar Sesión</button>
        </form>
        ${divExtra}
      </div>
      <img src="${img}" alt="imagen de Login">
    </section>
  `;

  render(template, document.querySelector("main"));
}
