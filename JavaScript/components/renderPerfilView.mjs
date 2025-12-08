import { html, render } from "lit-html"
import { authController } from "@controllers/authController.mjs"
import { mensajeAlert } from "@components/mensajeAlert.mjs"
import { userController } from "@controllers/userController.mjs"

export async function renderPerfilView(user) {
  if (!user) return location.href = "/pizzeria/login"

  let activeTab = "info"

  const setTab = (tab) => {
    activeTab = tab
    renderView()
  }

  const renderView = () => {
    const template = html`

      <style>

        .perfil-wrapper {
          width: 100%;
          min-height: 100vh;
          background: radial-gradient(circle at top, #0f172a 0%, #020617 80%);
          display: flex;
          justify-content: center;
          padding: 3rem 1rem;
          box-sizing: border-box;
          color: white;
        }

        .perfil-container {
          width: 100%;
          max-width: 860px;
          padding: 2rem;
          border-radius: 22px;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(74, 222, 128, 0.25);
          box-shadow:
            0 0 25px rgba(34, 197, 94, 0.25),
            inset 0 0 12px rgba(15, 23, 42, 0.6);
          animation: fadeIn .4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .perfil-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .perfil-user {
          display: flex;
          gap: 1.2rem;
          align-items: center;
        }

        .avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          font-size: 2rem;
          font-weight: 700;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #4ade80, #22c55e);
          color: #0f172a;
          box-shadow:
            0 0 18px #4ade80aa,
            inset 0 0 8px #4ade80aa;
        }

        .perfil-header-title h2 {
          margin: 0;
          font-size: 1.6rem;
          font-weight: 700;
        }

        .perfil-header-title p {
          margin: 0;
          opacity: 0.75;
          font-size: 0.9rem;
        }

        .perfil-role {
          padding: .35rem .9rem;
          border-radius: 20px;
          font-size: .85rem;
          background: rgba(34, 197, 94, 0.18);
          border: 1px solid rgba(74, 222, 128, 0.5);
          box-shadow: inset 0 0 10px rgba(74, 222, 128, 0.3);
        }

        .tabs {
          display: flex;
          gap: .8rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 1.6rem;
        }

        .tab {
          padding: .65rem 1.2rem;
          border-radius: 12px 12px 0 0;
          background: rgba(255,255,255,0.06);
          cursor: pointer;
          font-size: .9rem;
          font-weight: 600;
          color: #e2e8f0;
          transition: .25s;
        }

        .tab:hover {
          background: rgba(255,255,255,0.12);
        }

        .tab.active {
          background: linear-gradient(135deg,#4ade80,#22c55e);
          color: #0f172a;
          box-shadow: 0 0 18px rgba(74, 222, 128, 0.4);
        }

        .card {
          background: rgba(255,255,255,0.04);
          padding: 1.4rem;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow:
            0 0 14px rgba(0,0,0,0.35),
            inset 0 0 10px rgba(255,255,255,0.02);
          animation: fadeIn .4s ease-out;
        }

        .card h3 {
          margin: 0 0 1rem;
          font-size: 1.1rem;
          color: #4ade80;
        }

        .info-row {
          font-size: .9rem;
          color: #e2e8f0;
          display: flex;
          justify-content: space-between;
          padding: .55rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .two-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .btn {
          padding: .7rem 1.4rem;
          border-radius: 10px;
          background: linear-gradient(135deg,#22c55e,#16a34a);
          color: #0f172a;
          font-weight: 700;
          cursor: pointer;
          margin-top: .6rem;
          transition: .25s;
          box-shadow: 0 0 14px rgba(34,197,94,0.45);
        }

        .btn:hover {
          filter: brightness(1.1);
          transform: translateY(-2px);
        }

        .btn-logout{
          background: #ff0000ff;
          border-radius: 10%;
          border: none;
          cursor: pointer;
          width: 40px;
          height: 40px;
          transition: .25s all ease-in-out;
        }

        .btn-logout:hover{
          transform: scale(1.1);
        }

      </style>

      <div class="perfil-wrapper">
        <div class="perfil-container">

          <div class="perfil-header">
            <div class="perfil-user">
              <div class="avatar">${user.nombre[0].toUpperCase()}</div>
              <div class="perfil-header-title">
                <h2>${user.nombre}</h2>
                <p>${user.email}</p>
              </div>
            </div>

            <div>
              <button class="btn-logout" @click=${() => logout()}>
                <img src="https://img.icons8.com/?size=100&id=yYVvZRRwNT5v&format=png&color=000000" width="25" height="25" alt="Cerrar sesión">
              </button>
            </div>
 
            <div class="perfil-role">
              ${user.rol?.nombre || user.rol}
            </div>
          </div>

          <div class="tabs">
            <div class="tab ${activeTab === "info" ? "active" : ""}" @click=${() => setTab("info")}>
              Información
            </div>
            <div class="tab ${activeTab === "editar" ? "active" : ""}" @click=${() => setTab("editar")}>
              Editar
            </div>
            <div class="tab ${activeTab === "seguridad" ? "active" : ""}" @click=${() => setTab("seguridad")}>
              Seguridad
            </div>
          </div>

          <div>
            ${activeTab === "info" ? html`
              <div class="card">
                <h3>Información Personal</h3>
                <div class="info-row">
                  <span class="info-label">Nombre</span>
                  <span class="info-value">${user.nombre}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Correo</span>
                  <span class="info-value">${user.email}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Rol</span>
                  <span class="info-value">${user.rol?.nombre || user.rol}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Teléfono</span>
                  <span class="info-value">${user.telefono || "—"}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Dirección</span>
                  <span class="info-value">${user.direccion || "—"}</span>
                </div>
              </div>
            ` : ""}

            ${activeTab === "editar" ? html`
              <div class="card">
                <h3>Editar Información</h3>
                <div class="two-columns">
                  <div>
                    <label class="inp">
                      <input type="text" id="edit-nombre" placeholder=" " .value=${user.nombre}>
                      <span class="label">Nombre</span>
                      <span class="focus-bg"></span>
                    </label>
                    <label class="inp">
                      <input type="text" id="edit-email" placeholder=" " .value=${user.email}>
                      <span class="label">Email</span>
                      <span class="focus-bg"></span>
                    </label>
                  </div>

                  <div>
                    <label class="inp">
                      <input type="text" id="edit-telefono" placeholder=" " .value=${user.telefono? user.telefono : ""}>
                      <span class="label">Teléfono</span>
                      <span class="focus-bg"></span>
                    </label>
                    <label class="inp">
                      <input type="text" id="edit-direccion" placeholder=" " .value=${user.direccion? user.direccion : ""}>
                      <span class="label">Dirección</span>
                      <span class="focus-bg"></span>
                    </label>
                  </div>
                </div>

                <button class="btn" @click=${actualizarPerfil}>Guardar cambios</button>
              </div>
            ` : ""}

            ${activeTab === "seguridad" ? html`
              <div class="card">
                <h3>Seguridad</h3>
                <div class="two-columns">
                  <label class="inp">
                    <input id="new-password" type="password" placeholder=" "/>
                    <span class="label">Nueva  contraseña</span>
                    <span class="focus-bg"></span>
                  </label>
                  <label class="inp">
                    <input id="repeat-password" type="password"  placeholder=" "/>
                    <span class="label">Repetir  contraseña</span>
                    <span class="focus-bg"></span>
                  </label>
                  <div>
                  </div>
                </div>

                <button class="btn" @click=${cambiarPassword}>Cambiar contraseña</button>
              </div>
            ` : ""}
          </div>
        </div>
      </div>
    `

    render(template, document.getElementById("contenedor"))
  }

  renderView()
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
  mensajeAlert({ icon: "success", title: "Actualizado", timer: 1000 })
  location.reload()
}

async function cambiarPassword() {
  const userApi = new userController()
  const p1 = document.getElementById("new-password").value
  const p2 = document.getElementById("repeat-password").value

  if (!p1 || !p2)
    return mensajeAlert({ icon: "warning", title: "Campos vacíos" })
  if (p1 !== p2)
    return mensajeAlert({ icon: "warning", title: "No coinciden" })

  await userApi.updateProfile({ password: p1 })
  mensajeAlert({ icon: "success", title: "Contraseña cambiada", timer: 1000 })
}
