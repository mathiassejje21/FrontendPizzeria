import { getSessionUser } from "@/service/session.mjs";
import { redirectByRole } from "@/service/redirectByRole.mjs";

export function validateSession(roles = []) {
  const user = getSessionUser();
  const exp = parseInt(sessionStorage.getItem("session_exp"), 10);

  if (!user) {
    return {
      ok: false,
      user: null,
      reason: "expired",
      redirect: redirectByRole(null)
    };
  }

  if (!exp || Date.now() > exp) {
    sessionStorage.clear();
    const url = redirectByRole(null);
    return { ok: false, reason: "expired", redirect: url };
  }

  const rol = user.rol?.nombre || user.rol;

  if (roles.length > 0 && !roles.includes(rol)) {
    return {
      ok: false,
      user,
      reason: "forbidden",
      redirect: redirectByRole(rol)
    };
  }

  return { ok: true, user };
}
