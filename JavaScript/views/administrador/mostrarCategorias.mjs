import { html, render } from "lit-html";
import { categoriaController } from "@controllers/categoriaController.mjs";
import { renderTableList } from "@components/tableList.mjs";
import { filterBasic, paginateBasic, totalPagesBasic } from "@/service/listTools.mjs";
import { mensajeAlert } from "@components/mensajeAlert.mjs";

export async function renderCategoriasView() {
  const apiCategoria = new categoriaController();
      
  let categorias = [];
  let categoriaSeleccionado = null;
  let editCategoria = null;

  let searchQuery = "";
  let currentPage = 1;
  const rowsPerPage = 10;

  async function loadData() {
    categorias = await apiCategoria.getCategorias();
  }

  const getFilteredCategories = () => {
    return filterBasic(
      categorias,                
      ["nombre", "descripcion"],
      searchQuery                
    );
  };

  const getPaginatedRows = () => {
    const filtered = getFilteredCategories();
    return paginateBasic(filtered, currentPage, rowsPerPage);
  };

  const totalPages = () => {
    const filtered = getFilteredCategories();
    return totalPagesBasic(filtered, rowsPerPage);
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
    categoriaSeleccionado = null;
    editCategoria = null;
    document.getElementById("editar-item").style.display = "none";
    actualizarVista();
  };

  await loadData();

  const seleccionarCategoria = (cat) => {
    categoriaSeleccionado = cat;
    actualizarVista();
  };

  const editarCategoria = (cat) => {
    editCategoria = cat;
    const vista = document.getElementById("editar-item");
    vista.style.display = "flex";
    actualizarVista();
  };

  const eliminarCategoria = async (id) => {
    const res = await mensajeAlert({
      icon: "warning",
      title: "¿Desactivar categoria?",
      text: "La categoria se marcará como inactivo.",
      showConfirmButton: true,
      showCancelButton: true
    });

    if (!res.isConfirmed) return;

    const r = await apiCategoria.deleteCategoria(id);
    if (!r || r.status !== 200) {
      return mensajeAlert({
        icon: "error",
        title: "Error",
        text: "No se pudo desactivar categoria."
      });
    }

    await loadData();
    limpiarSeleccion();
  };

  const crearCategoria = async (e) => {
    e.preventDefault();
    const data = {
      nombre: new_nombre.value,
      descripcion: new_descripcion.value,
      imagen_url: new_imagen.value,
    };

    if (!data.nombre || !data.descripcion) {
      return mensajeAlert({
        icon: "error",
        title: "Campos incompletos",
        text: "Nombre y descripción obligatorios.",
        showConfirmButton: true
      });
    }

    const res = await apiCategoria.createCategoria(data);
    console.log(res);
    if (!res || res.status !== 201) {
      return mensajeAlert({
        icon: "error",
        title: "Error",
        text: "No se pudo crear."
      });
    }

    await mensajeAlert({
      icon: "success",
      title: "Categoria creada",
      text: "Creado correctamente.",
      timer: 1200
    });

    await loadData();
    actualizarVista();
    limpiarSeleccion();
  };

  const actualizarCategoria = async (e) => {
    e.preventDefault();
    const data = {
      nombre: edit_nombre.value,
      descripcion: edit_descripcion.value,
      imagen_url: edit_imagen.value,
      activo: document.querySelector('input[name="edit_activo"]:checked').value === "true",
    };

    if (!data.nombre || !data.descripcion) {
      return mensajeAlert({
        icon: "error",
        title: "Campos incompletos",
        text: "Nombre y descripción obligatorios.",
        showConfirmButton: true
      });
    }

    const res = await apiCategoria.updateCategoria(editCategoria.id,data);
    if (!res || res.status !== 200) {
      return mensajeAlert({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar."
      });
    }

    await mensajeAlert({
      icon: "success",
      title: "Actualizado",
      text: "Actualizado correctamente.",
      timer: 1200
    });

    await loadData();
    actualizarVista();
    limpiarSeleccion();
  };

  const actualizarVista = () => {
    const template = html`
    <main id="editar-item" style="display:none;">
      <div class="contenedor">
        <button class="btn-closed" @click=${() => limpiarSeleccion()}>
          <img src="https://img.icons8.com/?size=100&id=ZqgesvdZtgAB&format=png&color=FFFFFF" 
              style="width:1.9rem; opacity:.8;">
        </button>
        <div class="header">
          <h2 style="margin:0">Editar Categoria</h2>
        </div>
        <div class="modal-body">
        ${editCategoria ? html`
            <label class="inp">
              <input type="text" id="edit_nombre" placeholder=" " .value=${editCategoria.nombre}>
              <span class="label">Nombre</span>
              <span class="focus-bg"></span>
            </label>

            <label class="inp">
              <input type="text" id="edit_descripcion" placeholder=" " .value=${editCategoria.descripcion}>
              <span class="label">Descripción</span>
              <span class="focus-bg"></span>
            </label>
            
            <label class="inp">
              <input type="text" id="edit_imagen" placeholder=" " .value=${editCategoria.imagen_url}>
              <span class="label">URL Imagen</span>
              <span class="focus-bg"></span>
            </label>

            <div class="radio-group" style="display:flex; flex-direction:row; align-items:center; gap: 2.2rem;">
              <p class="radio-title" style="margin-right:5rem">Estado</p>
              <label class="radio-option">
                <input type="radio" name="edit_activo" value="true" ?checked=${editCategoria.activo}>
                <span></span> Activo
              </label>
              <label class="radio-option">
                <input type="radio" name="edit_activo" value="false" ?checked=${!editCategoria.activo}>
                <span></span> Inactivo
              </label>
            </div>

            <button class="btn-extra" @click=${actualizarCategoria}>Guardar Cambios</button>

          ` : "Hola"}
        </div>
      </div>
    </main>
    <main class="main-contenedor">

      ${renderTableList({
        title: "Categorías",
        searchPlaceholder: "Buscar categoría...",
        onSearch: (e) => {
          searchQuery = e.target.value;
          currentPage = 1;
          actualizarVista();
        },
        rows: getPaginatedRows(),
        columns: [
          { label: "ID", field: "id" },
          { label: "Item", field: "imagen_url", type: "image" },
          { label: "Nombre", field: "nombre"},
          { label: "Descripción", field: "descripcion" },
          { label: "Estado", field: "activo", type: "estado" }
        ],
        onRowClick: seleccionarCategoria,
        onEdit: editarCategoria,
        onDelete: eliminarCategoria,
        currentPage,
        totalPages: totalPages(),
        prevPage,
        nextPage
      })}

      <section class="contenedor-create">
        <form class="form-create">
          <h2>Crear Categoría</h2>

          <label class="inp">
            <input type="text" id="new_nombre" placeholder=" ">
            <span class="label">Nombre</span>
          </label>

          <label class="inp">
            <input type="text" id="new_descripcion" placeholder=" ">
            <span class="label">Descripción</span>
          </label>

          <label class="inp">
            <input type="text" id="new_imagen" placeholder=" ">
            <span class="label">Imagen</span>
          </label>

          <button class="btn-crear" @click=${crearCategoria}>Crear</button>
        </form>

        <div class="detalle-item">
          ${categoriaSeleccionado ? html`

            <button class="btn-closed" @click=${() => limpiarSeleccion()}>
              <img src="https://img.icons8.com/?size=100&id=ZqgesvdZtgAB&format=png&color=000000" style="width:2rem ; height: 2rem;">
            </button>

            <div class="detalle-header">
              <img src=${categoriaSeleccionado.imagen_url} class="detalle-img">

              <div class="detalle-info">
                <p><strong>ID: </strong>${categoriaSeleccionado.id}</p>
                <p><strong>Nombre: </strong>${categoriaSeleccionado.nombre}</p>
              </div>
            </div>

            <div class="detalle-descripcion">
              <p><strong>Descripción: </strong>${categoriaSeleccionado.descripcion}</p>
              <p><strong>Estado: </strong>${categoriaSeleccionado.activo ? "Activo" : "Inactivo"}</p>
            </div>

          ` : html`
            <p>Seleccione una categoría</p>
          `}
        </div>
      </section>

    </main>
    `;

    render(template, document.getElementById("contenedor"));
  };

  actualizarVista();
}
