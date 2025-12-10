import { getSuggestion } from "@api/sugerenciaApi.mjs";
import { html } from "lit-html";
import { agregarAlCarrito } from "@/service/renderCarrito.mjs";
import { mensajeAlert } from "@components/mensajeAlert.mjs";
import { tamanioController } from "@controllers/tamanioController.mjs";

export async function renderSugerencia() {
    const data = await getSuggestion();
    const { tipo, sugerencias = [], frecuentes = [], similares = [] } = data;

    const apiTamanio = new tamanioController();
    const tamanios = await apiTamanio.getTamanios();

    const tamanoMediano = tamanios.find(t => t.nombre?.toLowerCase().includes("mediano")) || null;

    const getBaseTamano = (item) =>
        item.tamanoSeleccionado ||
        tamanios.find((t) => t.id === data?.preferencia?.tamanoFavorito) ||
        tamanoMediano ||
        tamanios.find((t) => t.id === 2) ||
        null;

    const calcularPrecio = (item) => {
        const base = Number(item.precio);
        const ingredientes = Array.isArray(item.ingredientes)
            ? item.ingredientes.reduce(
                  (acc, ing) => acc + Number(ing.costo_extra || 0),
                  0
              )
            : 0;

        const subtotal = base + ingredientes;
        const tam = getBaseTamano(item);
        if (tam?.factor_precio) return (subtotal * tam.factor_precio).toFixed(2);
        return subtotal.toFixed(2);
    };

    const hundlerAgregarAlCarrito = (item) => {
        const pendingUrl = sessionStorage.getItem("last_payment_url");
        if (pendingUrl) {
            return mensajeAlert({
                icon: "warning",
                title: "Pago pendiente",
                text: "Tienes un pago pendiente.",
                showConfirmButton: true
            }).then(() => (location.href = "/pizzeria/pedidos"));
        }

        const tam = getBaseTamano(item);
        agregarAlCarrito(item, 1, tam, item.ingredientes);

        mensajeAlert({
            icon: "success",
            title: "¡Agregado al carrito!",
            text: "Se agregó correctamente.",
            timer: 1500
        });
    };

    let items = [];
    if (tipo === "populares") items = sugerencias.slice(0, 5);
    else if (frecuentes.length > 3) items = frecuentes.slice(0, 5);
    else if (similares.length > 0) items = similares.slice(0, 5);

    const Slider = (title, items) => html`
<style>
.sugerencia-wrapper{
    margin:2rem auto;
    text-align:center;
    max-width:95%;
}
.sugerencia-title{
    font-weight:800;
    font-size:1.8rem;
    color:#F4D9A0;
    margin-bottom:1.8rem;
}

.slider-sugerencias{
    display:flex;
    gap:2rem;
    overflow-x:auto;
    padding:1rem 0;
    scrollbar-width:none;
}
.slider-sugerencias::-webkit-scrollbar{
    display:none;
}

.sugerencia-card{
    min-width:270px;
    max-width:270px;
    height:400px;
    background:#1C1A18 !important;
    border-radius:18px;
    padding:1rem 1.2rem;
    border:1px solid rgba(255,255,255,0.12);
    box-shadow:0 12px 30px rgba(0,0,0,0.6);
    flex-shrink:0;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    transition:.25s;
}
.sugerencia-card:hover{
    transform:translateY(-8px);
}

.sugerencia-img-box{
    width:135px;
    height:135px;
    margin:0 auto 1rem;
    border-radius:50%;
    overflow:hidden;
    border:3px solid #FFC933;
}
.sugerencia-img-box img{
    width:100%;
    height:100%;
    object-fit:cover;
}

.sugerencia-card h4{
    color:#FFE9C4;
    font-size:1.15rem;
    font-weight:700;
    margin-top:.5rem;
}
.sugerencia-desc{
    font-size:.9rem;
    color:#F5EEDC;
    min-height:40px;
    margin:.5rem 0;
}
.sugerencia-price{
    font-size:1.25rem;
    font-weight:700;
    color:#FFC933;
}

.sugerencia-actions{
    display:flex;
    justify-content:center;
    gap:.7rem;
    flex-wrap:wrap;
    margin-top:.5rem;
}
.sugerencia-select{
    background:#2E2B27;
    border:1px solid #6B5F49;
    color:#F7EEDB;
    padding:.5rem .7rem;
    border-radius:6px;
    font-size:.9rem;
}
.sugerencia-btn{
    background:#3FAF52;
    padding:.55rem 1.2rem;
    color:white;
    border-radius:18px;
    cursor:pointer;
    font-weight:600;
    border:none;
    font-size:.9rem;
}
.sugerencia-btn:hover{
    background:#319143;
}

@media(max-width:768px){
    .sugerencia-card{
        min-width:250px;
        max-width:250px;
        height:380px;
        background:#1C1A18 !important;
    }
    .sugerencia-img-box{
        width:115px;
        height:115px;
        border:3px solid #FFC933;
    }
    .sugerencia-card h4{
        color:#FFE9C4 !important;
    }
    .sugerencia-desc{
        color:#F5EEDC !important;
    }
    .sugerencia-price{
        color:#FFC933 !important;
    }
    .sugerencia-select{
        background:#2E2B27 !important;
        color:#F7EEDB !important;
    }
    .sugerencia-btn{
        background:#3FAF52 !important;
        color:white !important;
    }
}
</style>

<section class="sugerencia-wrapper">
    <h2 class="sugerencia-title">${title}</h2>

    <div class="slider-sugerencias">
        ${items.map(item => {
            item.tamanoSeleccionado = getBaseTamano(item);

            return html`
            <div class="sugerencia-card">

                <div>
                    <div class="sugerencia-img-box">
                        <img src="${item.imagen_url}">
                    </div>

                    <h4>${item.nombre}</h4>

                    <p class="sugerencia-desc">${item.descripcion || ""}</p>

                    <p class="sugerencia-price" id="precio-${item.id}">
                        S/. ${calcularPrecio(item)}
                    </p>
                </div>

                <div class="sugerencia-actions">
                    ${item.personalizable ? html`
                        <select
                            class="sugerencia-select"
                            @change=${e=>{
                                const idSel=Number(e.target.value);
                                item.tamanoSeleccionado=tamanios.find(t=>t.id===idSel);
                                const precioElem=document.getElementById("precio-"+item.id);
                                if(precioElem) precioElem.textContent="S/. "+calcularPrecio(item);
                            }}
                        >
                            ${tamanios.map(t=>html`
                                <option value="${t.id}" 
                                    ?selected=${t.id === (tamanoMediano?.id || 2)}>
                                    ${t.nombre}
                                </option>
                            `)}
                        </select>
                    ` : ""}

                    <button class="sugerencia-btn" @click=${()=>hundlerAgregarAlCarrito(item)}>
                        Agregar
                    </button>
                </div>

            </div>`;
        })}
    </div>
</section>
`;

    let title = "Recomendaciones";
    if (tipo === "populares") title = "Populares";
    else if (frecuentes.length > 3) title = "Tus Favoritos";
    else if (similares.length > 0) title = "Te Puede Gustar";

    return Slider(title, items);
}
