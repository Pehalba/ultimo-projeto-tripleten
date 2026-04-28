const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

function checkResponse(response) {
  // Reaproveita o mesmo tratamento de erro para o POST.
  if (!response.ok) {
    throw new Error('API request failed')
  }

  return response.json()
}

export function saveSearchLog(query, resultsCount) {
  return fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      resultsCount,
      createdAt: new Date().toISOString(),
    }),
  }).then(checkResponse)
}
