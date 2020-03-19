export function getAuthorBooks(id) {
  return fetch(`${process.env.REACT_APP_API_URL}/v1/author/${id}/books`)
    .then(response => response.json())
    .then(response => response);
}
