export interface MovieItem {
    Type: 'movie'
    imdbID: string
    Title: string
    Year: number
    Poster: string
}

export interface Movie extends MovieItem {
    Rated: string,
    Released: Date,
    Runtime: string,
    Genre: string,
    Director: string,
    Writer: string,
    Actors: string,
    Plot: string,
    Language: string,
    Country: string,
    Awards: string,
    Ratings: {
        Source: string,
        Value: string
    }[],
    Metascore: number,
    imdbRating: number,
    imdbVotes: number,
    DVD: Date,
    BoxOffice: string,
    Production: string,
    Website: string,
    Response: boolean
}

export interface ErrorResult {
    Error: string
    Result: 'False'
}

export interface FetchMovieResult extends Partial<ErrorResult>, Movie {
}

export interface FetchMoviesResult extends Partial<ErrorResult> {
    Search: MovieItem[]
    totalResults: number
}

const apiURL = '//www.omdbapi.com/?apikey=' + process.env.API_KEY

/**
 * Retrieves data of requested movie or tv show.
 *
 * @param id imdb identification of requested movie or tv show
 *
 * @returns requested movie info
 */
export async function fetchMovie(id: string): Promise<FetchMovieResult> {
    const response = await fetch(`${apiURL}&i=${id}`)

    return await response.json()
}

/**
 * Retrieves list of matched movies or tv shows.
 *
 * @param search pattern for matched movies or tv show
 * @param page offset of result set
 *
 * @returns list of matched movies or tv shows
 */
export async function fetchMovies(search: string, page = 1): Promise<FetchMoviesResult> {
    const response = await fetch(`${apiURL}&s=${search}&page=${page}`)

    return await response.json()
}
