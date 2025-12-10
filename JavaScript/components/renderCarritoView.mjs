import { html, render } from 'lit-html'
import { mensajeAlert } from '@components/mensajeAlert.mjs'
import { pedidoController } from '@controllers/pedidoController.mjs'

export async function renderCarritoView(user, contenedor = document.getElementById('contenedor')) {
  const carrito = JSON.parse(sessionStorage.getItem('carrito')) || []
  const total = Number(sessionStorage.getItem('carrito_total')) || 0

  if (carrito.length === 0) {
    return render(html`
      <div style="padding-top:7rem; text-align:center; color:white;">
        <h2>Carrito vacío</h2>
        <button @click=${() => window.history.back()}
          style="margin-top:1rem; padding:.8rem 1.5rem; border-radius:10px; background:#ff7b4a; color:white; border:none;">
          Volver
        </button>
      </div>
    `, contenedor)
  }

  async function hundleCheckout () {
    if (!user) {
      return mensajeAlert({
        icon: 'warning',
        title: 'Acceso denegado',
        text: 'Debes iniciar sesión para continuar.',
        showConfirmButton: true
      }).then(() => location.href = '/pizzeria/login')
    }

    const pedidoApi = new pedidoController()
    const isCliente = user.rol === 'cliente'
    const isPersonal = user.rol === 'personal'

    const userId = isCliente ? user.id : 1
    const metodoPagoID = isCliente ? 2 : 1

    const pedido = {
      id_cliente: userId,
      id_metodo_pago: metodoPagoID,
      detalles: carrito.map(p => {
        if (!p.personalizable) return { id_producto: p.id, cantidad: p.cantidad }

        const personalizaciones = {}

        if (p.tamanio?.id) personalizaciones.id_tamano = p.tamanio.id

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
      await mensajeAlert({
        icon: 'success',
        title: 'Pedido creado',
        text: 'El pedido se ha creado correctamente.',
        timer:1000
      })

      sessionStorage.removeItem('carrito')
      sessionStorage.removeItem('carrito_total')

      if (isPersonal) {
        await pedidoApi.updateEstadoPedido(res.pedido.id, 2)
        return location.href = '/personal/pedidos'
      }

      const data = {
        id_pedido: res.pedido.id,
        url_pago: res.pedido.pedido_url
      }

      sessionStorage.setItem("last_payment_url", JSON.stringify(data))
      location.href = res.pedido.pedido_url
    }
  }

  const template = html`
  <style>
    #contenedor {
      padding-top: 7rem;
      width:100%;
      min-height:100vh;
      display:flex;
      justify-content:center;
      color:white;
    }

    .carrito-wrapper {
      width:100%;
      max-width:1400px;
      display:flex;
      padding:2rem;
      gap:2.5rem;
    }

    .carrito-left,
    .carrito-right {
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(10px);
      border-radius:14px;
      padding:2rem;
      box-shadow:0 8px 20px rgba(0,0,0,0.35);
    }

    .carrito-left {
      flex:2.5;
      height:fit-content;
    }

    .carrito-right {
      flex:1;
      display:flex;
      flex-direction:column;
      gap:1.5rem;
      height:fit-content;
    }

    .title {
      font-size:2rem;
      font-weight:800;
      color:#FFD65A;
      margin-bottom:1rem;
    }

    .tabla-responsive {
      width:100%;
      overflow-x:auto;
      scrollbar-width:none;
      -ms-overflow-style:none;
    }

    .tabla-responsive::-webkit-scrollbar {
      display:none;
    }

    table {
      width:100%;
      min-width:900px;
      color:white;
      border-collapse:collapse;
    }

    thead {
      background:#2d5d2a;
      color:white;
    }

    th, td {
      padding:.9rem .6rem;
      vertical-align:middle;
      border-bottom:1px solid rgba(255,255,255,0.08);
    }

    tbody tr {
      background:rgba(255,255,255,0.06);
      transition: .2s;
    }

    tbody tr:hover {
      background:rgba(255,255,255,0.1);
    }

    table img {
      width:70px;
      height:70px;
      border-radius:10px;
      object-fit:cover;
    }

    /* Lado derecho */
    .side-section-title {
      font-size:1.4rem;
      font-weight:700;
      color:#FFD65A;
    }

    .pago-box {
      background:rgba(255,255,255,0.08);
      padding:1rem 1.3rem;
      border-radius:12px;
      border-left:4px solid #FFD65A;
      color:#eee;
    }

    .total-final {
      font-size:2rem;
      font-weight:900;
      text-align:center;
      color:#ff7b4a;
    }

    .finalizar-btn {
      width:100%;
      padding:1rem;
      background:#ff7b4a;
      color:white;
      border:none;
      border-radius:12px;
      font-size:1.2rem;
      font-weight:700;
      cursor:pointer;
      transition:.2s;
    }

    .finalizar-btn:hover {
      background:#e36434;
      transform:translateY(-2px);
    }

    @media(max-width:900px){
      .carrito-wrapper {
        flex-direction:column;
        padding:1rem;
      }

      table img {
        width:50px;
        height:50px;
      }

      th, td {
        padding:.6rem .4rem;
        font-size:.85rem;
      }

      .title {
        font-size:1.6rem;
      }
    }
  </style>

  <div class="carrito-wrapper">

    <div class="carrito-left">
      <div class="title">Detalle del Carrito</div>

      <div class="tabla-responsive">
        <table>
          <thead>
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
              const extraIng = (p.ingredientes || []).reduce((acc, ing) => acc + Number(ing.costo_extra), 0)
              const precioUnit = Number(p.precioReal) * (p.tamanio?.factor_precio ?? 1) + extraIng

              return html`
                <tr>
                  <td><img src="${p.imagen_url}" /></td>

                  <td><strong>${p.nombre}</strong><br /><small>${p.descripcion ?? ''}</small></td>

                  <td>${p.tamanio ? p.tamanio.nombre : '-'}</td>

                  <td>
                    ${(p.ingredientes?.length ?? 0) > 0
                      ? html`<ul style="padding-left:1rem; margin:0;">${p.ingredientes.map(i => html`<li>${i.nombre}</li>`)}</ul>`
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
    </div>

    <div class="carrito-right">
      <div class="side-section-title">Pago</div>

      ${user?.rol === 'cliente' || user === null ? html`
        <div class="pago-box">Compra con pasarela de pago segura.</div>
      ` : html`
        <div class="pago-box">Pago en tienda (efectivo o tarjeta).</div>
      `}

      <div>
        <div class="side-section-title">Total</div>
        <div class="total-final">S/. ${total.toFixed(2)}</div>
      </div>

      <button class="finalizar-btn" @click=${hundleCheckout}>Ir a pagar</button>
    </div>

  </div>
  `

  render(template, contenedor)
}
