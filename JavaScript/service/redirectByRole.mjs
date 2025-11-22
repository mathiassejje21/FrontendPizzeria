export function redirectByRole() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const rol = user?.rol?.nombre || user?.rol;

  if (rol === "cliente") {
    return "/pizzeria/login";
  }

  if (rol === "personal") {
    return "/trabajadores/login";
  }

  if (rol === "administrador") {
    return "/trabajadores/login";
  }

  return "/pizzeria/login";
}
