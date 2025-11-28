import { renderHomeView } from "@views/personal/home.mjs";
import { validateSession } from "@/service/validateSession.mjs";
import { handleUnauthorized } from "@components/handleUnauthorized.mjs";
import { renderDetallePedidosView } from "@views/personal/detallePedidos.mjs";
import { renderDetalleProductoView } from "@components/renderDetalleProductoView.mjs";

export function personalRoutes(router) {
    router.on('/personal/dashboard', () => { 
        const session = validateSession(["personal"]);
        if (!session.ok) return handleUnauthorized(session);
        renderHomeView("dashboard", session.user); 
    });

    router.on('/personal/inventario', () => {
        const session = validateSession(["personal"]);
        if (!session.ok) return handleUnauthorized(session);
        renderHomeView("inventario", session.user);
    });

    router.on('/personal/productos', () => {
        const session = validateSession(["personal"]);
        if (!session.ok) return handleUnauthorized(session);
        renderHomeView("productos", session.user);
    });

    router.on('/personal/productos/:id', ({ data }) => {
        const session = validateSession(["personal"]);
        if (!session.ok) return handleUnauthorized(session);
        renderDetalleProductoView(data.id, session.user);
    });

    router.on('/personal/pedidos', () => {
        const session = validateSession(["personal"]);
        if (!session.ok) return handleUnauthorized(session);
        renderHomeView("pedidos", session.user);
    });

    router.on('/personal/pedidos/:id', ({ data }) => {
        const session = validateSession(["personal"]);
        if (!session.ok) return handleUnauthorized(session);
        renderDetallePedidosView(data.id, session.user);
    });

    
}
