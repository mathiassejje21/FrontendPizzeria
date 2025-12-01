import { html, render } from "lit-html";
import { renderNavbarTrabajadores } from "@components/navbarTrabajadores.mjs";
import { renderPerfilView } from "@components/renderPerfilView.mjs";
import { renderInventarioView } from "@components/renderInventarioView.mjs";
import { renderPedidosView } from "@views/personal/mostrarPedidos.mjs";
import { renderProductos } from "@views/personal/mostrarProductos.mjs";
import { renderDashboardView } from "@views/personal/mostrarDashboard.mjs";

export async function renderHomeView(section=null, user) {
    if (!user) {
        const stored = sessionStorage.getItem("user");
        user = stored ? JSON.parse(stored) : null;
    }
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
    else if(section==="perfil"){
        await renderPerfilView(user);
    }
}