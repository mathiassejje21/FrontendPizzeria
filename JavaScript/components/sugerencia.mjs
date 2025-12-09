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
        .sugerencia-wrapper {
            margin: 2rem auto;
            text-align: center;
            max-width: 1000px;
        }

        .sugerencia-title {
            font-weight: 700;
            font-size: 1.6rem;
            margin-bottom: 1.5rem;
            color: #FFFFFF;
            letter-spacing: 1px;
        }

        .slider-sugerencias {
            display: flex;
            gap: 2rem;
            overflow-x: auto;
            padding: 1rem 0;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }

        .slider-sugerencias::-webkit-scrollbar {
            display: none;
        }

        .sugerencia-card {
            min-width: 270px;
            background: #1A1E24;
            border-radius: 20px;
            padding: 1.5rem 1.2rem;
            flex-shrink: 0;
            transition: .25s;
            box-shadow: 0px 10px 28px rgba(0,0,0,0.45);
        }

        .sugerencia-card:hover {
            transform: translateY(-8px);
            box-shadow: 0px 14px 35px rgba(0,0,0,0.55);
        }

        .sugerencia-img-box {
            width: 140px;
            height: 140px;
            margin: 0 auto 1rem;
            border-radius: 50%;
            overflow: hidden;
            border: 4px solid #0B0D10;
        }

        .sugerencia-img-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .sugerencia-card h4 {
            font-size: 1.2rem;
            font-weight: 700;
            color: white;
            margin: .5rem 0 .4rem;
        }

        .sugerencia-desc {
            font-size: .9rem;
            color: #E5E5E5;
            margin-bottom: .9rem;
            min-height: 38px;
        }

        .sugerencia-price {
            color: #FFC933;
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }

        .sugerencia-actions {
            display: flex;
            justify-content: center;
            gap: .8rem;
            margin-top: .5rem;
        }

        .sugerencia-select {
            padding: .45rem .6rem;
            border-radius: 8px;
            background: #14171C;
            border: 1px solid #333;
            color: #FFF;
            font-size: .9rem;
        }

        .sugerencia-btn {
            background: #2ECC71;
            color: white;
            border: none;
            padding: .6rem 1.3rem;
            border-radius: 20px;
            cursor: pointer;
            transition: .2s;
            font-weight: 600;
            white-space: nowrap;
        }

        .sugerencia-btn:hover {
            background: #25B862;
        }
    </style>

    <section class="sugerencia-wrapper">
        <h2 class="sugerencia-title">${title}</h2>

        <div class="slider-sugerencias">
            ${items.map(item => html`
                <div class="sugerencia-card">

                    <div class="sugerencia-img-box">
                        <img src="${item.imagen_url}">
                    </div>

                    <h4>${item.nombre}</h4>

                    <p class="sugerencia-desc">
                        ${item.descripcion || ""}
                    </p>

                    <p class="sugerencia-price">
                        S/. ${Number(item.precioReal || item.precio).toFixed(2)}
                    </p>

                    <div class="sugerencia-actions">
                        ${item.personalizable === true ? html`
                            <select
                                class="sugerencia-select"
                                @change=${e => {
                                    const idSel = Number(e.target.value);
                                    item.tamanoSeleccionado = tamanios.find(t => t.id === idSel);
                                }}
                            >
                                ${tamanios.map(t => html`
                                    <option value="${t.id}" ?selected=${t.id === 1}>${t.nombre}</option>
                                `)}
                            </select>
                        ` : ""}

                        <button 
                            class="sugerencia-btn"
                            @click=${() => hundlerAgregarAlCarrito(item)}
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
