const BASE_URL = 'https://restcountries.com/v3.1'

function checkResponse(response) {
  // Padrao simples para tratar erros de resposta da API.
  if (!response.ok) {
    throw new Error('API request failed')
  }

  return response.json()
}

export function searchCountriesByName(query) {
  return fetch(`${BASE_URL}/name/${encodeURIComponent(query)}`).then(checkResponse)
}

export function getCountriesByCodes(codes) {
  return fetch(`${BASE_URL}/alpha?codes=${codes.join(',')}`).then(checkResponse)
}

export function getAllCountries() {
  return fetch(`${BASE_URL}/all`).then(checkResponse)
}
