import { html, render } from "lit-html";
import { tamanioController } from "@controllers/tamanioController.mjs";
import { estadoController } from "@controllers/estadoController.mjs";
import { renderTableList } from "@components/tableList.mjs";
import { filterBasic, paginateBasic, totalPagesBasic } from "@/service/listTools.mjs";
import { mensajeAlert } from "@components/mensajeAlert.mjs";

export async function renderAtributosView() {

  const apiTamanio = new tamanioController();
  const apiEstado = new estadoController();

  let tamanios = [];
  let estados = [];

  let editTamanio = null;
  let editEstado = null;

  let searchQueryTamanios = "";
  let searchQueryEstados = "";
  let currentPageTamanios = 1;
  let currentPageEstados = 1;
  const rowsPerPage = 5;

  async function loadData() {
    tamanios = await apiTamanio.getTamanios();
    estados = await apiEstado.getEstados();
  }

  await loadData();

  const getFilterTamanios = () => filterBasic(tamanios, ["nombre"], searchQueryTamanios);
  const getFilterEstado = () => filterBasic(estados, ["nombre"], searchQueryEstados);

  const getPaginatedRowsTamanios = () =>
    paginateBasic(getFilterTamanios(), currentPageTamanios, rowsPerPage);

  const getPaginatedRowsEstado = () =>
    paginateBasic(getFilterEstado(), currentPageEstados, rowsPerPage);

  const totalPagesTamanios = () => totalPagesBasic(getFilterTamanios(), rowsPerPage);
  const totalPagesEstado = () => totalPagesBasic(getFilterEstado(), rowsPerPage);

  const nextPageTamanios = () => {
    if (currentPageTamanios < totalPagesTamanios()) {
      currentPageTamanios++;
      actualizarVista();
    }
  };

  const prevPageTamanios = () => {
    if (currentPageTamanios > 1) {
      currentPageTamanios--;
      actualizarVista();
    }
  };

  const nextPageEstado = () => {
    if (currentPageEstados < totalPagesEstado()) {
      currentPageEstados++;
      actualizarVista();
    }
  };

  const prevPageEstado = () => {
    if (currentPageEstados > 1) {
      currentPageEstados--;
      actualizarVista();
    }
  };

  const limpiarSeleccion = () => {
    editTamanio = null;
    editEstado = null;
    document.getElementById("editar-item").style.display = "none";
    actualizarVista();
  };

  const editarTamanio = (t) => {
    editTamanio = t;
    editEstado = null;
    document.getElementById("editar-item").style.display = "flex";
    actualizarVista();
  };

  const editarEstado = (e) => {
    editEstado = e;
    editTamanio = null;
    document.getElementById("editar-item").style.display = "flex";
    actualizarVista();
  };

  const eliminarTamanio = async (id) => {
    const r = await mensajeAlert({
      icon: "warning",
      title: "¿Desactivar tamaño?",
      text: "El tamaño se marcará como inactivo.",
      showConfirmButton: true,
      showCancelButton: true
    });

    if (!r.isConfirmed) return;

    const res = await apiTamanio.deleteTamanio(id);
    if (!res || res.status !== 200) {
      return mensajeAlert({ icon: "error", title: "Error", text: "No se pudo desactivar." });
    }

    await loadData();
    limpiarSeleccion();
  };

  const eliminarEstado = async (id) => {
    const r = await mensajeAlert({
      icon: "warning",
      title: "¿Desactivar estado?",
      text: "El estado se marcará como inactivo.",
      showConfirmButton: true,
      showCancelButton: true
    });

    if (!r.isConfirmed) return;

    const res = await apiEstado.deleteEstado(id);
    if (!res || res.status !== 200) {
      return mensajeAlert({ icon: "error", title: "Error", text: "No se pudo desactivar." });
    }

    await loadData();
    limpiarSeleccion();
  };

  const crearTamanio = async (e) => {
    e.preventDefault();

    const data = {
      nombre: new_tam_nombre.value,
      factor_precio: new_tam_precio.value
    };

    if (!data.nombre || !data.factor_precio) {
      return mensajeAlert({
        icon: "error",
        title: "Campos incompletos",
        text: "Nombre y precio obligatorios."
      });
    }

    const res = await apiTamanio.createTamanio(data);

    if (!res || res.status !== 201) {
      return mensajeAlert({ icon: "error", title: "Error", text: "No se pudo crear." });
    }

    await mensajeAlert({ icon: "success", title: "Tamaño creado", text: "Tamaño creado correctamente.", timer: 1200 });

    await loadData();
    actualizarVista();
    limpiarSeleccion();
  };

  const crearEstado = async (e) => {
    e.preventDefault();

    const data = { nombre: new_est_nombre.value };

    if (!data.nombre) {
      return mensajeAlert({
        icon: "error",
        title: "Nombre obligatorio",
        text: "El nombre es obligatorio."
      });
    }

    const res = await apiEstado.createEstado(data);

    if (!res || res.status !== 201) {
      return mensajeAlert({ icon: "error", title: "Error", text: "No se pudo crear." });
    }

    await mensajeAlert({ icon: "success", title: "Estado creado", text: "Estado creado correctamente.", timer: 1200 });

    await loadData();
    actualizarVista();
  };

  const actualizarTamanio = async () => {
    const data = {
      nombre: edit_nombre.value,
      factor_precio: edit_precio.value,
      activo: document.querySelector('input[name="edit_activo"]:checked').value === "true"
    };

    const res = await apiTamanio.updateTamanio(editTamanio.id, data);

    if (!res || res.status !== 200) {
      return mensajeAlert({ icon: "error", title: "Error", text: "No se pudo actualizar." });
    }

    await mensajeAlert({ icon: "success", title: "Actualizado", text: "Actualizado correctamente.", timer: 1200 });

    await loadData();
    actualizarVista();
    limpiarSeleccion();
  };

  const actualizarEstado = async () => {
    const data = {
      nombre: edit_nombre.value,
      activo: document.querySelector('input[name="edit_activo"]:checked').value === "true"
    };

    const res = await apiEstado.updateEstado(editEstado.id, data);

    if (!res || res.status !== 200) {
      return mensajeAlert({ icon: "error", title: "Error", text: "No se pudo actualizar." });
    }

    await mensajeAlert({ icon: "success", title: "Actualizado", text: "Actualizado correctamente.", timer: 1200 });

    await loadData();
    actualizarVista();
    limpiarSeleccion();
  };

  const actualizarVista = () => {

  const template = html`

    <style>
      .main-contenedor-total{
        width: 100%;
        min-height: 100vh;
        display: grid;
        grid-template-rows: 1fr 1fr;
        gap: 1rem;
        background-color: #020617;
        color: #fff;
      }

      .fila-first{
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 100%;
        height: 100%;
      }

      .fila-second{
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        width: 100%;
        height: 100%;
      }

      th, td{
        text-align: center;
      }
    </style>


    <main id="editar-item" style="display:${editTamanio || editEstado ? "flex" : "none"}; width: 100%;">
      <div class="contenedor" style="width: 30%;">

        <button class="btn-closed" @click=${() => limpiarSeleccion()}>
          <img src="https://img.icons8.com/?size=100&id=ZqgesvdZtgAB&format=png&color=FFFFFF" 
               style="width:1.9rem; opacity:.8;">
        </button>

        <div class="header">
          <h2 style="margin:0">${editTamanio ? "Editar Tamaño" : "Editar Estado"}</h2>
        </div>

        <div class="modal-body">

          ${editTamanio ? html`

            <label class="inp">
              <input type="text" id="edit_nombre" placeholder=" " .value=${editTamanio.nombre}>
              <span class="label">Nombre</span>
            </label>

            <label class="inp">
              <input type="number" id="edit_precio" placeholder=" " .value=${editTamanio.factor_precio}>
              <span class="label">Factor Precio</span>
            </label>

            <div class="radio-group" style="display:flex; flex-direction:row; align-items:center; gap: 2.2rem;">
              <p class="radio-title" style="margin-right:5rem ">Estado</p>
              <label class="radio-option">
                <input type="radio" name="edit_activo" value="true" ?checked=${editTamanio.activo}>
                <span></span> Activo
              </label>

              <label class="radio-option">
                <input type="radio" name="edit_activo" value="false" ?checked=${!editTamanio.activo}>
                <span></span> Inactivo
              </label>
            </div>

            <button class="btn-extra" @click=${actualizarTamanio}>Guardar Cambios</button>

          ` : ""}

          ${editEstado ? html`

            <label class="inp">
              <input type="text" id="edit_nombre" placeholder=" " .value=${editEstado.nombre}>
              <span class="label">Nombre</span>
            </label>
            
            <div class="radio-group" style="display:flex; flex-direction:row; align-items:center; gap: 2.2rem;">
              <p class="radio-title" style="margin-right:5rem">Estado</p>
              <label class="radio-option">
                <input type="radio" name="edit_activo" value="true" ?checked=${editEstado.activo}>
                <span></span> Activo
              </label>

              <label class="radio-option">
                <input type="radio" name="edit_activo" value="false" ?checked=${!editEstado.activo}>
                <span></span> Inactivo
              </label>
            </div>

            <button class="btn-extra" @click=${actualizarEstado}>Guardar Cambios</button>

          ` : ""}

        </div>
      </div>
    </main>


    <main class="main-contenedor-total">

      <section class="fila-first">
        <section style="display:flex; flex-direction:column; width:100%; height:100%; padding: 0 2rem 1rem 2rem;;
        border-bottom-right-radius:1rem; background-color: #020617;
        box-shadow:
        6px 0 14px -3px rgba(255, 255, 255, 0.20),
        0 6px 14px -3px rgba(255, 255, 255, 0.20);">
            ${renderTableList({
            searchPlaceholder: "Buscar tamaño...",
            onSearch: (e) => { searchQueryTamanios = e.target.value; currentPageTamanios = 1; actualizarVista(); },
            rows: getPaginatedRowsTamanios(),
            columns: [
                { label: "ID", field: "id" },
                { label: "Nombre", field: "nombre" },
                { label: "Precio", field: "factor_precio" },
                { label: "Estado", field: "activo", type: "estado" }
            ],
            onEdit: editarTamanio,
            onDelete: eliminarTamanio,
            currentPage: currentPageTamanios,
            totalPages: totalPagesTamanios(),
            prevPage: prevPageTamanios,
            nextPage: nextPageTamanios
            })}
        </section>
        <section class="contenedor-create"  style="width:100%; height:100%; display:flex; justify-content:center; align-items:center;">
          <form class="form-create" style="width:60%; justify-content:center;">
          <form class="form-create">
            <h2>Crear Tamaño</h2>

            <label class="inp">
              <input id="new_tam_nombre" type="text" placeholder=" ">
              <span class="label">Nombre</span>
            </label>

            <label class="inp">
              <input id="new_tam_precio" type="number" placeholder=" ">
              <span class="label">Factor Precio</span>
            </label>

            <button class="btn-crear" @click=${crearTamanio}>Crear</button>
          </form>
        </section>

      </section>


      <section class="fila-second" >
        <section class="contenedor-create" style="width:100%; height:100%; display:flex; justify-content:center; align-items:center;">
          <form class="form-create" style="width:60%; justify-content:center; padding:1rem";>
            <h2>Crear Estado</h2>

            <label class="inp">
              <input id="new_est_nombre" type="text" placeholder=" ">
              <span class="label">Nombre</span>
            </label>

            <button class="btn-crear" @click=${crearEstado}>Crear</button>
          </form>
        </section>
        <section style="display:flex; flex-direction:column;width:100%; height:100%; padding: 0 1rem 1rem 1rem; 
        border-top-left-radius:1rem; background-color: #020617;
        box-shadow:
        -6px 0 14px -3px rgba(255, 255, 255, 0.20),
        0 -6px 14px -3px rgba(255, 255, 255, 0.20);">
            ${renderTableList({
                searchPlaceholder: "Buscar estado...",
                onSearch: (e) => { searchQueryEstados = e.target.value; currentPageEstados = 1; actualizarVista(); },
                rows: getPaginatedRowsEstado(),
                columns: [
                { label: "ID", field: "id" },
                { label: "Nombre", field: "nombre" },
                { label: "Estado", field: "activo", type: "estado" }
                ],
                onEdit: editarEstado,
                onDelete: eliminarEstado,
                currentPage: currentPageEstados,
                totalPages: totalPagesEstado(),
                prevPage: prevPageEstado,
                nextPage: nextPageEstado
            })}
        </section>
      </section>

    </main>
  `;

  render(template, document.getElementById("contenedor"));
};


  actualizarVista();
}
