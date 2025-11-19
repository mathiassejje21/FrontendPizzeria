export const getCarrito = () => JSON.parse(sessionStorage.getItem('carrito')) || [];
export const setCarrito = (carrito) =>
  sessionStorage.setItem('carrito', JSON.stringify(carrito));

export const updateCarritoCount = () => {
  const carrito = getCarrito();
  const span = document.getElementById('carrito-contador');
  if (!span) return;
  const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  span.textContent = total;
};

export const calcularTotal = () => {
  const carrito = getCarrito();
  return carrito.reduce((acc, p) => {
    const base = Number(p.precioReal);
    const factor = Number(p.tamanio?.factor_precio ?? 1);
    const extras = (p.ingredientes || []).reduce((s, i) => s + Number(i.costo_extra), 0);
    const unit = base * factor + extras;
    return acc + unit * p.cantidad;
  }, 0);
};

export const guardarTotal = () => {
  const total = calcularTotal();
  sessionStorage.setItem("carrito_total", total);
  return total;
};

export const updateTotal = () => {
  const total = parseFloat(sessionStorage.getItem("carrito_total")) || 0;
  const totalSpan = document.getElementById('carrito-total');
  if (!totalSpan) return;
  totalSpan.textContent = `Total: S/ ${total.toFixed(2)}`;
};
