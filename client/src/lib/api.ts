import { apiRequest } from "./queryClient";

export async function fetchDashboardData() {
  const response = await apiRequest('GET', '/api/dashboard');
  return response.json();
}

export async function fetchEmpresas() {
  const response = await apiRequest('GET', '/api/empresas');
  return response.json();
}

export async function fetchFornecedores() {
  const response = await apiRequest('GET', '/api/fornecedores');
  return response.json();
}

export async function fetchTitulos() {
  const response = await apiRequest('GET', '/api/titulos');
  return response.json();
}

export async function fetchContratos() {
  const response = await apiRequest('GET', '/api/contratos');
  return response.json();
}

export async function fetchPlanoContas() {
  const response = await apiRequest('GET', '/api/plano-contas');
  return response.json();
}

export async function fetchTags() {
  const response = await apiRequest('GET', '/api/tags');
  return response.json();
}
