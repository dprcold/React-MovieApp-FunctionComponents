const genreApiUrl = 'https://api.themoviedb.org/3/genre/movie/list';
const guestApiUrl = 'https://api.themoviedb.org/3/authentication/guest_session/new';
const movieApiUrl = 'https://api.themoviedb.org/3/search/movie';
const ratingApiUrl = 'https://api.themoviedb.org/3/movie/';
const ratedMoviesApiUrl = 'https://api.themoviedb.org/3/guest_session/';
const apiKey = '53b21194b2d794150bea2816688e5f9e';
const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1M2IyMTE5NGIyZDc5NDE1MGJlYTI4MTY2ODhlNWY5ZSIsInN1YiI6IjY1M2E3MjhmYWUzNjY4MDBjNWI5MDRlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JSzn8vonl7qjaqptWYLglIKJ8zLxTNMXshBXQu0Bb7w';

export async function getMovie(value, page) {
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });
  const requestOptions = {
    accept: 'application/json',
    method: 'GET',
    headers: headers,
  };

  const queryParams = new URLSearchParams({
    query: value,
    include_adult: false,
    language: 'en-US',
    page: page,
  });
  const urlWithParams = `${movieApiUrl}?${queryParams}`;

  const response = await fetch(urlWithParams, requestOptions);

  if (!response.ok) {
    throw new Error(`Error${response.status}`);
  }
  const responseData = await response.json();
  return responseData;
}

export async function getGenre() {
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });
  const requestOptions = {
    accept: 'application/json',
    method: 'GET',
    headers: headers,
  };
  const queryParams = new URLSearchParams({
    language: 'en',
  });
  const urlWithParams = `${genreApiUrl}?${queryParams}`;
  try {
    const response = await fetch(urlWithParams, requestOptions);
    const responseData = await response.json();
    const result = responseData.genres;
    return result;
  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
}

export async function createGuestSession() {
  const queryParams = new URLSearchParams({
    language: 'en',
  });
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const urlWithParams = `${guestApiUrl}?api_key=${apiKey}&${queryParams}`;
  try {
    const response = await fetch(urlWithParams, requestOptions);
    const responseData = await response.json();
    const result = responseData.guest_session_id;
    return result;
  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
}

export async function addRatingPost(sessionId, movieId, rating) {
  const headers = new Headers({
    accept: 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
  });
  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ value: rating }),
  };
  const urlWithParams = `${ratingApiUrl}${movieId}/rating?api_key=${apiKey}&guest_session_id=${sessionId}`;

  try {
    await fetch(urlWithParams, requestOptions);
  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
}

export async function getGuestSessionRatings(sessionId, numberPage) {
  const requestOptions = {
    accept: 'application/json',
    method: 'GET',
  };
  const urlWithParams = `${ratedMoviesApiUrl}${sessionId}/rated/movies?api_key=${apiKey}&page=${numberPage}&language=en`;

  try {
    const response = await fetch(urlWithParams, requestOptions);
    const responseData = await response.json();
    const result = responseData;
    return result;
  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
}
