/**
 * Extended MovieLens sample with more diverse movies for better recommendations
 */
export interface MovieRow {
  movieId: number
  title: string
  genres: string
  year?: number
}

export const movies: MovieRow[] = [
  {
    movieId: 1,
    title: "Toy Story (1995)",
    genres: "Adventure|Animation|Children|Comedy|Fantasy",
    year: 1995,
  },
  {
    movieId: 2,
    title: "Jumanji (1995)",
    genres: "Adventure|Children|Fantasy",
    year: 1995,
  },
  {
    movieId: 3,
    title: "Grumpier Old Men (1995)",
    genres: "Comedy|Romance",
    year: 1995,
  },
  {
    movieId: 4,
    title: "Waiting to Exhale (1995)",
    genres: "Comedy|Drama|Romance",
    year: 1995,
  },
  {
    movieId: 5,
    title: "Father of the Bride Part II (1995)",
    genres: "Comedy",
    year: 1995,
  },
  {
    movieId: 6,
    title: "Heat (1995)",
    genres: "Action|Crime|Thriller",
    year: 1995,
  },
  {
    movieId: 7,
    title: "Sabrina (1995)",
    genres: "Comedy|Romance",
    year: 1995,
  },
  {
    movieId: 8,
    title: "Tom and Huck (1995)",
    genres: "Adventure|Children",
    year: 1995,
  },
  {
    movieId: 9,
    title: "Sudden Death (1995)",
    genres: "Action",
    year: 1995,
  },
  {
    movieId: 10,
    title: "GoldenEye (1995)",
    genres: "Action|Adventure|Thriller",
    year: 1995,
  },
  // Adding more movies for better recommendations
  {
    movieId: 11,
    title: "The Matrix (1999)",
    genres: "Action|Sci-Fi|Thriller",
    year: 1999,
  },
  {
    movieId: 12,
    title: "Star Wars: Episode IV - A New Hope (1977)",
    genres: "Action|Adventure|Sci-Fi",
    year: 1977,
  },
  {
    movieId: 13,
    title: "The Lion King (1994)",
    genres: "Animation|Children|Drama|Musical",
    year: 1994,
  },
  {
    movieId: 14,
    title: "Forrest Gump (1994)",
    genres: "Comedy|Drama|Romance|War",
    year: 1994,
  },
  {
    movieId: 15,
    title: "Pulp Fiction (1994)",
    genres: "Comedy|Crime|Drama|Thriller",
    year: 1994,
  },
  {
    movieId: 16,
    title: "The Shawshank Redemption (1994)",
    genres: "Crime|Drama",
    year: 1994,
  },
  {
    movieId: 17,
    title: "Speed (1994)",
    genres: "Action|Romance|Thriller",
    year: 1994,
  },
  {
    movieId: 18,
    title: "The Mask (1994)",
    genres: "Action|Comedy|Crime|Fantasy",
    year: 1994,
  },
  {
    movieId: 19,
    title: "Batman Forever (1995)",
    genres: "Action|Adventure|Comedy|Crime",
    year: 1995,
  },
  {
    movieId: 20,
    title: "Apollo 13 (1995)",
    genres: "Adventure|Drama|IMAX",
    year: 1995,
  },
]
