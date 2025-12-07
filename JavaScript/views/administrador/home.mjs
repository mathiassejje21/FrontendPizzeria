import { renderNavbarTrabajadores } from "@components/navbarTrabajadores.mjs";
import { renderDashboardView } from "@views/administrador/dashboard.mjs";
import { renderProductosView } from "@views/administrador/mostrarProductos.mjs";
import { renderPerfilView } from "@components/renderPerfilView.mjs";
import { renderCategoriasView } from "@views/administrador/mostrarCategorias.mjs";
import { renderAtributosView } from "@views/administrador/mostrarAtributos.mjs";
import { renderIngredientesView } from "@views/administrador/mostrarIngredientes.mjs";
import { renderUsuariosView } from "@views/administrador/mostrarUsuarios.mjs";
import { renderReportesPedidosView } from "@views/administrador/mostrarReportesPedidos.mjs";
import { renderReportesVentasView } from "@views/administrador/mostrarReportesVentas.mjs";
import { renderReportesProductosView } from "@views/administrador/mostrarReportesProductos.mjs";
import { renderReportesInventarioYCategoriasView } from "@views/administrador/mostrarReportesInventarioYCategorias.mjs";
import { renderReportesClientesView } from "@views/administrador/mostrarReportesClientes.mjs";


export async function renderHomeView(section = null, user) {
    if (!user) {
        const stored = sessionStorage.getItem("user");
        user = stored ? JSON.parse(stored) : null;
    }

    await renderNavbarTrabajadores(user);

    if(section==="dashboard" || section===null){
        await renderDashboardView(user);
    }
    else if(section==="perfil"){
        await renderPerfilView(user);
    }
    else if(section==="productos"){
        await renderProductosView(user);
    }
    else if(section==="categorias"){
        await renderCategoriasView(user);
    }
    else if(section==="ingredientes"){
        await renderIngredientesView(user);
    }
    else if(section==="usuarios"){
        await renderUsuariosView(user);
    }
    else if(section==="atributos"){
        await renderAtributosView(user);
    }
    else if(section==="reportesPedidos"){
        await renderReportesPedidosView(user);
    }
    else if(section==="reportesVentas"){
        await renderReportesVentasView(user);
    }
    else if(section==="reportesProductos"){
        await renderReportesProductosView(user);
    }
    else if(section==="reportesInventario-categorias"){
        await renderReportesInventarioYCategoriasView(user);
    }
    else if(section==="clientes"){
        await renderReportesClientesView(user);
    }
    
}