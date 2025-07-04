import { apiRequest } from "./queryClient";

export async function fetchDashboardData() {
  const response = await apiRequest('/api/dashboard', 'GET');
  return response.json();
}

export async function fetchEmpresas() {
  const response = await apiRequest('/api/empresas', 'GET');
  return response.json();
}

export async function fetchFornecedores() {
  const response = await apiRequest('/api/fornecedores', 'GET');
  return response.json();
}

export async function fetchTitulos() {
  const response = await apiRequest('/api/titulos', 'GET');
  return response.json();
}

export async function fetchContratos() {
  const response = await apiRequest('/api/contratos', 'GET');
  return response.json();
}

export async function fetchPlanoContas() {
  const response = await apiRequest('/api/plano-contas', 'GET');
  return response.json();
}

export async function fetchTags() {
  const response = await apiRequest('/api/tags', 'GET');
  return response.json();
}
