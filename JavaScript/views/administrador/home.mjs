import { html, render } from "lit-html";
import { renderNavbarTrabajadores } from "@components/navbarTrabajadores.mjs";
import { renderDashboardView } from "@views/administrador/dashboard.mjs";
import { renderPedidosView } from "@views/administrador/mostrarPedidos.mjs";
import { renderProductosView } from "@views/administrador/mostrarProductos.mjs";
import { renderPerfilView } from "@components/renderPerfilView.mjs";


export async function renderHomeView(section = null, user) {
    if (!user) {
        const stored = sessionStorage.getItem("user");
        user = stored ? JSON.parse(stored) : null;
    }

    await renderNavbarTrabajadores(user);

    if(section==="dashboard" || section===null){
        await renderDashboardView(user);
    }
    else if(section==="pedidos"){
        await renderPedidosView();
    }
    else if(section==="productos"){
        await renderProductosView(user);
    }
    else if(section==="perfil"){
        await renderPerfilView(user);
    }
}