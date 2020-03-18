export function getAuthorBooks(id) {
  return fetch(`https://ibdb-rails-backend.herokuapp.com/v1/author/${id}/books`)
    .then(response => response.json())
    .then(response => response);
}
