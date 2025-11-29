import { html, render } from "lit-html"
import { authController } from "@controllers/authController.mjs"
import { mensajeAlert } from "@components/mensajeAlert.mjs"
import { userController } from "@controllers/userController.mjs"

export async function renderPerfilView(user) {
  if (!user) return location.href = '/pizzeria/login'

  const template = html`
    <style>
      body {
        background: #f2f3f5;
        font-family: "Inter", sans-serif;
        padding: 0;
        margin: 0;
      }

      .dashboard-nav {
        position: fixed;
        top: 4rem;
        left: 50%;
        transform: translateX(-50%);
        background: #ffffff;
        padding: 0.8rem 1.4rem;
        border-radius: 16px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        display: flex;
        justify-content: center;
        gap: 1.2rem;
        width: fit-content;
        z-index: 9999;
      }

      .dashboard-nav a {
        font-size: 0.9rem;
        font-weight: 600;
        text-decoration: none;
        padding: 0.45rem 1rem;
        border-radius: 10px;
        color: #333;
        transition: .25s;
      }

      .dashboard-nav a:hover {
        background: #eceff1;
      }

      .dashboard-nav a.active {
        background: #2f7e59;
        color: white;
      }

      .dashboard-wrapper {
        max-width: 780px;
        margin: 110px auto 30px auto;
        padding: 0 1rem;
        display: flex;
        flex-direction: column;
        gap: 1.8rem;
      }

      .dashboard-card {
        background: #ffffff;
        padding: 1.4rem 1.6rem;
        border-radius: 14px;
        box-shadow: 0 3px 12px rgba(0,0,0,0.06);
      }

      .dashboard-card h2 {
        margin-bottom: 1rem;
        font-size: 1.2rem;
        font-weight: 700;
        color: #2f7e59;
      }

      .dashboard-card p {
        font-size: 0.95rem;
        color: #444;
        margin-bottom: 0.5rem;
      }

      form label {
        font-size: 0.9rem;
        font-weight: 600;
        color: #2f7e59;
        margin-bottom: 0.2rem;
        display: block;
      }

      .form-control {
        width: 100%;
        padding: 0.55rem;
        border-radius: 8px;
        border: 1px solid #d1d5db;
        background: #fafafa;
        font-size: 0.9rem;
        margin-bottom: 0.7rem;
        transition: .2s;
      }

      .form-control:focus {
        border-color: #2f7e59;
        background: #ffffff;
        box-shadow: 0 0 6px #2f7e5933;
      }

      .btn {
        padding: 0.6rem 1.2rem;
        border-radius: 10px;
        border: none;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
      }

      .btn-danger {
        background: #d63031;
        color: white;
      }

      .btn-danger:hover {
        background: #b62626;
      }
    </style>

    <nav class="dashboard-nav">
      <a href="#info-personal" class="active">Información</a>
      <a href="#editar-datos">Editar</a>
      <a href="#cambiar-password">Contraseña</a>
      <a href="#logout" style="color:#c0392b;" @click=${logout}>Salir</a>
    </nav>

    <div class="dashboard-wrapper">

      <section id="info-personal" class="dashboard-card">
        <h2>Información Personal</h2>
        <p><strong>Nombre:</strong> ${user.nombre}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Rol:</strong> ${user.rol?.nombre || user.rol}</p>
      </section>

      <section id="editar-datos" class="dashboard-card">
        <h2>Editar Datos</h2>
        <form>
          <label>Nombre</label>
          <input class="form-control" type="text" value="${user.nombre}" id="edit-nombre">

          <label>Email</label>
          <input class="form-control" type="email" value="${user.email}" id="edit-email">

          <label>Teléfono</label>
          <input class="form-control" type="text" value="${user.telefono || ''}" id="edit-telefono">

          <label>Dirección</label>
          <input class="form-control" type="text" value="${user.direccion || ''}" id="edit-direccion">

          <button type="button" class="btn btn-danger" @click=${actualizarPerfil}>Guardar</button>
        </form>
      </section>

      <section id="cambiar-password" class="dashboard-card">
        <h2>Cambiar Contraseña</h2>
        <form>
          <label>Nueva contraseña</label>
          <input class="form-control" type="password" id="new-password">

          <label>Repetir contraseña</label>
          <input class="form-control" type="password" id="repeat-password">

          <button type="button" class="btn btn-danger" @click=${cambiarPassword}>Cambiar</button>
        </form>
      </section>

    </div>
  `

  render(template, document.getElementById("contenedor"))

  const nav = document.querySelectorAll(".dashboard-nav a")
  function updateNav() {
    nav.forEach(n => n.classList.remove("active"))
    const active = [...nav].find(n => location.hash === n.getAttribute("href"))
    if (active) active.classList.add("active")
    else nav[0].classList.add("active")
  }
  updateNav()
  window.addEventListener("hashchange", updateNav)
}

async function logout() {
  const auth = new authController()
  await auth.logout()
}

async function actualizarPerfil() {
  const userApi = new userController()
  const data = {
    nombre: document.getElementById("edit-nombre").value,
    email: document.getElementById("edit-email").value,
    telefono: document.getElementById("edit-telefono").value,
    direccion: document.getElementById("edit-direccion").value
  }

  const res = await userApi.updateProfile(data)
  sessionStorage.setItem("user", JSON.stringify(res.usuario))

  mensajeAlert({ icon:"success", title:"Actualizado", timer:1000 })
    .then(() => location.reload())
}

async function cambiarPassword() {
  const userApi = new userController()
  const p1 = document.getElementById("new-password").value
  const p2 = document.getElementById("repeat-password").value

  if (!p1 || !p2)
    return mensajeAlert({ icon:"warning", title:"Campos vacíos" })

  if (p1 !== p2)
    return mensajeAlert({ icon:"warning", title:"No coinciden" })

  await userApi.updateProfile({ password: p1 })

  mensajeAlert({ icon:"success", title:"Contraseña cambiada", timer:1000 })
}
