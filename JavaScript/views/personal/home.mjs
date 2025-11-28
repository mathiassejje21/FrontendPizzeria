import { html, render } from "lit-html";
import { renderNavbarTrabajadores } from "@components/navbarTrabajadores.mjs";
import { renderDashboardView } from "@views/personal/mostrarDashboard.mjs";
import { renderInventarioView } from "@views/personal/mostrarInventario.mjs";
import { renderPedidosView } from "@views/personal/mostrarPedidos.mjs";
import { renderProductos } from "@views/personal/mostrarProductos.mjs";

export async function renderHomeView(section=null, user) {
    await renderNavbarTrabajadores(user);

    if(section==="dashboard" || section===null){
        await renderDashboardView();
    }
    else if(section==="inventario"){
        await renderInventarioView();
    }
    else if(section==="productos"){
        await renderProductos(user);
    }
    else if(section==="pedidos"){
        await renderPedidosView();
    }  
}