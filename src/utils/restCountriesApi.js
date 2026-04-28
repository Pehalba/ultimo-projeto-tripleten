const BASE_URL = 'https://restcountries.com/v3.1'

function checkResponse(response) {
  if (!response.ok) {
    throw new Error('API request failed')
  }

  return response.json()
}

export function searchCountriesByName(query) {
  return fetch(`${BASE_URL}/name/${encodeURIComponent(query)}`).then(checkResponse)
}
