export const fetchEmpresas = async () => {
  const response = await fetch("/api/empresas");
  if (!response.ok) {
    throw new Error("Failed to fetch empresas");
  }
  return response.json();
};

export const fetchFornecedores = async () => {
  const response = await fetch("/api/fornecedores");
  if (!response.ok) {
    throw new Error("Failed to fetch fornecedores");
  }
  return response.json();
};

export const fetchPlanoContas = async () => {
  const response = await fetch("/api/plano-contas");
  if (!response.ok) {
    throw new Error("Failed to fetch plano contas");
  }
  return response.json();
};

export const fetchDashboardData = async () => {
  const response = await fetch("/api/dashboard");
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }
  return response.json();
};

export const fetchTags = async () => {
  const response = await fetch("/api/tags");
  if (!response.ok) {
    throw new Error("Failed to fetch tags");
  }
  return response.json();
};

export const fetchContratos = async () => {
  const response = await fetch("/api/contratos");
  if (!response.ok) {
    throw new Error("Failed to fetch contratos");
  }
  return response.json();
};

export const fetchTitulos = async () => {
  const response = await fetch("/api/titulos");
  if (!response.ok) {
    throw new Error("Failed to fetch titulos");
  }
  return response.json();
};