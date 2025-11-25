import { html, render } from 'lit-html'
import { mensajeAlert } from '@components/mensajeAlert.mjs'
import { pedidoController } from '@controllers/pedidoController.mjs'

export async function mostrarDetalleCarrito (user) {
  const contenedor = document.getElementById('contenedor')

  const carrito = JSON.parse(sessionStorage.getItem('carrito')) || []
  const total = Number(sessionStorage.getItem('carrito_total')) || 0
  const userSession = user

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

  async function hundleCheckout () {
    if (!userSession) {
      return mensajeAlert({
        icon: 'warning',
        title: 'Acceso denegado',
        text: 'Debes iniciar sesión para continuar.',
        showConfirmButton: true
      }).then(() => (location.href = '/pizzeria/login'))
    }

    const pedidoApi = new pedidoController()
    const userId = userSession.id

    const pedido = {
      id_cliente: userId,
      id_metodo_pago: 2,
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

    if (res.status === 201) {
      const data = {
        id_pedido: res.pedido.id,
        url_pago: res.url_pago
      };

      sessionStorage.setItem("last_payment_url", JSON.stringify(data));
      sessionStorage.removeItem('carrito')
      sessionStorage.removeItem('carrito_total')
      window.location.href = res.url_pago
    }
  }

  const template = html`
    <style>
      .carrito-main {
        max-width: 95%;
        margin: 2rem auto;
        display: flex;
        gap: 2rem;
        animation: fade .3s ease-in-out;
      }

      @keyframes fade {
        from { opacity: 0; transform: translateY(6px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .carrito-box, .carrito-side {
        background: #fff;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 5px 22px rgba(0,0,0,0.10);
        height: fit-content;
      }

      .carrito-box {
        flex: 2.5;
      }

      .carrito-side {
        flex: 0.8;
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
      }

      table img {
        width: 70px;
        height: 70px;
        object-fit: cover;
        border-radius: .5rem;
      }

      .side-title {
        font-size: 20px;
        font-weight: 700;
        color: #0a3a17;
      }

      .pago-box {
        background: #f3f7f4;
        border-radius: .8rem;
        padding: 1rem;
        border-left: 5px solid #0a3a17;
      }

      .pago-label {
        font-size: 18px;
        font-weight: 600;
        color: #0a3a17;
      }

      .total-final {
        font-size: 26px;
        font-weight: bold;
        color: #d40000;
        text-align: center;
      }

      .finalizar-btn {
        padding: 1rem;
        font-size: 18px;
        font-weight: 600;
      }
    </style>

    <div class="carrito-main">
      <div class="carrito-box">
        <h2 style="color:#0a3a17; font-weight:800;">Detalle del Carrito</h2>

        <table class="table mt-3">
          <thead style="background:#0a3a17; color:white;">
            <tr>
              <th>Imagen</th>
              <th>Producto</th>
              <th>Tamaño</th>
              <th>Ingredientes</th>
              <th>Cant.</th>
              <th>Unit.</th>
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

                  <td><strong>${p.nombre}</strong><br /><small>${p.descripcion ?? ''}</small></td>

                  <td>${p.tamanio ? p.tamanio.nombre : '-'}</td>

                  <td>
                    ${(p.ingredientes?.length ?? 0) > 0
                      ? html`<ul style="padding-left:1rem; margin:0;">
                          ${p.ingredientes.map(i => html`<li>${i.nombre}</li>`)}
                        </ul>`
                      : '-'}
                  </td>

                  <td>${p.cantidad}</td>
                  <td>S/. ${precioUnit.toFixed(2)}</td>
                  <td>S/. ${(precioUnit * p.cantidad).toFixed(2)}</td>
                </tr>
              `
            })}
          </tbody>
        </table>
      </div>

      <div class="carrito-side">

        <div class="side-title">Pago</div>

        <div class="pago-box">
          <div class="pago-label">Pasarela de Pago</div>
          <p style="margin:0; color:#444;">Tu compra será completada mediante una pasarela segura.</p>
        </div>

        <div>
          <div class="side-title">Total a pagar</div>
          <div class="total-final">S/. ${total.toFixed(2)}</div>
        </div>

        <button class="btn btn-danger finalizar-btn" @click=${hundleCheckout}>
          Ir a pagar
        </button>
      </div>
    </div>
  `

  render(template, contenedor)
}
