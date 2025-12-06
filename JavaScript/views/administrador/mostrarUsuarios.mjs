import { html, render } from "lit-html";
import { userController } from "@controllers/userController.mjs";
import { rolController } from "@controllers/rolController.mjs";
import { renderTableList } from "@components/tableList.mjs";
import { filterBasic, paginateBasic, totalPagesBasic } from "@/service/listTools.mjs";
import { mensajeAlert } from "@components/mensajeAlert.mjs";

export async function renderUsuariosView() {
  const apiUser = new userController();
  const apiRol = new rolController();

  let roles = [];
  let usuarios = [];
  let usuarioSeleccionado = null;
  let editUsuario = null;

  let searchQuery = "";
  let currentPage = 1;
  const rowsPerPage = 10;

  async function loadData() {
    usuarios = await apiUser.getUsers();
    roles = await apiRol.getRoles();
  }

  await loadData();

  const getFilteredUsers = () => {
    return filterBasic(usuarios, ["nombre", "email"], searchQuery);
  };

  const getPaginatedRows = () => {
    return paginateBasic(getFilteredUsers(), currentPage, rowsPerPage);
  };

  const totalPages = () => {
    return totalPagesBasic(getFilteredUsers(), rowsPerPage);
  };

  const nextPage = () => {
    if (currentPage < totalPages()) {
      currentPage++;
      actualizarVista();
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      currentPage--;
      actualizarVista();
    }
  };

  const limpiarSeleccion = () => {
    usuarioSeleccionado = null;
    editUsuario = null;
    document.getElementById("editar-item").style.display = "none";
    actualizarVista();
  };

  const seleccionarUsuario = (u) => {
    usuarioSeleccionado = u;
    actualizarVista();
  };

  const editarUsuario = (u) => {
    editUsuario = u;
    document.getElementById("editar-item").style.display = "flex";
    actualizarVista();
  };

  const eliminarUsuario = async (id) => {
    const res = await mensajeAlert({
      icon: "warning",
      title: "¿Desactivar usuario?",
      text: "El usuario se marcará como inactivo.",
      showConfirmButton: true,
      showCancelButton: true
    });

    if (!res.isConfirmed) return;

    const r = await apiUser.deleteUser(id);
    if (!r || r.status !== 200) {
      return mensajeAlert({
        icon: "error",
        title: "Error",
        text: "No se pudo desactivar el usuario."
      });
    }

    await loadData();
    limpiarSeleccion();
  };

  const crearUsuario = async (e) => {
    e.preventDefault();

    const pass = new_password.value.trim();
    const rep = new_password_repeat.value.trim();

    if (pass !== rep) {
        return mensajeAlert({
        icon: "error",
        title: "Contraseñas no coinciden",
        text: "La contraseña y su repetición deben ser iguales.",
        showConfirmButton: true
        });
    }

    const data = {
      nombre: new_nombre.value,
      email: new_email.value,
      password: pass,
      id_rol: Number(new_rol.value),
      telefono: new_telefono.value,
      direccion: new_direccion.value
    };

    if (!data.nombre || !data.email || !data.password || !data.id_rol) {
      return mensajeAlert({
        icon: "error",
        title: "Campos incompletos",
        text: "Nombre, email, contraseña y rol son obligatorios."
      });
    }

    const res = await apiUser.createUser(data);

    if (!res || res.status !== 201) {
      return mensajeAlert({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el usuario."
      });
    }

    await mensajeAlert({
      icon: "success",
      title: "Usuario creado",
      text: "Creado correctamente.",
      timer: 1200
    });

    await loadData();
    limpiarSeleccion();
  };

  const actualizarUsuario = async (e) => {
    e.preventDefault();

    const data = {
      nombre: edit_nombre.value,
      email: edit_email.value,
      telefono: edit_telefono.value,
      direccion: edit_direccion.value,
      id_rol: Number(edit_rol.value),
      activo: document.querySelector('input[name="edit_activo"]:checked').value === "true"
    };

    const res = await apiUser.updateUser(editUsuario.id, data);

    if (!res || res.status !== 200) {
      return mensajeAlert({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el usuario."
      });
    }

    await mensajeAlert({
      icon: "success",
      title: "Actualizado",
      text: "Actualizado correctamente.",
      timer: 1200
    });

    await loadData();
    limpiarSeleccion();
  };

  const actualizarVista = () => {
    const template = html`

    <main id="editar-item" style="display:none;">
      <div class="contenedor">

        <button class="btn-closed" @click=${limpiarSeleccion}>
          <img src="https://img.icons8.com/?size=100&id=ZqgesvdZtgAB&format=png&color=FFFFFF"
               style="width:1.9rem; opacity:.8;">
        </button>

        <div class="header"><h2>Editar Usuario</h2></div>

        <div class="modal-body">
        ${editUsuario ? html`

          <label class="inp">
            <input type="text" id="edit_nombre" placeholder=" " .value=${editUsuario.nombre}>
            <span class="label">Nombre</span>
          </label>

          <label class="inp">
            <input type="email" id="edit_email" placeholder=" " .value=${editUsuario.email}>
            <span class="label">Email</span>
          </label>

          <label class="inp">
            <input type="text" id="edit_telefono" placeholder=" " .value=${editUsuario.telefono || ""}>
            <span class="label">Telefono</span>
          </label>

          <label class="inp">
            <input type="text" id="edit_direccion" placeholder=" " .value=${editUsuario.direccion || ""}>
            <span class="label">Dirección</span>
          </label>

          <div class="select-modern">
            <select id="edit_rol">
              ${roles.map(r => html`
                <option value="${r.id}" ?selected=${editUsuario.id_rol === r.id}>${r.nombre}</option>
              `)}
            </select>
          </div>

          <div class="radio-group" style="display:flex; flex-direction:row; align-items:center; gap: 2.2rem;">
            <p class="radio-title" style="margin-right:5rem">Estado</p>
            <label class="radio-option">
              <input type="radio" name="edit_activo" value="true" ?checked=${editUsuario.activo}>
              <span></span> Activo
            </label>
            <label class="radio-option">
              <input type="radio" name="edit_activo" value="false" ?checked=${!editUsuario.activo}>
              <span></span> Inactivo
            </label>
          </div>

          <button class="btn-extra" @click=${actualizarUsuario}>Guardar Cambios</button>

        ` : ""}
        </div>

      </div>
    </main>

    <main class="main-contenedor">

      ${renderTableList({
        title: "Usuarios",
        searchPlaceholder: "Buscar usuario...",
        onSearch: (e) => {
          searchQuery = e.target.value;
          currentPage = 1;
          actualizarVista();
        },
        rows: getPaginatedRows(),
        columns: [
          { label: "ID", field: "id" },
          { label: "Nombre", field: "nombre" },
          { label: "Email", field: "email" },
          { label: "Rol", field: "rol.nombre" },
          { label: "Estado", field: "activo", type: "estado" }
        ],
        onRowClick: seleccionarUsuario,
        onEdit: editarUsuario,
        onDelete: eliminarUsuario,
        currentPage,
        totalPages: totalPages(),
        prevPage,
        nextPage
      })}

      <section class="contenedor-create">

        <form class="form-create">
          <h2>Crear Usuario</h2>
          <div style="display:flex; gap:0.5rem;">
            <label class="inp">
                <input id="new_nombre" type="text" placeholder=" ">
                <span class="label">Nombre</span>
            </label>
            <div class="select-modern">
                <select id="new_rol">
                ${roles.map(r => html`<option value="${r.id}">${r.nombre}</option>`)}
                </select>
            </div>
          </div>
          
          <label class="inp">
            <input id="new_email" type="email" placeholder=" ">
            <span class="label">Email</span>
          </label>

          <div style="display:flex; gap:0.5rem;">
            <label class="inp">
                <input id="new_password" type="password" placeholder=" ">
                <span class="label">Contraseña</span>
            </label>

            <label class="inp">
                <input id="new_password_repeat" type="password" placeholder=" ">
                <span class="label">Repetir Contraseña</span>
            </label>
          </div>

          

          <label class="inp">
            <input id="new_telefono" type="text" placeholder=" ">
            <span class="label">Telefono</span>
          </label>

          <label class="inp">
            <input id="new_direccion" type="text" placeholder=" ">
            <span class="label">Dirección</span>
          </label>

          <button class="btn-crear" @click=${crearUsuario}>Crear</button>
        </form>

        <div class="detalle-item">
          ${usuarioSeleccionado ? html`

            <button class="btn-closed" @click=${limpiarSeleccion}>
              <img src="https://img.icons8.com/?size=100&id=ZqgesvdZtgAB&format=png&color=000000"
                   style="width:2rem; height:2rem;">
            </button>

            <div class="detalle-info" style="display:flex; flex-direction:column; gap:.6rem;">

              <div style="background:#0f172a; padding:.8rem 1rem; border-radius:.4rem;">
                <p><strong>ID:</strong> ${usuarioSeleccionado.id}</p>
                <p><strong>Registrado:</strong> ${usuarioSeleccionado.fecha_registro.split("T")[0]}</p>
              </div>

              <div style="background:#0f172a; padding:.8rem 1rem; border-radius:.4rem;">
                <p><strong>Nombre:</strong> ${usuarioSeleccionado.nombre}</p>
                <p><strong>Email:</strong> ${usuarioSeleccionado.email}</p>
              </div>

              <div style="background:#0f172a; padding:.8rem 1rem; border-radius:.4rem;">
                <p><strong>Teléfono:</strong> ${usuarioSeleccionado.telefono || "—"}</p>
                <p><strong>Dirección:</strong> ${usuarioSeleccionado.direccion || "—"}</p>
              </div>

              <div style="background:#0f172a; padding:.8rem 1rem; border-radius:.4rem;">
                <p><strong>Rol:</strong> ${usuarioSeleccionado.rol?.nombre}</p>
                <p><strong>Estado:</strong>
                  <span style="color:${usuarioSeleccionado.activo ? "#4ade80" : "#f87171"};">
                    ${usuarioSeleccionado.activo ? "Activo" : "Inactivo"}
                  </span>
                </p>
              </div>

            </div>

          ` : html`<p>Seleccione un usuario</p>`}
        </div>

      </section>

    </main>
    `;

    render(template, document.getElementById("contenedor"));
  };

  actualizarVista();
}
