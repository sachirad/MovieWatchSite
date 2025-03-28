import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Search from './components/Search'
import MovieCard from './components/MovieCard'
import Spinner from './components/Spinner'
import {useDebounce} from 'react-use'
// import { updateSearchCount } from './appwrite'

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {

  const [searchTerm, setSearchTerm] = useState('')  ;
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')


  useDebounce(() => setDebouncedSearchTerm(searchTerm), 2000, [searchTerm])



  const fetchMovies = async (query = '') => {


    setErrorMessage('')
    setIsLoading(false)

    try{
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      :`${API_BASE_URL}/movie/popular?api_key=${API_KEY}`

      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok){
        throw new Error("Failed to fetch movies");  
      }


      const data = await response.json();

      if(data.Response === 'False'){
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return
      }
      
      setMovieList(data.results || [])

      // if(query && data.results.length > 0){
      //   await updateSearchCount(query, data.results[0])
      // }

    }
    catch (error){
      console.error(`Error fetching movies: ${error}`)
      setErrorMessage('Error fetching movies. Please try again later')
    }finally{
      setIsLoading(false);
    }
  }

  

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);


  return(
    <main>

      <div className='pattern'/>

      <div className='wrapper'>
          <header>
            <img src="public/hero.png" alt="Hero Banner" />
            <h1>Find <span className='text-gradient'>Movie</span> You'll Enjoy Without the Hassle</h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

          </header>

          <h2 className='mt-[40px] mb-[40px]'>All Movies</h2>

          {isLoading ?(
            <Spinner />
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 '>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}

          



      </div>


    </main>

    
  )
}



export default App
