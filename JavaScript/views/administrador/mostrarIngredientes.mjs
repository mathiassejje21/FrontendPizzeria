import { html, render } from "lit-html";
import { ingredienteController } from "@controllers/ingredienteController.mjs";
import { renderTableList } from "@components/tableList.mjs";
import { filterBasic, paginateBasic, totalPagesBasic } from "@/service/listTools.mjs";
import { mensajeAlert } from "@components/mensajeAlert.mjs";

export async function renderIngredientesView() {
  const apiIng = new ingredienteController();

  let ingredientes = [];
  let editIngrediente = null;

  let searchQuery = "";
  let currentPage = 1;
  const rowsPerPage = 5;

  async function loadData() {
    ingredientes = await apiIng.getIngredientes();
  }

  await loadData();

  const getFiltered = () =>
    filterBasic(ingredientes, ["nombre"], searchQuery);

  const getPaginatedRows = () =>
    paginateBasic(getFiltered(), currentPage, rowsPerPage);

  const totalPages = () =>
    totalPagesBasic(getFiltered(), rowsPerPage);

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
    editIngrediente = null;
    const modal = document.getElementById("editar-item");
    if (modal) modal.style.display = "none";
    actualizarVista();
  };

  const editarIngrediente = (ing) => {
    editIngrediente = ing;
    const modal = document.getElementById("editar-item");
    if (modal) modal.style.display = "flex";
    actualizarVista();
  };

  const eliminarIngrediente = async (id) => {
    const res = await mensajeAlert({
      icon: "warning",
      title: "¿Desactivar ingrediente?",
      text: "El ingrediente se marcará como inactivo.",
      showConfirmButton: true,
      showCancelButton: true
    });

    if (!res.isConfirmed) return;

    const r = await apiIng.deleteIngrediente(id);

    if (!r || r.status !== 200) {
      return mensajeAlert({
        icon: "error",
        title: "Error",
        text: "No se pudo desactivar ingrediente."
      });
    }

    await loadData();
    actualizarVista();
  };

  const crearIngrediente = async (e) => {
    e.preventDefault();

    const data = {
      nombre: new_nombre.value,
      costo_extra: Number(new_costo.value),
      stock: Number(new_stock.value),
      activo: document.querySelector('input[name="nuevo_activo"]:checked').value === "true"
    };

    if (!data.nombre || !data.costo_extra || !data.stock) {
      return mensajeAlert({
        icon: "error",
        title: "Campos incompletos",
        text: "Todos los campos son obligatorios."
      });
    }

    const res = await apiIng.createIngrediente(data);

    if (!res || res.status !== 201) {
      return mensajeAlert({
        icon: "error",
        title: "Error",
        text: "No se pudo crear ingrediente."
      });
    }

    await mensajeAlert({
      icon: "success",
      title: "Ingrediente creado",
      text: "Ingrediente creado correctamente.",
      timer: 1200
    });

    await loadData();
    actualizarVista();
  };

  const actualizarIngrediente = async () => {
    const data = {
      nombre: edit_nombre.value,
      costo_extra: Number(edit_costo.value),
      stock: Number(edit_stock.value),
      activo: document.querySelector('input[name="edit_activo"]:checked').value === "true"
    };

    const res = await apiIng.updateIngrediente(editIngrediente.id, data);

    if (!res || res.status !== 200) {
      return mensajeAlert({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar ingrediente."
      });
    }

    await mensajeAlert({
      icon: "success",
      title: "Actualizado",
      text: "Ingrediente actualizado correctamente.",
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
          <h2 style="margin:0">Editar Ingrediente</h2>
        </div>

        <div class="modal-body">
          ${editIngrediente ? html`
            <label class="inp">
              <input type="text" id="edit_nombre" placeholder=" " .value=${editIngrediente.nombre}>
              <span class="label">Nombre</span>
              <span class="focus-bg"></span>
            </label>

            <label class="inp">
              <input type="number" id="edit_costo" placeholder=" " .value=${editIngrediente.costo_extra}>
              <span class="label">Costo Extra</span>
              <span class="focus-bg"></span>
            </label>

            <label class="inp">
              <input type="number" id="edit_stock" placeholder=" " .value=${editIngrediente.stock}>
              <span class="label">Stock</span>
              <span class="focus-bg"></span>
            </label>

            <div class="radio-group" style="display:flex; flex-direction:row; align-items:center; gap: 2.2rem;">
              <p class="radio-title" style="margin-right:5rem">Estado</p>
              <label class="radio-option">
                <input type="radio" name="edit_activo" value="true" ?checked=${editIngrediente.activo}>
                <span></span> Activo
              </label>

              <label class="radio-option">
                <input type="radio" name="edit_activo" value="false" ?checked=${!editIngrediente.activo}>
                <span></span> Inactivo
              </label>
            </div>
            
            <button class="btn-extra" @click=${actualizarIngrediente}>Guardar</button>
          ` : ""}
        </div>
      </div>
    </main>

    <main class="main-contenedor" style="display:flex; flex-direction:column; gap:1.2rem; min-height:100vh;">

      <section class="contenedor-create" style="width:100%; display:flex; align-items:center; justify-content:center; padding:1rem 0;">
        <form class="form-create" style="width:100%; max-width:480px;">
          <h2>Crear Ingrediente</h2>

          <label class="inp">
            <input id="new_nombre" type="text" placeholder=" ">
            <span class="label">Nombre</span>
          </label>

          <label class="inp">
            <input id="new_costo" type="number" placeholder=" ">
            <span class="label">Costo Extra</span>
          </label>

          <label class="inp">
            <input id="new_stock" type="number" placeholder=" ">
            <span class="label">Stock</span>
          </label>

          <div class="radio-group" style="display:flex; flex-direction:row; align-items:center; gap: 2.2rem;">
            <p class="radio-title" style="margin-right:5rem">Estado</p>
            <label class="radio-option">
              <input type="radio" name="nuevo_activo" value="true" checked>
              <span></span> Activo
            </label>

            <label class="radio-option">
              <input type="radio" name="nuevo_activo" value="false">
              <span></span> Inactivo
            </label>
          </div>


          <button class="btn-crear" @click=${crearIngrediente}>Crear</button>
        </form>
      </section>

      <section style="width:70%; margin:0 auto">
        ${renderTableList({
          searchPlaceholder: "Buscar ingrediente...",
          onSearch: (e) => { searchQuery = e.target.value; currentPage = 1; actualizarVista(); },
          rows: getPaginatedRows(),
          columns: [
            { label: "ID", field: "id" },
            { label: "Nombre", field: "nombre" },
            { label: "Costo Extra", field: "costo_extra" },
            { label: "Stock", field: "stock" },
            { label: "Estado", field: "activo", type: "estado" }
          ],
          onEdit: editarIngrediente,
          onDelete: eliminarIngrediente,
          currentPage,
          totalPages: totalPages(),
          prevPage,
          nextPage
        })}
      </section>

    </main>
    `;

    render(template, document.getElementById("contenedor"));
  };

  actualizarVista();
}
