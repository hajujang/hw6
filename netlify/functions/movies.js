// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')
const { stringify } = require('querystring')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!

  // get the year of the movie fromt the querystring parameters
  let year = event.queryStringParameters.year
  
  // get the genre of the movie fromt the querystring parameters
  let genre = event.queryStringParameters.genre

  // conditional statement based on what the request is
  // Return a warning statement if users don't put year and genre request
  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Please include the year and the genre.` // a string of data
    }
  }

  // Return a number of movies and the list of movies that fits the user request
  // Create an object that includes the number of movies and an array of movies 
  else {
    let returnValue = {
      numResults: 0,
      movies: []
    }

    // loop through all movie listings
    for (let i=0; i < moviesFromCsv.length; i++) {
    
      // store each listing in memory
      let movieListing = moviesFromCsv[i]

      // Create a new movie object containing the pertinent fields
      let relevantData = {
        Title: movieListing.primaryTitle,
        Year: movieListing.startYear,
        Genre: movieListing.genres,
        // Runtime: movieListing.runtimeMinutes
      }
      
      // Return only if the year and genre are the ones user requests. Also exclude movies with no runtimeMinutes 
      if (movieListing.startYear == year && movieListing.genres == genre && movieListing.runtimeMinutes!==`\\N`){
        
        // add +1 if to the numResults if the year and the genre fit with the request
        returnValue.numResults = returnValue.numResults+1 

        // add the listings to the Array of movie listings to return
        returnValue.movies.push(relevantData) 
        
      }

    }
    
    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(returnValue) // a string of data
    }
  }
}