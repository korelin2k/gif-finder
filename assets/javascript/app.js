// Object is used for favorites
let myFavorites = {

}

// Object is used for the movies portion
let moviesCollection = {
    movies: [],
    omdbAPIKey: '6edcc50',
    totalCards: 0,

    // Returns a list of movies in the collection
    returnMovies: function() {
        return moviesCollection.movies;
    },

    // Calls the OMDB API to search for movies entered
    searchForMovies: function(addMovieName) {
        // ajax call to check if the movie is valid
        let omdbSearchURL = 'https://www.omdbapi.com/?apikey=' + moviesCollection.omdbAPIKey;

        $.ajax({
            url: omdbSearchURL,
            method: 'GET',
            data: { 
                s: addMovieName,
                type: 'movie'
            },
        })
        .then(function(omdbResultCall) {

            // Clear out any movie "not found" situations
            $('.search-output').empty();
            moviesCollection.createMovieCardCollection(omdbResultCall);
        });
    },

    // Creates the movie card collection by iterating through the array
    createMovieCardCollection: function(movieResult) {
        // Movie exists
        if(movieResult.Response === 'True') {
            omdbTotalResults = parseInt(movieResult.totalResults);

            if (omdbTotalResults >= 1) {
                for (i in movieResult.Search) {
                    moviesCollection.createMovieCard(movieResult.Search[i]);
                }

                if(moviesCollection.totalCards === 0) {
                    moviesCollection.noValidMovies();
                } else {
                    $('.search-results').show();
                    $('.footer-add-movies').show();
                }
            }
        } else {
            moviesCollection.noValidMovies();
        }

        moviesCollection.totalCards = 0;
    },

    // If no valid movies are found, go here
    noValidMovies: function() {
        $('.search-output').html("No valid movie\(s\) found");
        $('.search-results').show();
    },

    // Creates the individual movie card
    createMovieCard: function(movieDetails) {
        let omdbResult = movieDetails;
        let omdbPoster = omdbResult.Poster;

        // Filter out movies that don't have a poster;
        if (omdbPoster !== 'N/A' && imageExists(omdbPoster)) {
            let movieCardBlock = $('<div>');
            movieCardBlock.addClass('d-inline-block');

            let movieCardSep = $('<div>');
            movieCardSep.addClass('card my-2 mx-2');
            movieCardSep.attr('style', 'width: 8rem;');

            let movieCardHeader = $('<div>');
            movieCardHeader.addClass('card-header p-2 text-center');

            let movieCardLabel = $('<label>');
            movieCardLabel.addClass('image-checkbox');

            let movieCardImg = $('<img>');
            movieCardImg.addClass('img-responsive');
            movieCardImg.attr({
                src: omdbPoster, 
                alt: omdbResult.Title,
                width: '100px',
                height: '150px'
            });

            let movieCardInput = $('<input>');
            movieCardInput.attr({
                type: 'checkbox',
                name: 'image[]',
                value: ''
            });

            let movieCardIcon = $('<i>');
            movieCardIcon.addClass('fa fa-check hidden');

            movieCardLabel.append(movieCardImg, movieCardInput, movieCardIcon);

            movieCardHeader.append(movieCardLabel);
            movieCardSep.append(movieCardHeader);
            movieCardBlock.append(movieCardSep);

            moviesCollection.totalCards++;

            $('.search-output').append(movieCardBlock);
        }
    },

    // Adds movie to the collection and shows the results
    addMovie: function(movieName) {
        moviesCollection.movies.push(movieName);

        $('.search-output').empty();
        $('.search-results').hide();
        $('.footer-add-movies').hide();
    },

    // Removes the movie from the collection
    removeMovie: function(removeMovieName) {
        let movieLocation = moviesCollection.movies.indexOf(removeMovieName);
 
        // If Found
        if (movieLocation > -1) {
            moviesCollection.movies.splice(movieLocation, 1);
        } else {
            console.log("removeMovie - else");
        }
    }
}

// Object is used for giphy cards collection
let cardCollection = {
    cards: {},
    giphyAPIKey: '4mVcUe5J1XlxtySdI87CuK0TTQw7yWgJ',
    displayCardSelector: '.display-cards',

    // Call the GIPHY API and search by a movie
    searchGifs: function(movieName) {
        let giphyEndpoint = 'https://api.giphy.com/v1/gifs/search?api_key=' + cardCollection.giphyAPIKey;

        const gifRating = 'G';
        const gifLang = 'en';

        $.ajax({
            url: giphyEndpoint,
            method: 'GET',
            data: { 
                q: movieName,
                limit: 10,
                offset: 0,
                rating: gifRating,
                lang: gifLang
            },
        })
        .then(function(giphyResultCall) {
            cardCollection.cards = giphyResultCall.data;
            cardCollection.createCardCollection();
        });
    },

    // Creates the GIPHY card collection
    createCardCollection: function() {
        for (i in cardCollection.cards) {
            let newCard = cardCollection.cards[i];
            cardCollection.createCard(newCard);
        }
    },

    // Creates the individual GIPHY card
    createCard: function(displayCard) {
        console.log(displayCard);
        let cardDiv = $('<div>');
        cardDiv.addClass('card m-2 border border-dark');
        cardDiv.attr('style', 'width: 18rem;')

        let imgCard = $('<img>');
        imgCard.addClass('card-details');
        imgCard.attr({
            src: displayCard.images.fixed_height_still.url, 
            alt: displayCard.title,
            id: displayCard.id,
            static: displayCard.images.fixed_height_still.url,
            animated: displayCard.images.fixed_height.url
        });

        console.log(displayCard);

        cardDiv.append(imgCard);

        let cardBodyDiv = $('<div>');
        cardBodyDiv.addClass('card-body');

        let cardTitle = $('<h5>');
        cardTitle.text(displayCard.title);

        cardBodyDiv.append(cardTitle);
        cardDiv.append(cardBodyDiv);

        let listGroup = $('<ul>');
        listGroup.addClass('list-group list-group-flush');

        let listItem1 = $('<li>');
        listItem1.addClass('list-group-item');
        listItem1.html('<div class="container"><div class="row"><div class="col-6">Rating: ' + displayCard.rating + '</div><div class="col-6 text-right card-icon-color"><a class="download-image" data-href="' + displayCard.images.fixed_height.url + '" download"><i class="fa fa-2x fa-download hover-icon" aria-hidden="true"></i></a> <i class="fa fa-2x fa-heart my-favorite-gif hover-icon" data-href="' + displayCard.images.fixed_height.url + '" data-title="' + displayCard.title + '" aria-hidden="true"></i></div></div></div>');

        listGroup.append(listItem1);
        cardDiv.append(listGroup);

        $(cardCollection.displayCardSelector).append(cardDiv);
    },
}

