// js/modules/products.js
import { state } from '../state.js'
import { neonAPI } from '../api.js'

export async function carregarProdutos() {
  const dados = await neonAPI('getProducts') 
  state.produtos = dados || []
  return state.produtos
}

export async function adicionarProduto(produto) {
  const novo = await neonAPI('addProduct', produto)
  state.produtos.push(novo)
  return novo
}

export async function atualizarEstoque(id, quantidade) {
  const atualizado = await neonAPI('updateStock', { id, quantidade })

  const index = state.produtos.findIndex(p => p.id === id)
  if (index !== -1) {
    state.produtos[index].estoque = quantidade
  }

  return atualizado
}

export function buscarProdutoPorId(id) {
  return state.produtos.find(p => p.id === id)
}
