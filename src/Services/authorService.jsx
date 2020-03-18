export function getAuthorBooks(id) {
  return fetch(`http://localhost:3001/v1/author/${id}/books`)
    .then(response => response.json())
    .then(response => response);
}
