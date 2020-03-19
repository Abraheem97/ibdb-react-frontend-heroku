import axios from "axios";

export function getBook(id) {
  return fetch(`${process.env.REACT_APP_API_URL}/books.json`)
    .then(response => response.json())
    .then(result => result.find(obj => obj.id === id));
}

export function getComments(id) {
  return fetch(`${process.env.REACT_APP_API_URL}/books/${id}/comments.json`)
    .then(response => response.json())
    .then(response => response);
}

export function getReviews(id) {
  return fetch(`${process.env.REACT_APP_API_URL}/books/${id}/reviews.json`)
    .then(response => response.json())
    .then(response => response);
}

// export function getAuthor(id) {
//   return fetch(`http://localhost:3001/books/${id}/author.json`)
//     .then(response => response.json())
//     .then(response => response);
// }

export function getAuthor(id) {
  return axios
    .get(`${process.env.REACT_APP_API_URL}/books/${id}/author.json`)
    .then(res => res.data);
}
