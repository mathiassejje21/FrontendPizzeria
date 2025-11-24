export function redirectByRole(rol, path = window.location.pathname.toLowerCase()) {

  if (rol === "cliente") return "/pizzeria";
  if (rol === "personal") return "/personal/dashboard";
  if (rol === "administrador") return "/administrador/home";

  if (path.startsWith("/pizzeria")) 
    return "/pizzeria/login";

  return "/trabajadores/login";
}
