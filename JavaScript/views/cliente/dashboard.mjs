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
      body {
        background: #f6f8fa;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      }

      .dashboard-container {
        max-width: 1250px;
        margin: 3rem auto;
        display: flex;
        gap: 2.5rem;
        position: relative;
        padding: 0 1rem;
      }

      .btn-volver {
        width: 60px;
        height: 50px;
        background: #b30000;
        border-radius: 50%;
        position: sticky;
        top: 90px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 5px 20px rgba(18,18,18,0.15);
        color: white;
        font-size: 22px;
        cursor: pointer;
        transition: .25s;
      }
      .btn-volver:hover {
        transform: scale(1.08);
        background: #8c0000;
      }


      .dashboard-nav {
        width: 270px;
        background: #ffffff;
        padding: 2rem 1.5rem;
        border-radius: 1.2rem;
        box-shadow: 0 8px 25px rgba(0,0,0,0.08);
        height: fit-content;
        position: sticky;
        top: 95px;
      }
      .dashboard-nav a {
        display: flex;
        align-items: center;
        gap: .9rem;
        padding: .9rem 1.1rem;
        border-radius: .7rem;
        margin-bottom: .6rem;
        cursor: pointer;
        font-weight: 600;
        font-size: 1rem;
        color: #0a3a17;
        text-decoration: none;
        background: #ffffff;
        transition: 0.25s;
      }
      .dashboard-nav a:hover {
        background: #0a3a1710;
        transform: translateX(3px);
      }

      #logout {
        color: #b30000 !important;
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

      <div class="btn-volver" @click=${() => location.href = "/pizzeria"}>
        ←
      </div>

      <nav class="dashboard-nav">
        <a href="#info-personal"><span>👤</span> Información Personal</a>
        <a href="#editar-datos"><span>✏️</span> Editar Datos</a>
        <a href="#cambiar-password"><span>🔒</span> Cambiar Contraseña</a>
        <a id="logout" href="#logout" @click=${logout}><span>🚪</span> Cerrar Sesión</a>
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

            <button type="button" class="btn btn-danger mt-2" @click=${actualizarPerfil}>Guardar Cambios</button>
          </form>
        </section>

        <section id="cambiar-password" class="dashboard-section">
          <h2>🔒 Cambiar Contraseña</h2>

          <form id="pass-form">
            <label>Nueva contraseña</label>
            <input class="form-control mb-2" type="password" id="new-password">

            <label>Repetir nueva contraseña</label>
            <input class="form-control mb-2" type="password" id="repeat-password">

            <button type="button" class="btn btn-danger mt-2" @click=${cambiarPassword}>Cambiar contraseña</button>
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

  sessionStorage.setItem("user", JSON.stringify({ 
    ...JSON.parse(sessionStorage.getItem("user")), 
    ...data 
  }));

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
