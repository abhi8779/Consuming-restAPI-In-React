import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [users, setusers] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [error, seterror] = useState(null);

  const fetchMovieHandler = useCallback(async () => {
    try {
      setisLoading(true);

      const response = await fetch(
        `https://react-http-get-post-6d1d9-default-rtdb.firebaseio.com/movies.json`
      );

      if (!response.ok) {
        throw new Error(`Page not found Error: ${response.status}`);
      }

      const data = await response.json();

      const movieData = Object.entries(data).map((movie) => {
        return {
          id: movie[0],
          title: movie[1].title,
          releaseDate: movie[1].releaseDate,
          openingText: movie[1].openingText,
        };
      });

      // Alternate way of looping Object
      // let loadedMovies = [];
      // for (const key in data) {
      //   console.log(key);
      //   loadedMovies.push({
      //     id: key,
      //     title: data[key].title,
      //     releaseDate: data[key].releaseDate,
      //     openingText: data[key].openingText,
      //   });
      // }
      // console.log(loadedMovies);

      setusers(movieData);
      setisLoading(false);
    } catch (error) {
      console.log(`Error: ${error}`);
      seterror(`${error}`);
      setisLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovieHandler();
  }, [fetchMovieHandler]);

  let content = <p>Found No Movies.</p>;

  if (users.length > 0) {
    content = <MoviesList movies={users} />;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoading) {
    content = <p>Loading</p>;
  }

  const addMovieHandler = async (movie) => {
    try {
      const response = await fetch(
        `https://react-http-get-post-6d1d9-default-rtdb.firebaseio.com/movies.json`,
        {
          method: "POST",
          body: JSON.stringify(movie),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Some thing went wrong`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(` Error:= ${error} ${error.message}`);
    }
  };

  return (
    <React.Fragment>
      <section>
        <AddMovie onClick={fetchMovieHandler} onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovieHandler}> Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
