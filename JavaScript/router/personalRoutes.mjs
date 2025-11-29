import { renderHomeView } from "@views/personal/home.mjs";
import { validateSession } from "@/service/validateSession.mjs";
import { handleUnauthorized } from "@components/handleUnauthorized.mjs";
import { renderDetallePedidosView } from "@views/personal/detallePedidos.mjs";
import { renderDetalleProductoView } from "@components/renderDetalleProductoView.mjs";

export function personalRoutes(router) {

    router.on('/personal/dashboard', async () => { 
        const session = validateSession(["personal"]);
        if (!session.ok) return handleUnauthorized(session);
        await renderHomeView("dashboard", session.user); 
    });

    router.on('/personal/inventario', async () => {
        const session = validateSession(["personal"]);
        if (!session.ok) return handleUnauthorized(session);
        await renderHomeView("inventario", session.user);
    });

    router.on('/personal/productos', async () => {
        const session = validateSession(["personal"]);
        if (!session.ok) return handleUnauthorized(session);
        await renderHomeView("productos", session.user);
    });

    router.on('/personal/productos/:id', async ({ data }) => {
        const session = validateSession(["personal"]);
        if (!session.ok) return handleUnauthorized(session);
        await renderDetalleProductoView(data.id, session.user);
    });

    router.on('/personal/pedidos', async () => {
        const session = validateSession(["personal"]);
        if (!session.ok) return handleUnauthorized(session);
        await renderHomeView("pedidos", session.user);
    });

    router.on('/personal/pedidos/:id', async ({ data }) => {
        const session = validateSession(["personal"]);
        if (!session.ok) return handleUnauthorized(session);
        await renderDetallePedidosView(data.id, session.user);
    });

    router.on('/personal/perfil', async () => {
        const session = validateSession(["personal"]);
        if (!session.ok) return handleUnauthorized(session);
        await renderHomeView("perfil", session.user);
    });
}
