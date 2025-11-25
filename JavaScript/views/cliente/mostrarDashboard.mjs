import { html, render } from "lit-html";
import { authController } from "@controllers/authController.mjs";
import { mensajeAlert } from "@components/mensajeAlert.mjs";
import { userController } from "@controllers/userController.mjs";

export async function renderDashboardView(user) {
  if (!user) return location.href = '/pizzeria/login';

  const template = html`
    <style>
      body {
        background: #f6f8fa;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      }

      .dashboard-container {
        max-width: 1250px;
        margin: 0 auto;
        padding: 0 1rem;
      }

      .dashboard-topnav {
        position: sticky;
        top: 150px;
        z-index: 1000;
        background: #ffffff;
        padding: 1rem 2rem;
        display: flex;
        gap: 2rem;
        justify-content: center;
        border-bottom: 1px solid rgba(0,0,0,0.07);
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        margin-bottom: 2.5rem;
        border-radius: 0 0 12px 12px;
      }

      .dashboard-topnav a {
        font-weight: 600;
        font-size: 1rem;
        color: #0a3a17;
        text-decoration: none;
        padding-bottom: .3rem;
        transition: .2s;
      }

      .dashboard-topnav a:hover {
        color: #085f24;
        border-bottom: 2px solid #0a3a17;
      }

      #logout {
        color: #b30000 !important;
      }

      #logout:hover {
        border-bottom: 2px solid #b30000 !important;
      }

      .dashboard-section {
        background: #ffffff;
        padding: 2.2rem;
        border-radius: 1.2rem;
        box-shadow: 0 8px 25px rgba(0,0,0,0.07);
        margin-bottom: 2rem;
        animation: fadeIn .4s ease-out;
      }

      .dashboard-section h2 {
        margin-bottom: 1.6rem;
        display: flex;
        align-items: center;
        gap: .8rem;
        color: #0a3a17;
        font-size: 1.4rem;
      }

      .dashboard-section p {
        font-size: 1.05rem;
        margin-bottom: .7rem;
        color: #333;
      }

      form label {
        font-weight: 600;
        margin-bottom: .4rem;
        color: #0a3a17;
      }

      .form-control {
        border-radius: .7rem;
        border: 1px solid #ced4da;
        padding: .75rem;
        transition: .25s;
      }

      .form-control:focus {
        border-color: #0a3a17;
        box-shadow: 0 0 6px #0a3a1733;
      }

      button.btn-danger {
        font-size: 1rem;
        padding: .7rem 1.4rem;
        border-radius: .7rem;
        font-weight: 600;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    </style>

    <div class="dashboard-container">

      <nav class="dashboard-topnav">
        <a href="#info-personal">Información Personal</a>
        <a href="#editar-datos">Editar Datos</a>
        <a href="#cambiar-password">Cambiar Contraseña</a>
        <a id="logout" href="#logout" @click=${logout}>Cerrar Sesión</a>
      </nav>

      <section id="info-personal" class="dashboard-section">
        <h2>Información Personal</h2>
        <p><strong>Nombre:</strong> ${user.nombre}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Rol:</strong> ${user.rol?.nombre || user.rol}</p>
      </section>

      <section id="editar-datos" class="dashboard-section">
        <h2>Editar Datos</h2>

        <form id="edit-form">
          <label>Nombre</label>
          <input class="form-control mb-3" type="text" value="${user.nombre}" id="edit-nombre">

          <label>Email</label>
          <input class="form-control mb-3" type="email" value="${user.email}" id="edit-email">

          <label>Teléfono</label>
          <input class="form-control mb-3" type="text" value="${user.telefono || ''}" id="edit-telefono">

          <label>Dirección</label>
          <input class="form-control mb-3" type="text" value="${user.direccion || ''}" id="edit-direccion">

          <button type="button" class="btn btn-danger mt-2" @click=${actualizarPerfil}>Guardar Cambios</button>
        </form>
      </section>

      <section id="cambiar-password" class="dashboard-section">
        <h2>Cambiar Contraseña</h2>

        <form id="pass-form">
          <label>Nueva contraseña</label>
          <input class="form-control mb-2" type="password" id="new-password">

          <label>Repetir nueva contraseña</label>
          <input class="form-control mb-2" type="password" id="repeat-password">

          <button type="button" class="btn btn-danger mt-2" @click=${cambiarPassword}>Cambiar contraseña</button>
        </form>
      </section>

    </div>
  `;

  render(template, document.getElementById("contenedor"));
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

  const res = await userApi.updateProfile(data);
  const newUser = res.usuario;

  mensajeAlert({
    icon: "success",
    title: "Perfil actualizado",
    timer: 1200
  }).then(() => {
    sessionStorage.setItem("user", JSON.stringify(newUser));
    location.reload();
  });
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
