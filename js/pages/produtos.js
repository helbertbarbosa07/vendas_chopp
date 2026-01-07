// js/pages/produtos.js
import { carregarProdutos, adicionarProduto } from '../modules/products.js'
import { renderTabelaProdutos } from '../ui/tables.js'
import { showNotification } from '../ui/notifications.js'

async function initProdutos() {
  try {
    const produtos = await carregarProdutos()
    renderTabelaProdutos(produtos)
  } catch {
    showNotification('Erro ao carregar produtos', 'error')
  }
}

document.getElementById('form-produto')?.addEventListener('submit', async e => {
  e.preventDefault()

  const form = e.target
  const produto = {
    nome: form.nome.value,
    preco: form.preco.value,
    estoque: form.estoque.value
  }

  await adicionarProduto(produto)
  await initProdutos()

  form.reset()
  showNotification('Produto cadastrado com sucesso', 'success')
})

initProdutos()
