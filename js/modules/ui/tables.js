// js/ui/tables.js
import { formatPrice } from '../utils.js'

export function renderTabelaProdutos(produtos) {
  const tbody = document.querySelector('#tabela-produtos tbody')
  if (!tbody) return

  tbody.innerHTML = ''

  produtos.forEach(p => {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td>${p.nome}</td>
      <td>${formatPrice(p.preco)}</td>
      <td>${p.estoque}</td>
      <td>
        <button data-id="${p.id}" class="btn-editar">Editar</button>
      </td>
    `

    tbody.appendChild(tr)
  })
}
