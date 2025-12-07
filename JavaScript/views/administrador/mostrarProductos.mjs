import { html, render } from "lit-html";
import { productoController } from "@controllers/productoController.mjs";
import { categoriaController } from "@controllers/categoriaController.mjs";
import { ingredienteController } from "@controllers/ingredienteController.mjs";
import { mensajeAlert } from "@components/mensajeAlert.mjs";
import { filterBasic, paginateBasic, totalPagesBasic } from "@/service/listTools.mjs";
import { renderTableList } from "@components/tableList.mjs";

export async function renderProductosView() {
  const apiProducto = new productoController();
  const apiCategoria = new categoriaController();
  const apiIngredientes = new ingredienteController();

  let productos = [];
  let categorias = [];
  let ingredientes = [];
  let productoSeleccionado = null;
  let productoSeleccionadoView = null;
  let modoIngredientes = false;
  let modoEliminarIngrediente = false;
  let ingredienteAEliminar = null;

  let searchQuery = "";
  let currentPage = 1;
  const rowsPerPage = 10;

  async function loadData() {
    productos = await apiProducto.getProductos();
    categorias = await apiCategoria.getCategoriasActivo();
    ingredientes = await apiIngredientes.getIngredientes();
  }

  await loadData();

  const seleccionarProductoDetalle = (prod) => {
    productoSeleccionadoView = prod;
    modoIngredientes = false;
    ingredienteAEliminar = null;
    actualizarVista();
  };

  const seleccionarProducto = (prod) => {
    productoSeleccionado = prod;
    modoIngredientes = false;
    ingredienteAEliminar = null;
    const vista = document.getElementById("editar-item");
    vista.style.display = "flex";
    actualizarVista();
  };

  const irAIngredientes = () => {
    modoEliminarIngrediente = false;
    modoIngredientes = true;
    ingredienteAEliminar = null;
    actualizarVista();
  };

  const irAEliminarIngrediente = () => {
    modoEliminarIngrediente = true;
    modoIngredientes = false;
    ingredienteAEliminar = null;
    actualizarVista();
  };

  const seleccionarIngredienteEliminar = (idIng) => {
    ingredienteAEliminar = idIng;
  };

  const limpiarSeleccion = () => {
    productoSeleccionado = null;
    productoSeleccionadoView = null;
    modoIngredientes = false;
    ingredienteAEliminar = null;
    const vista = document.getElementById("editar-item");
    vista.style.display = "none";
    actualizarVista();
  };

  const eliminarProducto = async (id) => {
    const res = await mensajeAlert({
      icon: "warning",
      title: "¿Desactivar producto?",
      text: "El producto se marcará como inactivo.",
      showConfirmButton: true,
      showCancelButton: true
    });

    if (!res.isConfirmed) return;

    const r = await apiProducto.deleteProducto(id);
    if (!r || r.status !== 200) {
      return mensajeAlert({
        icon: "error",
        title: "Error",
        text: "No se pudo desactivar."
      });
    }

    await loadData();
    limpiarSeleccion();
  };

  const crearProducto = async (e) => {
    e.preventDefault();

    const data = {
      nombre: new_nombre.value,
      descripcion: new_descripcion.value,
      precio: new_precio.value,
      id_categoria: Number(new_categoria.value),
      personalizable: document.querySelector('input[name="personalizable"]:checked').value === "true",
      activo: document.querySelector('input[name="activo"]:checked').value === "true",
      imagen_url: new_imagen.value
    };

    if (!data.nombre || !data.precio) {
      return mensajeAlert({
        icon: "error",
        title: "Campos incompletos",
        text: "Nombre y precio obligatorios.",
        showConfirmButton: true
      });
    }

    const res = await apiProducto.createProducto(data);
    if (!res || res.status !== 201) {
      return mensajeAlert({
        icon: "error",
        title: "Error",
        text: "No se pudo crear."
      });
    }

    await mensajeAlert({
      icon: "success",
      title: "Producto creado",
      text: "Creado correctamente.",
      timer: 1200
    });

    await loadData();
    actualizarVista();
    limpiarSeleccion();
  };

  const actualizarProducto = async () => {
    const data = {
      nombre: edit_nombre.value,
      descripcion: edit_descripcion.value,
      precio: edit_precio.value,
      personalizable: document.querySelector('input[name="edit_personalizable"]:checked').value === "true",
      activo: document.querySelector('input[name="edit_activo"]:checked').value === "true",
      id_categoria: Number(edit_categoria.value),
      imagen_url: edit_imagen.value
    };

    const res = await apiProducto.updateProducto(productoSeleccionado.id, data);

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
    seleccionarProducto(productos.find(p => p.id === productoSeleccionado.id));
    limpiarSeleccion();
  };

  const guardarIngredientesProducto = async () => {
    const seleccionados = [...document.querySelectorAll(".chk-ing")]
      .filter(c => c.checked)
      .map(c => Number(c.value));

    if (seleccionados.length === 0) {
      return mensajeAlert({ 
        icon: "warning",
        title: "Ningún ingrediente",
        text: "Selecciona al menos uno.",
        showConfirmButton: true
      });
    }

    const res = await apiProducto.assingIngredienteToProducto(
      productoSeleccionado.id,
      { ingredientes: seleccionados }
    );

    if (!res || res.status !== 200) {
      return mensajeAlert({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar."
      });
    }

    await mensajeAlert({
      icon: "success",
      title: "Ingredientes actualizados",
      text: "Guardados correctamente.",
      timer: 1200
    });

    await loadData();
    seleccionarProducto(productos.find(p => p.id === productoSeleccionado.id));
    limpiarSeleccion();
  };

  const eliminarIngrediente = async () => {
    if (!ingredienteAEliminar) {
      return mensajeAlert({
        icon: "warning",
        title: "Elige un ingrediente",
        text: "Debes seleccionar uno.",
        showConfirmButton: true
      });
    }

    const confirm = await mensajeAlert({
      icon: "warning",
      title: "¿Eliminar ingrediente?",
      text: "Se eliminará del producto.",
      showConfirmButton: true,
      showCancelButton: true
    });

    if (!confirm.isConfirmed) return;

    const res = await apiProducto.deleteIngredienteFromProducto(
      productoSeleccionado.id,
      ingredienteAEliminar
    );

    if (!res || res.status !== 200) {
      return mensajeAlert({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar."
      });
    }

    await mensajeAlert({
      icon: "success",
      title: "Ingrediente eliminado",
      text: "Eliminado correctamente.",
      timer: 1200
    });

    await loadData();
    seleccionarProducto(productos.find(p => p.id === productoSeleccionado.id));
    limpiarSeleccion();
  };

  const getFilteredProducts = () => {
    return filterBasic(
      productos,                
      ["nombre", "descripcion"],
      searchQuery                
    );
  };

  const getPaginatedRows = () => {
    const filtered = getFilteredProducts();
    return paginateBasic(filtered, currentPage, rowsPerPage);
  };

  const totalPages = () => {
    const filtered = getFilteredProducts();
    return totalPagesBasic(filtered, rowsPerPage);
  };

  const prevPage = () => {
    if (currentPage > 1) {
      currentPage--;
      actualizarVista();
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages()) {
      currentPage++;
      actualizarVista();
    }
  };

  const actualizarVista = () => {
    const template = html`
    <main id="editar-item">
      <div class="contenedor">

        <button class="btn-closed" @click=${() => limpiarSeleccion()}>
          <img src="https://img.icons8.com/?size=100&id=ZqgesvdZtgAB&format=png&color=FFFFFF" 
              style="width:1.9rem; opacity:.8;">
        </button>

        <div class="header">
          <h2 style="margin:0">Editar Producto</h2>

          <div style="display:flex; gap:.5rem;">
            ${modoIngredientes || modoEliminarIngrediente ? html`
              <button class="btn-back"
                @click=${() => { modoIngredientes = false; modoEliminarIngrediente = null; actualizarVista(); }}>
                <img src="https://img.icons8.com/?size=100&id=26191&format=png&color=FFFFFF" 
                    style="width:2.2rem; opacity:.8;">
              </button>
            ` : ""}
            ${productoSeleccionado?.personalizable? html`
            <button class="btn-extra agregar" @click=${irAIngredientes}>
              <img src="https://img.icons8.com/?size=100&id=37839&format=png&color=000000" 
                  style="width:1.5em; opacity:.8;">
              <p style="margin:0">Ingrediente</p>
            </button>
            <button class="btn-extra eliminar" @click=${irAEliminarIngrediente}>
              <img src="https://img.icons8.com/?size=100&id=12386&format=png&color=000000" 
                  style="width:1.5em; opacity:.8;">
              <p style="margin:0">Ingrediente</p>
            </button>
            ` : ""}
          </div>
        </div>


        <div class="modal-body">

          ${modoIngredientes? html`
            <h3>Ingredientes</h3>
            <div style="display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: .4rem .8rem;
              width: 100%"
              >
              ${ingredientes.map(i => {
                const tiene = productoSeleccionado.ingredientes?.some(pi => pi.id === i.id);
                return html`
                  <label class="radio-option">
                    <input type="checkbox" class="chk-ing" value="${i.id}" ?checked=${tiene}>
                    <span></span> ${i.nombre}
                  </label>
                `;
              })}
            </div>
            <button class="btn-extra" @click=${guardarIngredientesProducto}>Guardar</button>

          ` : modoEliminarIngrediente ? html`

            <h3>Eliminar Ingrediente</h3>
            ${productoSeleccionado.ingredientes?.length > 0 ?
              
              productoSeleccionado.ingredientes.map(i => html`
                <label class="radio-option">
                  <input type="radio" name="del_ing" value="${i.id}"
                    @change=${() => seleccionarIngredienteEliminar(i.id)}>
                  <span></span> ${i.nombre}
                </label>
              `)
            : html`<p>No tiene ingredientes.</p>`}
            <button class="btn-extra" @click=${eliminarIngrediente}>Eliminar selección</button>

          ` : productoSeleccionado ? html`

            <label class="inp">
              <input type="text" id="edit_nombre" placeholder=" " .value=${productoSeleccionado.nombre}>
              <span class="label">Nombre</span>
              <span class="focus-bg"></span>
            </label>

            <label class="inp">
              <input type="text" id="edit_descripcion" placeholder=" " .value=${productoSeleccionado.descripcion}>
              <span class="label">Descripción</span>
              <span class="focus-bg"></span>
            </label>

            <label class="inp">
              <input type="number" id="edit_precio" placeholder=" " .value=${productoSeleccionado.precio}>
              <span class="label">Precio</span>
              <span class="focus-bg"></span>
            </label>
            
            <div style="display:flex; justify-content: space-between; align-items: center; padding: 0 2rem;">
            <div class="radio-group">
              <p class="radio-title">Personalizable</p>
              <label class="radio-option">
                <input type="radio" name="edit_personalizable" value="false" ?checked=${!productoSeleccionado.personalizable}>
                <span></span> No personalizable
              </label>
              <label class="radio-option">
                <input type="radio" name="edit_personalizable" value="true" ?checked=${productoSeleccionado.personalizable}>
                <span></span> Personalizable
              </label>
            </div>

            <div class="radio-group">
              <p class="radio-title">Estado</p>
              <label class="radio-option">
                <input type="radio" name="edit_activo" value="true" ?checked=${productoSeleccionado.activo}>
                <span></span> Activo
              </label>
              <label class="radio-option">
                <input type="radio" name="edit_activo" value="false" ?checked=${!productoSeleccionado.activo}>
                <span></span> Inactivo
              </label>
            </div>
            </div>

            <div class="select-modern">
              <select id="edit_categoria">
                ${categorias.map(c => html`
                  <option value="${c.id}" ?selected=${productoSeleccionado.id_categoria === c.id}>
                    ${c.nombre}
                  </option>
                `)}
              </select>
            </div>

            <label class="inp">
              <input type="text" id="edit_imagen" placeholder=" " .value=${productoSeleccionado.imagen_url}>
              <span class="label">URL Imagen</span>
              <span class="focus-bg"></span>
            </label>

            <button class="btn-extra" @click=${actualizarProducto}>Guardar Cambios</button>

          ` : ""}
        </div>
      </div>
    </main>

      
    <main class="main-contenedor">
      ${renderTableList ({
        title: "Productos",
        searchPlaceholder: "Buscar producto...",
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
          { label: "Precio", field: "precio" },
          { label: "Categoría", field: "categoria.nombre" },
          { label: "Estado", field: "activo", type: "estado" }
        ],
        onRowClick: seleccionarProductoDetalle,
        onEdit: seleccionarProducto,
        onDelete: eliminarProducto,
        currentPage,
        totalPages: totalPages(),
        prevPage,
        nextPage
      })}
      <section class="contenedor-create">
        <form class="form-create">
          <h2>Crear Producto</h2>
          <div style="display: flex; gap: 0.5rem; width: 100%;">
            <label class="inp">
              <input type="text" id="new_nombre" placeholder=" ">
              <span class="label">Nombre</span>
              <span class="focus-bg"></span>
            </label>
            <label class="inp">
              <input type="number" id="new_precio" placeholder=" ">
              <span class="label">Precio</span>
              <span class="focus-bg"></span>
            </label>
          </div> 
          <label class="inp">
            <input type="text" id="new_descripcion" placeholder=" ">
            <span class="label">Descripción</span>
            <span class="focus-bg"></span>
          </label>

          <div class="select-modern">
            <select id="new_categoria">
              <option value="" disabled selected>Seleccione categoría</option>
              ${categorias.map(c => html`
                <option value="${c.id}">${c.nombre}</option>
              `)}
            </select>
          </div>
          <div style="display: flex; gap: 1rem; margin:0; padding: 0; justify-content: space-between;width: 100%;">
            <div class="radio-group">
              <p class="radio-title">Personalizable</p>
              <label class="radio-option">
                <input type="radio" name="personalizable" value="false" checked>
                <span></span> No personalizable
              </label>

              <label class="radio-option">
                <input type="radio" name="personalizable" value="true">
                <span></span> Personalizable
              </label>
            </div>
            <div class="radio-group">
              <p class="radio-title">Estado</p>
              <label class="radio-option">
                <input type="radio" name="activo" value="true" checked>
                <span></span> Activo
              </label>

              <label class="radio-option">
                <input type="radio" name="activo" value="false">
                <span></span> Inactivo
              </label>
            </div>
          </div>
          
          <label class="inp">
            <input type="text" id="new_imagen" placeholder=" ">
            <span class="label">URL imagen</span>
            <span class="focus-bg"></span>
          </label>

          <button class="btn-crear" @click=${crearProducto}>Crear</button>
        </form>

        <div class="detalle-item">
          ${productoSeleccionadoView ? html`

            <button class="btn-closed" @click=${() => limpiarSeleccion()}>
              <img src="https://img.icons8.com/?size=100&id=ZqgesvdZtgAB&format=png&color=000000" style="width:2rem ; height: 2rem;">
            </button>

            <div class="detalle-header">
              <img src=${productoSeleccionadoView.imagen_url} class="detalle-img">

              <div class="detalle-info">
                <p><strong>ID: </strong>${productoSeleccionadoView.id}</p>
                <p><strong>${productoSeleccionadoView.nombre}</strong></p>
                <p><strong>Precio:</strong> S/.${productoSeleccionadoView.precio}</p>
                <p><strong>Categoría: </strong>${productoSeleccionadoView.categoria.nombre}</p>
              </div>
            </div>

            <div class="detalle-descripcion">
              <p><strong>Descripción: </strong>${productoSeleccionadoView.descripcion}</p>
              <p>${productoSeleccionadoView.personalizable ? "Personalizable" : "No personalizable"}</p>
              <p><strong>Estado: </strong>${productoSeleccionadoView.activo ? "Activo" : "Inactivo"}</p>
            </div>

          ` : html`
            <p>Seleccione un producto</p>
          `}
        </div>
      </section>
    </main>
    `;

    render(template, document.getElementById("contenedor"));
  };

  actualizarVista();
}
