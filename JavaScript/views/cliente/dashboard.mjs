import { html, render } from "lit-html";
import { authController } from "@controllers/authController.mjs";
import { mensajeAlert } from "@components/mensajeAlert.mjs";
import { renderNavbar } from "@/components/navbar.mjs";
import { userController } from "@controllers/userController.mjs";

export async function renderDashboardView() {
  await renderNavbar();

  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!user) return (location.href = "/trabajadores/login");

  const template = html`
    <style>
      .dashboard-container {
        max-width: 1100px;
        margin: 2rem auto;
        display: flex;
        gap: 2rem;
      }
      .dashboard-nav {
        width: 260px;
        background: #ffffff;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        height: fit-content;
        position: sticky;
        top: 90px;
      }
      .dashboard-nav a {
        display: flex;
        align-items: center;
        gap: .7rem;
        padding: .7rem 1rem;
        border-radius: .5rem;
        margin-bottom: .5rem;
        cursor: pointer;
        font-weight: 600;
        color: #0a3a17;
        text-decoration: none;
        transition: 0.25s;
      }
      .dashboard-nav a:hover {
        background: #0a3a1718;
      }
      .dashboard-section {
        background: #fff;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        margin-bottom: 2rem;
      }
      .dashboard-section h2 {
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: .6rem;
        color: #0a3a17;
      }
    </style>

    <div class="dashboard-container">
      <nav class="dashboard-nav">
        <a href="#info-personal"><span>👤</span> Información Personal</a>
        <a href="#editar-datos"><span>✏️</span> Editar Datos</a>
        <a href="#cambiar-password"><span>🔒</span> Cambiar Contraseña</a>
        <a href="#logout" @click=${logout} style="color:#b30000;"><span>🚪</span> Cerrar Sesión</a>
      </nav>

      <div style="width:100%;">
        <section id="info-personal" class="dashboard-section">
          <h2>👤 Información Personal</h2>
          <p><strong>Nombre:</strong> ${user.nombre}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Rol:</strong> ${user.rol?.nombre || user.rol}</p>
        </section>

        <section id="editar-datos" class="dashboard-section">
          <h2>✏️ Editar Datos</h2>

          <form id="edit-form">
            <label>Nombre</label>
            <input class="form-control mb-3" type="text" value="${user.nombre}" id="edit-nombre">

            <label>Email</label>
            <input class="form-control mb-3" type="email" value="${user.email}" id="edit-email">

            <label>Teléfono</label>
            <input class="form-control mb-3" type="text" value="${user.telefono || ''}" id="edit-telefono">

            <label>Dirección</label>
            <input class="form-control mb-3" type="text" value="${user.direccion || ''}" id="edit-direccion">

            <button type="button" class="btn btn-danger mt-2" @click=${actualizarPerfil}>
              Guardar Cambios
            </button>
          </form>
        </section>

        <section id="cambiar-password" class="dashboard-section">
          <h2>🔒 Cambiar Contraseña</h2>

          <form id="pass-form">
            <label>Nueva contraseña</label>
            <input class="form-control mb-2" type="password" id="new-password">

            <label>Repetir nueva contraseña</label>
            <input class="form-control mb-2" type="password" id="repeat-password">

            <button type="button" class="btn btn-danger mt-2" @click=${cambiarPassword}>
              Cambiar contraseña
            </button>
          </form>
        </section>
      </div>
    </div>
  `;

  render(template, document.getElementById("main"));
}

async function logout() {
  const auth = new authController();
  await auth.logout();
}

async function actualizarPerfil() {
  const userApi = new userController();

  const data = {
    nombre: document.getElementById("edit-nombre").value,
    email: document.getElementById("edit-email").value,
    telefono: document.getElementById("edit-telefono").value,
    direccion: document.getElementById("edit-direccion").value
  };

  await userApi.updateProfile(data);

  sessionStorage.setItem("user", JSON.stringify({ ...JSON.parse(sessionStorage.getItem("user")), ...data }));

  mensajeAlert({
    icon: "success",
    title: "Perfil actualizado",
    timer: 1200
  });

  setTimeout(() => renderDashboardView(), 500);
}

async function cambiarPassword() {
  const userApi = new userController();

  const pass1 = document.getElementById("new-password").value;
  const pass2 = document.getElementById("repeat-password").value;

  if (!pass1 || !pass2) {
    return mensajeAlert({
      icon: "warning",
      title: "Campos vacíos",
      text: "Completa ambos campos."
    });
  }

  if (pass1 !== pass2) {
    return mensajeAlert({
      icon: "warning",
      title: "No coinciden",
      text: "Las contraseñas no coinciden.",
      showConfirmButton: true
    });
  }

  await userApi.updateProfile({ password: pass1 });

  mensajeAlert({
    icon: "success",
    title: "Contraseña cambiada",
    timer: 1200
  });
}
