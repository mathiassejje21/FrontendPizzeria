import { html, render } from 'lit-html'
import { mensajeAlert } from '@components/mensajeAlert.mjs'
import { pedidoController } from '@controllers/pedidoController.mjs'

export async function renderCarritoView(user, contenedor = document.getElementById('contenedor')) {
  const carrito = JSON.parse(sessionStorage.getItem('carrito')) || []
  const total = Number(sessionStorage.getItem('carrito_total')) || 0

  if (carrito.length === 0) {
    return render(html`
      <style>
        #contenedor {
          width: 100%;
          min-height: 100vh;
          padding-top: 5rem;
          display:flex;
          justify-content:center;
          align-items:center;
          color:white !important;
        }

        .empty-box {
          text-align:center;
          padding:3rem;
          background:rgba(255,255,255,0.10);
          backdrop-filter:blur(12px);
          border-radius:20px;
          box-shadow:0 10px 30px rgba(0,0,0,0.3);
          color:white;
          width:90%;
          max-width:450px;
        }

        .empty-box h2 {
          font-size:2rem;
          margin-bottom:1rem;
          font-weight:800;
          color:#FFD65A;
        }

        .empty-box p {
          opacity:.85;
          margin-bottom:1.5rem;
          font-size:1.1rem;
        }

        .empty-btn {
          padding:.9rem 1.8rem;
          background:#ff7b4a;
          border:none;
          border-radius:12px;
          font-size:1.1rem;
          font-weight:700;
          color:white;
          cursor:pointer;
          transition:.2s;
        }

        .empty-btn:hover {
          background:#e96d39;
          transform:translateY(-2px);
        }
      </style>

      <div class="empty-box">
        <h2>Tu carrito está vacío</h2>
        <p>Aún no has agregado ningún producto.<br>¡Explora nuestras pizzas y promos!</p>
        <button class="empty-btn" @click=${() => window.history.back()}>Volver</button>
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
          personalizaciones.ingredientes = p.ingredientes.map(ing => ({ id_ingrediente: ing.id, cantidad: 1 }))
        }

        return { id_producto: p.id, cantidad: p.cantidad, personalizaciones }
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

      const data = { id_pedido: res.pedido.id, url_pago: res.pedido.pedido_url }
      sessionStorage.setItem("last_payment_url", JSON.stringify(data))
      location.href = res.pedido.pedido_url
    }
  }

  const template = html`
  <style>
    #contenedor {
      padding-top:7rem;
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
      gap:1.5rem;
    }

    .carrito-left,
    .carrito-right {
      background:rgba(255,255,255,0.08);
      backdrop-filter:blur(12px);
      border-radius:14px;
      padding:2rem;
      box-shadow:0 8px 25px rgba(0,0,0,0.35);
      height:fit-content;
    }

    .carrito-left { flex:2.5; }
    .carrito-right { flex:1; display:flex; flex-direction:column; gap:1.5rem; }

    .title {
      font-size:2rem;
      font-weight:900;
      color:#FFD65A;
      margin-bottom:1.2rem;
    }

    .tabla-responsive {
      width:100%;
      overflow-x:auto;
      scrollbar-width:none;
    }
    .tabla-responsive::-webkit-scrollbar { display:none; }

    table {
      width:100%;
      min-width:950px;
      border-collapse:collapse;
      color:white;
    }

    thead {
      background:#1d1d1d;
      color:#FFD65A;
    }

    th {
      padding:1rem .7rem;
      font-size:1rem;
      font-weight:700;
      border-bottom:2px solid rgba(255,255,255,0.15);
      text-align:left;
    }

    td {
      padding:1rem .7rem;
      border-bottom:1px solid rgba(255,255,255,0.08);
      font-size:0.95rem;
    }

    tbody tr {
      background:rgba(255,255,255,0.05);
      transition:.2s;
    }

    tbody tr:hover {
      background:rgba(255,255,255,0.12);
    }

    table img {
      width:75px;
      height:75px;
      border-radius:10px;
      object-fit:cover;
    }

    .side-section-title {
      font-size:1.4rem;
      font-weight:700;
      color:#FFD65A;
    }

    .pago-box {
      background:rgba(255,255,255,0.10);
      padding:1.1rem 1.4rem;
      border-radius:12px;
      border-left:4px solid #ff7b4a;
      color:#eee;
    }

    .total-final {
      font-size:2.2rem;
      font-weight:900;
      text-align:center;
      color:#ff7b4a;
    }

    .finalizar-btn {
      width:100%;
      padding:1.1rem;
      background:#ff7b4a;
      color:white;
      border:none;
      border-radius:14px;
      font-size:1.2rem;
      font-weight:700;
      cursor:pointer;
      transition:.25s;
    }

    .finalizar-btn:hover {
      background:#e96d39;
      transform:translateY(-3px);
    }

    @media(max-width:900px){
      .carrito-wrapper { flex-direction:column; padding:1rem; }

      th, td { padding:.7rem .4rem; font-size:.82rem; }
      table img { width:55px; height:55px; }
      .title { font-size:1.6rem; }
      p{color:white !important; font-size:1rem !important;}
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
              const precioUnit = (Number(p.precio) + extraIng ) * (p.tamanio?.factor_precio ?? 1) 

              return html`
                <tr>
                  <td><img src="${p.imagen_url}" /></td>
                  <td><strong>${p.nombre}</strong><br/><small>${p.descripcion ?? ''}</small></td>
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
    </div>

    <div class="carrito-right">
      <div class="side-section-title">Pago</div>

      ${user?.rol === 'cliente' || user === null
        ? html`<div class="pago-box">Compra con pasarela de pago segura.</div>`
        : html`<div class="pago-box">Pago en tienda (efectivo o tarjeta).</div>`}

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
