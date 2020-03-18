import axios from "axios";

export function current_user() {
  return axios.get(
    "https://ibdb-rails-backend.herokuapp.com/auth/is_signed_in.json",
    {
      withCredentials: true
    }
  );
}

export function get_users() {
  return axios
    .get("https://ibdb-rails-backend.herokuapp.com/v1/users.json")
    .then(res => res.data);
}

export function get_username(id) {
  return axios
    .get(`https://ibdb-rails-backend.herokuapp.com/v1/${id}/user.json`)
    .then(res => res.data);
}

export function hasReviewedBook(user_id, book_id) {
  return axios
    .get(
      `https://ibdb-rails-backend.herokuapp.com/v1/${user_id}/${book_id}/bookreviewed.json`
    )
    .then(res => res);
}
