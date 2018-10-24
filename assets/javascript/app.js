let moviesCollection = {
    movies: [],
    omdbAPIKey: '6edcc50',

    returnMovies: function() {
        return moviesCollection.movies;
    },

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
            moviesCollection.createMovieCardCollection(omdbResultCall);
        });
    },

    createMovieCardCollection: function(movieResult) {
        // Movie exists
        if(movieResult.Response === 'True') {
            omdbTotalResults = parseInt(movieResult.totalResults);

            if (omdbTotalResults === 1) {
                moviesCollection.movies.push(addMovieName);
            } else if (omdbTotalResults >= 1) {
                
                for (i in movieResult.Search) {
                    moviesCollection.createMovieCard(movieResult.Search[i]);
                }

                $('.search-results').show();
                $('.footer-add-movies').show();
            }
        } else {
            console.log('Movie doesnt exist');
        }
    },

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

            $('.search-results').append(movieCardBlock);
        }
    },

    addMovie: function(movieName) {
        moviesCollection.movies.push(movieName);

        $('.search-results').empty().hide();
        $('.footer-add-movies').hide();
    },

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

let cardCollection = {
    cards: {},
    giphyAPIKey: '4mVcUe5J1XlxtySdI87CuK0TTQw7yWgJ',
    displayCardSelector: '.display-cards',

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

    createCardCollection: function() {
        for (i in cardCollection.cards) {
            let newCard = cardCollection.cards[i];
            cardCollection.createCard(newCard);
        }
    },

    createCard: function(displayCard) {
        console.log(displayCard);
        let cardDiv = $('<div>');
        cardDiv.addClass('card m-2 image-checkbox');
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
        listItem1.text('blah');

        let listItem2 = $('<li>');
        listItem2.addClass('list-group-item');
        listItem2.text('test');
        
        let listItem3 = $('<li>');
        listItem3.addClass('list-group-item');
        listItem3.text('what');

        listGroup.append(listItem1);
        listGroup.append(listItem2);
        listGroup.append(listItem3);

        cardDiv.append(listGroup);

        $(cardCollection.displayCardSelector).append(cardDiv);
    },
}

// Loads when the document started
$( document ).ready(function() {
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
    
    // sync the state to the input
    $(document).on('click', ".image-checkbox", function(e) {
        event.preventDefault();
        $(this).toggleClass('image-checkbox-checked');
        let $checkbox = $(this).find('input[type="checkbox"]');
        $checkbox.prop("checked",!$checkbox.prop("checked"))
        $(this).find('i').toggleClass('hidden');
    });

    $(document).on('click', ".add-movies", function() {
        $('.image-checkbox-checked').each(function() {
            let movieTitle = $(this).find('img').attr('alt');
            moviesCollection.addMovie(movieTitle);
            cardCollection.searchGifs(movieTitle);

            $(this).toggleClass('image-checkbox-checked')
        });
    })
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