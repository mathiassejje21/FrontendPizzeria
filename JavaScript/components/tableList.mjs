import { html } from "lit-html";

export function renderTableList({
  title,
  searchPlaceholder,
  onSearch,
  rows,
  columns,
  onRowClick,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  prevPage,
  nextPage
}) {
  return html`

<style>

.table-productos{
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

table{
  width: 100%;
  border-collapse: collapse;
}

table tr td, table tr th{
  padding: 0.3rem 0.5rem;
  font-size: 0.9rem;
  font-weight: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; 
}

table thead tr{
  background: #1d283c;
  color: #fff;
  font-weight: normal;
}
    
table tbody tr td:first-child,
table thead tr th:first-child{
  border-top-left-radius: 0.3rem;
  border-bottom-left-radius: 0.3rem;
}

table tbody tr td:last-child,
table thead tr th:last-child{
  border-top-right-radius: 0.3rem;
  border-bottom-right-radius: 0.3rem;
}
  
table tbody tr:hover td{
  background: #1d283c;
  color: #fff;
  cursor: pointer; 
}

.estado-activo{
  color: #2ba972;
  background-color: rgba(43, 169, 114, 0.2);
}

.estado-inactivo{
  color: #a92b2bff;
  background-color: rgba(169, 43, 43, 0.2);
}

.pagination{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.pagination span{
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  text-align: center;
}

.pagination button{
  padding: 0.45rem 1.2rem;
  border-radius: 0.6rem;
  border:none;
  background-color: rgba(43, 169, 114, 0.2);
  color: #fff;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.25s ease;
  font-weight: 600;
  min-width: 90px;
}

.pagination button:hover{
  background-color: #58615aff;
  color: #000;
}

.pagination button:disabled{
  background-color: #d1d5db;
  border-color: #cbd5e1;
  color: #6b7280;
  cursor: not-allowed;
  opacity: 0.65;
}

.pagination button:disabled:hover{
  background-color: #d1d5db;
  color: #6b7280;
  border-color: #cbd5e1;
}

.button-crud.edit{
  border: none;
  border-radius: 0.2rem;
  background-color: #ffdb0c62;
  transition: all 0.25s ease;      
}

.button-crud.delete{
  border: none;
  border-radius: 0.2rem;
  background-color: #ad0d0d6d;
  transition: all 0.25s ease;      
}

.button-crud:hover{
  transform: scale(1.08);
}

</style>


<section class="table-productos">

  <h2 style="margin:0; padding:0;">${title}</h2>

  <input 
    type="text" 
    placeholder="${searchPlaceholder}"
    id="s",
    @input=${onSearch}
  >

  <table>
    <thead>
      <tr>
        ${columns.map(c => html`<th>${c.label}</th>`)}
        <th>Acción</th>
      </tr>
    </thead>

    <tbody>
      ${rows.map(row => html`
        <tr @click=${() => onRowClick(row)}>

          ${columns.map(c => html`
            <td>
              ${c.type === "image"
                ? html`
                    <img 
                      src="${row[c.field]}" 
                      style="border-radius:.5rem;width:30px;height:30px;object-fit:cover;">
                  `
                : c.type === "estado"
                  ? html`
                    <p class="${row[c.field] ? 'estado-activo' : 'estado-inactivo'}"
                       style="margin:0;padding:.1rem 0;border-radius:.3rem;font-size:.7rem;text-align:center; justify-content: center;">
                      ${row[c.field] ? "Activo" : "Inactivo"}
                    </p>
                  `
                  : c.field.includes(".")
                    ? c.field.split(".").reduce((acc,key)=>acc?.[key], row)
                    : row[c.field]
              }
            </td>
          `)}

          <td>
            <div style="display:flex;align-items:center;gap:.5rem;justify-content:center;">

              <button class="button-crud edit" 
                @click=${(e)=>{e.stopPropagation();onEdit(row);}}>
                <img src="https://img.icons8.com/?size=100&id=A4HETgpouLJn&format=png&color=000000"
                     style="width:20px;height:20px;">
              </button>

              <button class="button-crud delete" 
                @click=${(e)=>{e.stopPropagation();onDelete(row.id);}}>
                <img src="https://img.icons8.com/?size=100&id=Ak1nWJFsk3c7&format=png&color=FA5252"
                     style="width:20px;height:20px;">
              </button>

            </div>
          </td>

        </tr>
      `)}
    </tbody>
  </table>

  <div class="pagination">
    <button @click=${prevPage} ?disabled=${currentPage === 1}>Anterior</button>
    <span>Página ${currentPage} de ${totalPages}</span>
    <button @click=${nextPage} ?disabled=${currentPage >= totalPages}>Siguiente</button>
  </div>

</section>

`;
}
