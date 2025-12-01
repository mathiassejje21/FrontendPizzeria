import { html, render } from "lit-html";
import { productoController } from "@controllers/productoController.mjs";
import { categoriaController } from "@controllers/categoriaController.mjs";
import { ingredienteController } from "@controllers/ingredienteController.mjs";
import { mensajeAlert } from "@components/mensajeAlert.mjs";

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
    const vista = document.getElementById("editar_producto");
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
    const vista = document.getElementById("editar_producto");
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
      text: res.mensaje,
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
      timer: 1200
    });

    await loadData();
    seleccionarProducto(productos.find(p => p.id === productoSeleccionado.id));
    limpiarSeleccion();
  };

  const getFilteredProducts = () => {
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getPaginatedRows = () => {
    const filtered = getFilteredProducts();
    const start = (currentPage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  };

  const totalPages = () => {
    const filtered = getFilteredProducts();
    return Math.ceil(filtered.length / rowsPerPage);
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
    <style>
    *{
      margin:0;
      padding:0;
      box-sizing: border-box;
      color: #fff;
    }

    

    #editar_producto{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5);
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index :100000 ! important;
    }

    .contenedor{
      background-color: #fff;
      padding: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
      width: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .main-contenedor{
      padding: 1rem;
      width: 100%;
      height: 100vh;
      display: grid;
      grid-template-columns: 2fr 1.2fr;
      gap: 1rem;
      background-color: #101827;
    }
    
    .main-contenedor .table-productos{
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .main-contenedor .contenedor-productos{
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .contenedor-productos .form-create{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1rem 2rem;
    }

    .contenedor-productos .detalle-producto{
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background-color: #5964782d;
      border-radius: 0.5rem;
    }

    .contenedor-productos .detalle-producto h2{
      margin-bottom: 1rem;
    }

    .contenedor-productos .detalle-producto p{
      margin-bottom: 0.5rem;
    }
    table{
      border-collapse: collapse;
    }
    
    table tr td, table tr th{
      padding: 0.3rem 0.5rem;
      font-size: 0.9rem;
      font-weight: normal;
    }

    table thead tr{
      background: #1d283c;
      color: #fff;
      font-weight: normal;
    }
        
    table tbody tr td:first-child, table thead tr th:first-child{
      border-top-left-radius: 0.3rem;
      border-bottom-left-radius: 0.3rem;
    }

    table tbody tr td:last-child, table thead tr th:last-child{
      border-top-right-radius: 0.3rem;
      border-bottom-right-radius: 0.3rem;
    }
      
    table tbody tr:hover td{
      background: #1d283c;
      color: #fff;
      cursor: pointer; 
    }
    
    .estado-activo{
      color: #2ba972;
      background-color: rgba(43, 169, 114, 0.2);
    }

    .estado-inactivo{
      color: #a92b2bff;
      background-color: rgba(169, 43, 43, 0.2);
    }

    #s { background: rgba(0,0,0,.375) 
    url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAUCAYAAABvVQZ0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQBJREFUeNqslI0RgyAMhdENWIEVWMEVXIGO0BW6Ah2hHcGOoCPYEewINFzBe9IA9id37w4kfEZesHHOCSYUqSPJML+RJlELDwN1pMHxMZNMkr8RTgyz2YPH5LmtwXpIHkOFmKhIlxowDmYAycKnHAHYcTCsSpXOJCie6YWDnXKLGeHLN2stGaqDsXXrX3GFcYcLrfhjtKEhffQ792gYT2nT6pJDjCw4z7ZGdGipOIqNbXIwFUARmCbKpMfYxsWJBmCEDoW7+gYUTAU2s3HJrK3AJvMLkqGHFLgWXTckm+SfSQexs+tLRqwVfgvjgMsvMAT689S5M/sk/I14kO5PAQYAuk6L1q+EdHMAAAAASUVORK5CYII=) no-repeat 14px 14px; 
    text-indent: 1em; display: inline-block; 
    border: 0 none; width: 0; height: 3em; border-radius: 3em; 
    -webkit-transition: .3s; transition: .3s; outline: none; padding: 1em 1.5em; 
    cursor: pointer; -webkit-appearance: none; font-weight: inherit; 
    font-size: inherit; font-family: inherit; color: #999; vertical-align: baseline; }
    input[type=search]::-webkit-search-cancel-button { -webkit-appearance: none; }

    #s:hover, #s:focus { background: #fff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAUCAYAAABvVQZ0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAT5JREFUeNqsVLtOw0AQtIMlRJHCEhUVMg398QEUSZnSfILzCXxDPsFu6XAJHWnTcS1lWsprKdmLxtKwvjVBYaTV7cm+udnX5fPb+yyBSmwhVmK/FfPZLyjUPhI8YtXYi23EOovs7PzyevAbsWeoGg5HNUHsCipX8F9TZDOstVgLPxIsxW6w3sHv6dJ2StkLbh6IPtR/AWRfSIET20H9D2U1hfaAgxY2KMagcBSmg9/rmwx0lBqTzGfHoVfVHxXgXzCjHNRHnnHke4vMGc2q0RBR0GSeCLlpLaJGFWKUszVuib32nih7iTFrjXAPyGnQ48c3Gu5AOVlMtMk6NZuf+FiC+AIhV0T+pBQ5ntXceIJKqKko2duJ2TwoLAz5QTVnagJaXWEO8y/wSMuKH9RTJoCTHyNZFidOUEfNu/8WYAAOXUT04MOtlwAAAABJRU5ErkJggg==) 14px 14px no-repeat; }

    #s:focus { width: 40%; cursor: text; }

    .pagination{
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .pagination span{
      font-size: 0.9rem;
      font-weight: 500;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 120px;
      text-align: center;
    }

    .pagination button{
      padding: 0.45rem 1.2rem;
      border-radius: 0.6rem;
      border:none;
      background-color: rgba(43, 169, 114, 0.2);
      color: #fff;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.25s ease;
      font-weight: 600;
      min-width: 90px;
    }

    .pagination button:hover{
      background-color: #58615aff;
      color: #000;
    }

    .pagination button:disabled{
      background-color: #d1d5db;
      border-color: #cbd5e1;
      color: #6b7280;
      cursor: not-allowed;
      opacity: 0.65;
    }

    .pagination button:disabled:hover{
      background-color: #d1d5db;
      color: #6b7280;
      border-color: #cbd5e1;
    }

    .button-crud.edit{
      border: none;
      border-radius: 0.6rem;
      background-color: #dabd1aff;
      transition: all 0.25s ease;      
    }

    .button-crud.delete{
      border: none;
      border-radius: 0.6rem;
      background-color: #972727ff;
      transition: all 0.25s ease;      
    }

    .button-crud:hover{
      transform: scale(1.08);
    }

    .btn-submit{
      width: 100%;
      padding: 0.6rem;
      border-radius: 0.4rem;
      border: none;
      background: #4ade80;
      color: #1d283c;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      transition: .2s ease;
      margin-top: 0.8rem;
    }

    .btn-submit:hover{
      background: #6ff29d;
      transform: scale(1.02);
    }

    

    </style>
    <main id="editar_producto">
      <div class="contenedor">
        <div class="header" style="display:flex; justify-content: row; gap:1rem">
          <h2>Editar Producto</h2>
          <button class=" "
            @click=${() => { modoIngredientes = false, modoEliminarIngrediente = null; actualizarVista(); }}>
            Volver
          </button>
          <button class="" @click=${irAIngredientes}>Agregar ingredientes</button>
          <button class="" @click=${irAEliminarIngrediente}>Eliminar ingredientes</button>
          <button class="" @click=${limpiarSeleccion}>X</button>
        </div>       
        ${modoIngredientes ? html`
          <h3>Ingredientes</h3>
          <h4>Seleccionar ingredientes</h4>
          <div class="">
            ${ingredientes.map(i => {
              const tiene = productoSeleccionado.ingredientes?.some(pi => pi.id === i.id);
              return html`
                <label class="item-ing">
                  <input type="checkbox" class="chk-ing" value="${i.id}" ?checked=${tiene}>
                  ${i.nombre}
                </label>
              `;
            })}
          </div>

          <button class="" @click=${guardarIngredientesProducto}>
            Guardar ingredientes
          </button>

        ` : modoEliminarIngrediente ? html`
          <h4>Eliminar ingrediente</h4>
          ${productoSeleccionado.ingredientes?.length > 0 ? html`
            <div class="">
              ${productoSeleccionado.ingredientes.map(i => html`
                <label class="">
                  <input type="radio" name="del_ing" value="${i.id}"
                    @change=${() => seleccionarIngredienteEliminar(i.id)}>
                  ${i.nombre}
                </label>
              `)}
            </div>
            <button class="" @click=${eliminarIngrediente}>
              Eliminar ingrediente seleccionado
            </button>
          ` : html`<p>No tiene ingredientes.</p>`}

        ` : productoSeleccionado ? html`

          <input id="edit_nombre" .value=${productoSeleccionado.nombre}>
          <textarea id="edit_descripcion">${productoSeleccionado.descripcion}</textarea>
          <input id="edit_precio" type="number" .value=${productoSeleccionado.precio}>

          <label><input type="radio" name="edit_personalizable" value="false" ?checked=${!productoSeleccionado.personalizable}> No personalizable</label>
          <label><input type="radio" name="edit_personalizable" value="true" ?checked=${productoSeleccionado.personalizable}> Personalizable</label>

          <label><input type="radio" name="edit_activo" value="true" ?checked=${productoSeleccionado.activo}> Activo</label>
          <label><input type="radio" name="edit_activo" value="false" ?checked=${!productoSeleccionado.activo}> Inactivo</label>

          <select id="edit_categoria">
            ${categorias.map(c => html`
              <option value="${c.id}" ?selected=${productoSeleccionado.id_categoria === c.id}>${c.nombre}</option>
            `)}
          </select>

          <input id="edit_imagen" .value=${productoSeleccionado.imagen_url}>

          <button class="" @click=${actualizarProducto}>Guardar</button>

        `:''}   
      </div>
    </main>

      
    <main class="main-contenedor">
      <section class="table-productos">
        <h2>Productos</h2>

        <input
          type="text"
          placeholder="Buscar producto..."
          id="s"
          @input=${(e) => {
            searchQuery = e.target.value;
            currentPage = 1;
            actualizarVista();
          }}
        >

        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Item</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            ${getPaginatedRows().map(p => html`
              <tr class="" @click=${() => seleccionarProductoDetalle(p)}>
                <td>${p.id}</td>
                <td style="display: flex; align-items: center; gap: 0.4rem;">
                  <img src="${p.imagen_url}" style="border-radius: 0.5rem; width: 30px; height: 30px; object-fit: cover;">
                  <p style=" margin: 0;">${p.nombre}</p>
                </td>
                <td>S/${p.precio}</td>
                <td>${p.categoria?.nombre}</td>
                <td style="margin: 0; padding: 0;">
                  <p class="${p.activo ? 'estado-activo' : 'estado-inactivo'}" style="
                    margin: 0; 
                    padding: 0.1rem 0; 
                    border-radius: 0.3rem;
                    font-size: 0.7rem; 
                    text-align: center;
                  ">
                    ${p.activo ? "Activo" : "Inactivo"}
                  </p>
                <td>
                  <div style="display: flex; align-items: center; gap: 0.5rem; justify-content: center;">
                    <button class="button-crud edit" @click=${(e) => {
                      e.stopPropagation();
                      seleccionarProducto(p);}}>
                      <img src="https://img.icons8.com/?size=100&id=5zgHRe4QDGaa&format=png&color=000000" style="width: 20px; height: 20px;">
                    </button>
                    <button class="button-crud delete" @click=${(e) => {
                      e.stopPropagation();
                      eliminarProducto(p.id)}}>
                      <img src="https://img.icons8.com/?size=100&id=wYGuaDndspJI&format=png&color=000000" style="width: 20px; height: 20px;">
                    </button>
                  </div>
                </td>
              </tr>
            `)}
          </tbody>
        </table>

        <div class="pagination">
          <button class="" @click=${prevPage} ?disabled=${currentPage === 1}>Anterior</button>
          <span>Página ${currentPage} de ${totalPages()}</span>
          <button class="" @click=${nextPage} ?disabled=${currentPage === totalPages()}>Siguiente</button>
        </div>
      </section>
    
      <section class="contenedor-productos">
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

          <button class="btn-submit" @click=${crearProducto}>Crear</button>
        </form>


        <div class="detalle-producto">
          ${productoSeleccionadoView ? html`
            <div class="detalle-header" style="display: flex;">
              <div width="100%">
                <img src=${productoSeleccionadoView.imagen_url} class="detalle-img" style="width: 80%;height: 80%; object-fit: cover;" >
              </div>
              <div class="detalle-info">
                <p>ID: ${productoSeleccionadoView.id}</p>
                <p>${productoSeleccionadoView.nombre}</p>
                <p>Precio: S/.${productoSeleccionadoView.precio}</p>
                <p>Categoría: ${productoSeleccionadoView.categoria.nombre}</p>
              </div>
            </div>

            <div class="detalle-descripcion">
              <p>${productoSeleccionadoView.descripcion}</p>
              <p>${productoSeleccionadoView.personalizable}</p> 
              <p>${productoSeleccionadoView.activo}</p>
            </div>

            <button @click=${() => limpiarSeleccion()}>X</button>

          ` : html`Seleccione un producto`}
        </div>

      </section>
    </main>
    `;

    render(template, document.getElementById("contenedor"));
  };

  actualizarVista();
}
