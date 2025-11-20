import { html, render } from 'lit-html'
import { mensajeAlert } from '@components/mensajeAlert.mjs'
import { userController } from '@controllers/userController.mjs'
import { pagoController } from '@controllers/pagoController.mjs'
import { pedidoController } from '@controllers/pedidoController.mjs'

export async function mostrarDetalleCarrito () {
  const contenedor = document.getElementById('contenedor')

  const carrito = JSON.parse(sessionStorage.getItem('carrito')) || []
  const total = Number(sessionStorage.getItem('carrito_total')) || 0
  const userSession = sessionStorage.getItem('user')

  if (carrito.length === 0) {
    const empty = html`
      <div class="container py-4">
        <h2>Carrito vacío</h2>
        <button class="btn btn-secondary mt-3" @click=${() => window.history.back()}>
          Volver
        </button>
      </div>
    `
    return render(empty, contenedor)
  }

  let repartidores = []
  let metodoPago = []

  if (userSession) {
    const u = JSON.parse(userSession)
    if (u.rol === 'cliente' || u.rol?.nombre === 'cliente') {
      const userApi = new userController()
      const pagoApi = new pagoController()
      repartidores = await userApi.getUser()
      metodoPago = await pagoApi.getPago()
    }
  }

  async function hundleCheckout () {
    if (userSession) {
      const pedidoApi = new pedidoController()
      const userId = JSON.parse(userSession).id
      const metodo = Number(document.getElementById('select-pago')?.value)
      const repartidorId =
        metodo === 1
          ? null
          : parseInt(document.getElementById('select-repartidor')?.value, 10) || null

      const pedido = {
        id_cliente: userId,
        id_repartidor: repartidorId,
        id_metodo_pago: metodo,
        detalles: carrito.map(p => {
          if (!p.personalizable) {
            return {
              id_producto: p.id,
              cantidad: p.cantidad
            }
          }

          const personalizaciones = {}

          if (p.tamanio?.id) {
            personalizaciones.id_tamano = p.tamanio.id
          }

          if (Array.isArray(p.ingredientes) && p.ingredientes.length > 0) {
            personalizaciones.ingredientes = p.ingredientes.map(ing => ({
              id_ingrediente: ing.id,
              cantidad: 1
            }))
          }

          return {
            id_producto: p.id,
            cantidad: p.cantidad,
            personalizaciones
          }
        })
      }

      const res = await pedidoApi.crearPedido(pedido)
      console.log(res)
    } else {
      mensajeAlert({
        icon: 'warning',
        title: 'Acceso denegado',
        text: 'Es necesario iniciar sesión para realizar la compra.',
        showConfirmButton: true
      }).then(() => (location.href = '/pizzeria/login'))
    }
  }

  const template = html`
    <style>
      .carrito-main {
        max-width: 95%;
        margin: 2rem auto;
        display: flex;
        gap: 2rem;
      }
      .carrito-box {
        flex: 2.3;
        background: #fff;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        height: fit-content;
      }
      .carrito-side {
        flex: 0.7;
        background: #fff;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        height: fit-content;
      }
      .hidden {
        display: none !important;
      }
      table img {
        width: 70px;
        height: 70px;
        object-fit: cover;
        border-radius: 0.5rem;
      }
      .side-title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 0.7rem;
      }
      .side-section label {
        font-weight: 600;
      }
      .side-section select {
        margin-top: 0.4rem;
      }
      .table-total {
        margin-top: 1rem;
        text-align: right;
        background-color: transparent !important;
      }
      .table-total.hidden {
        display: none;
      }
    </style>

    <div class="carrito-main">
      <div class="carrito-box">
        <h2>Detalle del Carrito</h2>

        <table class="table table-striped mt-3">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Producto</th>
              <th>Tamaño</th>
              <th>Ingredientes extra</th>
              <th>Cantidad</th>
              <th>Precio Unit.</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            ${carrito.map(p => {
              const extraIng = (p.ingredientes || [])
                .reduce((acc, ing) => acc + Number(ing.costo_extra), 0)

              const precioUnit =
                Number(p.precioReal) * (p.tamanio?.factor_precio ?? 1) + extraIng

              return html`
                <tr>
                  <td><img src="${p.imagen_url}" alt="${p.nombre}" /></td>

                  <td>
                    <strong>${p.nombre}</strong><br />
                    ${p.descripcion ?? ''}
                  </td>

                  <td>${p.tamanio ? p.tamanio.nombre : '-'}</td>

                  <td>
                    ${(p.ingredientes?.length ?? 0) > 0
                      ? html`
                          <ul style="padding-left: 1.2rem; margin: 0;">
                            ${p.ingredientes.map(i => html`<li>${i.nombre}</li>`)}
                          </ul>
                        `
                      : '-'}
                  </td>

                  <td>${p.cantidad}</td>
                  <td>S/. ${precioUnit.toFixed(2)}</td>
                  <td>S/. ${(precioUnit * p.cantidad).toFixed(2)}</td>
                </tr>
              `
            })}

            <tr class="table-total ${userSession ? 'hidden' : ''}">
              <td colspan="6">TOTAL FINAL:</td>
              <td><strong>S/. ${total.toFixed(2)}</strong></td>
            </tr>

            <tr class="table-total ${userSession ? 'hidden' : ''}">
              <td colspan="7">
                <button class="btn btn-danger" @click=${hundleCheckout}>
                  Realizar Pedido
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="carrito-side ${!userSession ? 'hidden' : ''}">
        <div class="side-section">
          <div class="side-title">Método de Pago</div>
          <select
            class="form-select"
            id="select-pago"
            @change=${() => {
              const metodo = Number(
                document.getElementById('select-pago').value
              )
              document
                .getElementById('box-repartidor')
                .classList.toggle('hidden', metodo === 1)
            }}
          >
            ${metodoPago.map(
              m => html`<option value="${m.id}">${m.tipo}</option>`
            )}
          </select>
        </div>

        <div id="box-repartidor" class="side-section">
          <div class="side-title">Repartidor</div>
          <select class="form-select" id="select-repartidor">
            ${repartidores.length > 0
              ? repartidores.map(
                  r => html`
                    <option value="${r.id}">
                      ${r.nombre} — ${r.telefono}
                    </option>
                  `
                )
              : html`<option disabled>No hay repartidores</option>`}
          </select>
        </div>

        <div class="side-section">
          <div class="side-title">Total a pagar</div>
          <p style="font-size: 22px; font-weight: bold; color: #d40000;">
            S/. ${total.toFixed(2)}
          </p>
        </div>

        <div class="side-section" style="display: flex; flex-direction: column;">
          <button class="btn btn-danger" @click=${hundleCheckout}>
            Finalizar compra
          </button>
        </div>
      </div>
    </div>
  `

  render(template, contenedor)

  const metodoInicial = Number(document.getElementById('select-pago')?.value)
  document
    .getElementById('box-repartidor')
    ?.classList.toggle('hidden', metodoInicial === 1)
}
