import { authApi } from "@/api/authApi.mjs";
import { redirectByRole } from "@/service/redirectByRole.mjs";

export async function validateSession(roles = []) {
  const api = new authApi();

  try {
    const user = await api.getProfile();
    const rol = user.rol?.nombre || user.rol;

    if (roles.length > 0 && !roles.includes(rol)) {
      const url = redirectByRole(rol);
      return { ok: false, redirect: url };
    }

    return { ok: true, user };
  } catch {
    const url = redirectByRole(null);
    return { ok: false, redirect: url };
  }
}
