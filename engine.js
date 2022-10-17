// will call the functions that will show data  on the DOM, such as 'getOriginals', 'getTrendingNow()','getTopRated()'

window.onload=()=>  {
    getOriginals()
    getTrendingNow()
    getTopRated()
}

// this function will fetch movie using url, domelelement, and path type as a parameter
function fetchMovies(url,domelement, pathtype){
    fetch(url)
    .then(response => {
        // if status is 400 then return the result
        if(response.ok){
            return response.json()
        }
        // else throw as error
        else{
            throw new Error("something Bad happened")
        }
    })
    // pass the data to showMovies function that will show data content to DOM
    .then(data=>{
        showMOvies(data,domelement,pathtype)
    })
    // else throw an error
    .catch(error=>{
        console.log(error)
    })
}
// this function will show data on DOM 
showMOvies = (movies,domelement, pathtype) =>{

    // using querySelectory method to get domelement
    var moviesEl = document.querySelector(domelement)

    for(var movie of movies.results){
        var imageElement = document.createElement('img')

        imageElement.setAttribute('data-id',movie.id)

        imageElement.src = `https://image.tmdb.org/t/p/original${movie[pathtype]}`
        
        moviesEl.appendChild(imageElement)
    }
}
function getOriginals(){
    let url = 'https://api.themoviedb.org/3/discover/tv?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213'

    fetchMovies(url,'.original_movies','poster_path')
}

function getTrendingNow() {
    var url =
      'https://api.themoviedb.org/3/trending/movie/week?api_key=19f84e11932abbc79e6d83f82d6d1045'
    fetchMovies(url, '#trending', 'backdrop_path')
  }
function getTopRated() {
    var url =
      'https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1'
    fetchMovies(url, '#top_rated', 'backdrop_path')
  }

//   Function to play the trailer of the movies
async function getMovieTrailer(id){
    let url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`
    return await fetch(url).then(response=>{
        if(response.ok){
            return response.json()
        }else{
            throw new Error('Something bad happened')
        }
    })

}
const setTrailer = trailers => {
    const iframe = document.getElementById('movieTrailer')
    const movieNotFound = document.querySelector('.movieNotFound')
    if(trailers.length>0){
        movieNotFound.classList.add('d-none')
        iframe.classList.remove('d-none')
        iframe.src = `https://www.youtube.com/embed/${trailers[0].key}`
    }else {
        iframe.classList.add('d-none')
        movieNotFound.classList.remove('d-none')
    }
}
const handleMoviesSelection = e =>{
    const id = e.target.getAttribute('data-id')
    const iframe = document.getElementById('movieTrailer')

    getMovieTrailer(id).then(data => {
        const results = data.results
        const youtubeTrailers  = results.filter(result => {
            if(result.site == 'YouTube' && result.type == 'Trailer'){
                return true
            }else {
                return false
            }
        })
        setTrailer(youtubeTrailers)
    })

    $('#trailerModal').modal('show')
}
