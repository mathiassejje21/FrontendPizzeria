import { getSuggestion } from "@api/sugerenciaApi.mjs";
import { html } from "lit-html";
import { agregarAlCarrito } from "@/service/renderCarrito.mjs";
import { mensajeAlert } from "@components/mensajeAlert.mjs";
import { tamanioController } from "@controllers/tamanioController.mjs";

export async function renderSugerencia() {
    const data = await getSuggestion();

    const {
        tipo,
        sugerencias = [],
        frecuentes = [],
        similares = [],
        sugerenciasPersonalizadas = []
    } = data;

    const apiTamanio = new tamanioController();
    const tamanios = await apiTamanio.getTamanios();

    const hundlerAgregarAlCarrito = (item) => {
        const pendingUrl = sessionStorage.getItem("last_payment_url");
        if (pendingUrl) {
            return mensajeAlert({
                icon: "warning",
                title: "Pago pendiente",
                text: "Tienes un pago pendiente.",
                showConfirmButton: true
            }).then(() => {
                location.href = "/pizzeria/pedidos";
            });
        }
        let tamano = null;
        if (item.personalizable === true) {
            tamano = item.tamanoSeleccionado || tamanios.find(t => t.id === 1);
        }
        agregarAlCarrito(item, 1, tamano, item.ingredientes);

        mensajeAlert({
            icon: "success",
            title: "¡Agregado al carrito!",
            text: "Se agrego correctamente.",
            timer: 1500
        });
    };

    let items = [];

    if (tipo === "populares") items = sugerencias.slice(0, 5);
    else if (frecuentes.length > 3) items = frecuentes.slice(0, 5);
    else if (similares.length > 0) items = similares.slice(0, 5);

    const Slider = (title, items) => html`
        <style>
            .slider-sugerencias::-webkit-scrollbar {
                display: none;
            }
        </style>

        <section style="margin: 2rem 0;">
            <h2 style="
                font-weight: 700;
                font-size: 1.35rem;
                margin-bottom: 1rem;
                color: #0a3a17;
                text-align: center;
            ">${title}</h2>

            <div
                class="slider-sugerencias"
                style="
                    display: flex;
                    gap: 1.5rem;
                    overflow-x: auto;
                    padding: 1rem .5rem;
                    scroll-behavior: smooth;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                "
            >
                ${items.map(item => html`
                    <div style="
                        min-width: 260px;
                        background: white;
                        border-radius: 16px;
                        box-shadow: 0 6px 20px rgba(0,0,0,.1);
                        padding: 1.2rem 1rem;
                        text-align: center;
                        flex-shrink: 0;
                        transition: .25s;
                    "
                    @mouseover=${e => e.currentTarget.style.transform = "translateY(-6px)"}
                    @mouseout=${e => e.currentTarget.style.transform = "translateY(0)"}
                    >
                        <div style="
                            width: 110px;
                            height: 110px;
                            margin: 0 auto 1rem;
                            border-radius: 50%;
                            overflow: hidden;
                            border: 4px solid #f5f5f5;
                        ">
                            <img src="${item.imagen_url}" 
                                style="width: 100%; height: 100%; object-fit: cover;">
                        </div>

                        <h4 style="font-size: 1.1rem; margin: 0 0 .4rem;">
                            ${item.nombre}
                        </h4>

                        <p style="font-size: .88rem; color: #666; margin: 0 0 .8rem;">
                            ${item.descripcion || ""}
                        </p>

                        <p style="font-size: 1rem; margin-bottom: .9rem; color: #0a3a17; font-weight: 600;">
                            S/. ${Number(item.precioReal || item.precio).toFixed(2)}
                        </p>

                        <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-top: .8rem;
                        ">
                        ${item.personalizable === true ? html`
                            <select
                                style="
                                    padding: .45rem .6rem;
                                    border-radius: 8px;
                                    border: 1px solid #ccc;
                                    font-size: .9rem;
                                "
                                @change=${e => {
                                    const idSel = Number(e.target.value);
                                    item.tamanoSeleccionado = tamanios.find(t => t.id === idSel);
                                }}
                            >
                                ${tamanios.map(t => html`
                                    <option value="${t.id}" ?selected=${t.id === 1}>
                                        ${t.nombre}
                                    </option>
                                `)}
                            </select>
                        ` : ""}
                            <button style="
                                background: #ff2d59;
                                color: white;
                                border: none;
                                padding: .6rem 1.2rem;
                                border-radius: 20px;
                                cursor: pointer;
                                transition: .2s;
                                white-space: nowrap;
                            "
                            @click=${() => hundlerAgregarAlCarrito(item)}
                            @mouseover=${e => e.currentTarget.style.opacity = ".8"}
                            @mouseout=${e => e.currentTarget.style.opacity = "1"}
                            >
                                Agregar
                            </button>
                        </div>
                    </div>
                `)}
            </div>
        </section>
    `;

    let title = "Recomendaciones";

    if (tipo === "populares") title = "Para ti (Populares)";
    else if (frecuentes.length > 3) title = "Tus favoritos";
    else if (similares.length > 0) title = "Te puede gustar";

    return Slider(title, items);
}
