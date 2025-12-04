export function filterBasic(
  list,
  searchFields = [],
  searchValue = "",
  fechaField = null,
  fechaValue = null,
  estadoField = null,
  estadoValue = null
) {
  const q = searchValue.toLowerCase();

  return list.filter(item => {

    if (searchValue) {
      const matchSearch = searchFields.some(field => {
        const val = field.split(".").reduce((acc, key) => acc?.[key], item);
        return typeof val === "string" && val.toLowerCase().includes(q);
      });
      if (!matchSearch) return false;
    }

    if (fechaField && fechaValue) {
      const raw = fechaField.split(".").reduce((acc, key) => acc?.[key], item);
      if (!raw) return false;

      const soloFecha = raw.split("T")[0];
      if (soloFecha !== fechaValue) return false;
    }

    if (estadoField && estadoValue !== null) {
      const estado = estadoField.split(".").reduce((acc, key) => acc?.[key], item);
      if (estado != estadoValue) return false;
    }

    return true;
  });
}

export function sortBasic(list, field = null, direction = "asc") {
  if (!field) return list;

  const sorted = [...list];

  return sorted.sort((a, b) => {
    const valA = a[field];
    const valB = b[field];

    const isDate =
      typeof valA === "string" &&
      typeof valB === "string" &&
      valA.includes("T") &&
      valB.includes("T");

    if (isDate) {
      const dA = new Date(valA);
      const dB = new Date(valB);
      return direction === "asc" ? dA - dB : dB - dA;
    }

    if (typeof valA === "number" && typeof valB === "number") {
      return direction === "asc" ? valA - valB : valB - valA;
    }

    if (typeof valA === "string" && typeof valB === "string") {
      return direction === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return 0;
  });
}

export function paginateBasic(list, page = 1, pageSize = 10) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  return list.slice(startIndex, endIndex);
}

export function totalPagesBasic(list, pageSize = 10) {
  return Math.ceil(list.length / pageSize);
}