// Loads when the document started
$( document ).ready(function() {
    loadFavorites();

    // When the movie search button is selected
    $(document).on('click', ".movie-search", function() {
        event.preventDefault();
        let movieSearchLocation = $(this).attr('data-search-name');
        let movieSearchString = $('.' + movieSearchLocation).val();
        console.log("Search String: " + movieSearchString);

        moviesCollection.searchForMovies(movieSearchString);
        $('.movie-value').val('');

        $('.search-screen').hide();
        $('.primary-screen').show();
    });

    // Flip between static and animated card
    $(document).on('click', ".card-details", function() {
        let cardId = $(this).attr('id');
        let cardSource = $(this).attr('src');
        let cardStatic = $(this).attr('static');
        let cardAnimated = $(this).attr('animated');

        if (cardSource === cardStatic) {
            $(this).attr('src', cardAnimated);
        } else {
            $(this).attr('src', cardStatic);
        }
        
    });
    
    // Sync the state to the input
    $(document).on('click', ".image-checkbox", function(e) {
        event.preventDefault();
        $(this).toggleClass('image-checkbox-checked');
        let $checkbox = $(this).find('input[type="checkbox"]');
        $checkbox.prop("checked",!$checkbox.prop("checked"))
        $(this).find('i').toggleClass('hidden');
    });

    // When the add movie button is clicked
    $(document).on('click', ".add-movies", function() {
        $('.image-checkbox-checked').each(function() {
            let movieTitle = $(this).find('img').attr('alt');
            moviesCollection.addMovie(movieTitle);
            cardCollection.searchGifs(movieTitle);

            $(this).toggleClass('image-checkbox-checked')
        });
    });

    // Download image button and logic
    $(document).on('click', ".download-image", function() {
        let downloadPath = $(this).attr('data-href');
        console.log(downloadPath);
        downloadImage(downloadPath);
    });

    // My Favorite button icon is clicked
    $(document).on('click', ".my-favorite-gif", function() {
        let favoriteURL = $(this).attr('data-href');
        let favoriteTitle = $(this).attr('data-title');
        myFavorites[favoriteURL] = favoriteTitle;

        if(!localStorage.getItem('myFavorites')) {
            $('.dropdown-menu').empty();
        } 

        localStorage.setItem('myFavorites',JSON.stringify(myFavorites));
        populateFavorites(favoriteURL, favoriteTitle);
    });  

    // When the window is closed
    $(document).on('click', ".fa-window-close", function() {
        $('.search-output').empty();
        $('.search-results').hide();
        $(".footer-add-movies").hide();
    });

    // When the reset-screen link is clicked
    $(document).on('click', "#reset-screen", function() {
        location.reload();
    });

    // When the clear-favorites is clicked
    $(document).on('click', "#clear-favorites", function() {
        localStorage.clear();
        $('.dropdown-menu').html('<a class="dropdown-item my-favorites" href="#">None yet</a>');
    });

    // Load favorites from local storage
    function loadFavorites() {
        let favoriteGifs;
        if(localStorage.getItem('myFavorites')) {
            $('.dropdown-menu').empty();
            favoriteGifs = JSON.parse(localStorage.getItem('myFavorites'));

            $.each(favoriteGifs, function(giphyURL, giphyTitle) {
                myFavorites[giphyURL] = giphyTitle;
                populateFavorites(giphyURL, giphyTitle);
            });
        }
    }

    // Populate favorites on pull down
    function populateFavorites(link, title) {
        let linkFav = $('<a class="dropdown-item my-favorites" href="' + link + '" target="_blank">' + title + '</a>');
        $('.dropdown-menu').append(linkFav);
    }
});

// https://stackoverflow.com/questions/18837735/check-if-image-exists-on-server-using-javascript
function imageExists(image_url){
    returnImageCheck = false;
    image_url = image_url.replace('http:', 'https:')

    let http = new XMLHttpRequest();

    try {
        http.open('HEAD', image_url, false);
        http.send();

        returnImageCheck = true;
    } catch {
        return null;
    }

    return returnImageCheck;

}

// Check to see if the image exists on the remote path
function downloadImage(downloadPath) {
    let x=new XMLHttpRequest();
	x.open("GET", downloadPath, true);
	x.responseType = 'blob';
	x.onload=function(e){download(x.response, '200.gif', "image/gif" ); }
	x.send();
}