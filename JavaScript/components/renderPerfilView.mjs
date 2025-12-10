import { html, render } from "lit-html"
import { authController } from "@controllers/authController.mjs"
import { mensajeAlert } from "@components/mensajeAlert.mjs"
import { userController } from "@controllers/userController.mjs"

export async function renderPerfilView(user) {
  if (!user) return location.href = "/pizzeria/login"

  let activeTab = "info"

  const isCliente =
    user.rol?.nombre?.toLowerCase() === "cliente" ||
    user.rol?.toLowerCase() === "cliente"

  const COLOR_PRIMARY = isCliente ? "#ff7b4a" : "#00de51ff"
  const COLOR_ACCENT = isCliente ? "#ffaa4a" : "#22c55e"
  const TEXT_COLOR = isCliente ? "white" : "white"

  const setTab = (tab) => {
    activeTab = tab
    renderView()
  }

  const getIniciales = (nombre) => {
    if (!nombre) return "U"
    const partes = nombre.trim().split(" ")
    if (partes.length === 1) return partes[0][0].toUpperCase()
    return (partes[0][0] + partes[1][0]).toUpperCase()
  }

  const renderView = () => {
    const u = user
    const iniciales = getIniciales(u.nombre)

    const template = html`
    <style>

      .perfil-wrapper {
        width: 100%;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        padding-top: 7rem;
        color: ${TEXT_COLOR};
      }

      .perfil-container {
        width: 100%;
        max-width: 880px;
        padding: 2.2rem;
        border-radius: 22px;
        background: rgba(0,0,0,0.35);
        backdrop-filter: blur(18px);
        border: 1px solid rgba(255,255,255,0.12);
        box-shadow: 0 8px 25px rgba(0,0,0,0.55);
        height: fit-content;
      }

      .perfil-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .perfil-userBox {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .avatar {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        font-size: 2rem;
        font-weight: 700;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(135deg, ${COLOR_PRIMARY}, ${COLOR_ACCENT});
        color: white;
      }

      .perfil-header-title h2,
      .perfil-header-title p {
        color: ${TEXT_COLOR} !important;
        margin: 0;
      }

      .perfil-role {
        padding: .3rem .85rem;
        border-radius: 20px;
        background: rgba(255,255,255,0.1);
        border: 1px solid ${COLOR_PRIMARY};
        color: ${COLOR_ACCENT};
        font-size: .85rem;
      }

      .perfil-actions {
        display: flex;
        align-items: center;
        gap: .6rem;
      }

      .btn-logout {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        border: none;
        background: rgba(255, 0, 0, 0.61);
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: .25s;
      }

      .btn-logout:hover {
        background: rgba(255, 0, 0, 0.25);
        transform: scale(1.07);
      }

      .tabs {
        display: flex;
        gap: .8rem;
        margin-bottom: 1.6rem;
      }

      .tab {
        padding: .6rem 1.2rem;
        background: rgba(255,255,255,0.08);
        border-radius: 12px;
        cursor: pointer;
        font-size: .9rem;
        font-weight: 600;
        color: ${TEXT_COLOR};
      }

      .tab.active {
        background: ${COLOR_PRIMARY};
        color: #1a1a1a;
      }

      .card {
        background: rgba(0,0,0,0.3);
        padding: 1.4rem;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.1);
      }

      .card h3 {
        margin: 0 0 1rem;
        color: ${COLOR_ACCENT};
      }

      .info-row {
        display: flex;
        justify-content: space-between;
        padding: .55rem 0;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        color: ${TEXT_COLOR} !important;
      }

      .two-columns {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .inp input {
        width: 100%;
        padding: .8rem;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 10px;
        color: ${TEXT_COLOR};
      }

      .inp input:focus {
        border-color: ${COLOR_PRIMARY};
      }

      .label {
        color: white;
      }

      .btn {
        padding: .75rem 1.4rem;
        border-radius: 10px;
        background: ${COLOR_PRIMARY};
        color: #1a1a1a;
        font-weight: 700;
        cursor: pointer;
        margin-top: 1rem;
      }

      @media (max-width: 768px) {
        .perfil-container,
        .card,
        .info-row,
        .tab,
        .perfil-header-title h2,
        .perfil-header-title p {
          color: ${TEXT_COLOR} !important;
        }

        .perfil-header {
          flex-direction: column;
          gap: 1rem;
          text-align: center;
        }

        .perfil-userBox {
          flex-direction: column;
        }

        .tabs {
          justify-content: center;
        }
      }

    </style>

    <div class="perfil-wrapper">
      <div class="perfil-container">

        <div class="perfil-header">
          <div class="perfil-userBox">
            <div class="avatar">${iniciales}</div>

            <div class="perfil-header-title">
              <h2>${u.nombre}</h2>
              <p>${u.email}</p>
            </div>

            <div class="perfil-actions">
              <button class="btn-logout" @click=${logout}>
                <img src="https://img.icons8.com/ios-glyphs/30/ffffff/logout-rounded.png">
              </button>

              <div class="perfil-role">${u.rol?.nombre || u.rol}</div>
            </div>
          </div>
        </div>

        <div class="tabs">
          <div class="tab ${activeTab === "info" ? "active" : ""}" @click=${() => setTab("info")}>Información</div>
          <div class="tab ${activeTab === "editar" ? "active" : ""}" @click=${() => setTab("editar")}>Editar</div>
          <div class="tab ${activeTab === "seguridad" ? "active" : ""}" @click=${() => setTab("seguridad")}>Seguridad</div>
        </div>

        <div>
          ${activeTab === "info" ? html`
            <div class="card">
              <h3>Información Personal</h3>
              <div class="info-row"><span>Nombre</span><span>${u.nombre}</span></div>
              <div class="info-row"><span>Correo</span><span>${u.email}</span></div>
              <div class="info-row"><span>Rol</span><span>${u.rol?.nombre || u.rol}</span></div>
              <div class="info-row"><span>Teléfono</span><span>${u.telefono || "—"}</span></div>
              <div class="info-row"><span>Dirección</span><span>${u.direccion || "—"}</span></div>
            </div>
          ` : ""}

          ${activeTab === "editar" ? html`
            <div class="card">
              <h3>Editar Información</h3>

              <div class="two-columns">
                <div>
                  <label class="inp">
                    <input id="edit-nombre" type="text" placeholder=" " .value=${u.nombre}>
                    <span class="label">Nombre</span>
                  </label>

                  <label class="inp">
                    <input id="edit-email" type="text" placeholder=" " .value=${u.email}>
                    <span class="label">Email</span>
                  </label>
                </div>

                <div>
                  <label class="inp">
                    <input id="edit-telefono" type="text" placeholder=" " .value=${u.telefono ?? ""}>
                    <span class="label">Teléfono</span>
                  </label>

                  <label class="inp">
                    <input id="edit-direccion" type="text" placeholder=" " .value=${u.direccion ?? ""}>
                    <span class="label">Dirección</span>
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
                  <input id="new-password" type="password" placeholder=" ">
                  <span class="label">Nueva contraseña</span>
                </label>

                <label class="inp">
                  <input id="repeat-password" type="password" placeholder=" ">
                  <span class="label">Repetir contraseña</span>
                </label>
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
