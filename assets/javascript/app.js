let moviesCollection = {
    movies: [],
    omdbAPIKey: '6edcc50',

    returnMovies: function() {
        return moviesCollection.movies;
    },

    addMovie: function(addMovieName) {
        // ajax call to check if the movie is valid
        let searchResultsSelector = $('.search-results');
        let omdbSearchURL = 'http://www.omdbapi.com/?apikey=' + moviesCollection.omdbAPIKey;
        $.ajax({
            url: omdbSearchURL,
            method: 'GET',
            data: { 
                s: addMovieName,
                type: 'movie'
            },
        })
        .then(function(omdbResultCall) {
            console.log(omdbResultCall);
            // Movie exists
            if(omdbResultCall.Response === 'True') {
                omdbTotalResults = parseInt(omdbResultCall.totalResults);

                if (omdbTotalResults === 1) {
                    moviesCollection.movies.push(addMovieName);
                } else if (omdbTotalResults >= 1) {
                    
                    for (i in omdbResultCall.Search) {
                        let omdbResult = omdbResultCall.Search[i];
                        let omdbPoster = omdbResult.Poster;

                        if (omdbPoster === 'N/A') {
                            omdbPoster = 'assets/images/blank-movie.jpg';
                        }

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
                        $('.search-results').show();
                        $('.footer-add-movies').show();
                    }

                    console.log(parseInt(omdbResultCall.totalResults));
                    console.log(omdbResultCall);
                }
            } else {
                console.log('Movie doesnt exist');
            }
        });
    },

    addMoviePopup: function() {

    },

    removeMovie: function(removeMovieName) {
        var movieLocation = moviesCollection.movies.indexOf(removeMovieName);
 
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

console.log(moviesCollection.returnMovies());
moviesCollection.addMovie('Batman');
moviesCollection.addMovie('TestCrazyHell');
console.log(moviesCollection.returnMovies());
moviesCollection.removeMovie('what');
moviesCollection.removeMovie('TestCrazyHell');
console.log(moviesCollection.returnMovies());
cardCollection.searchGifs('Indiana Jones');
cardCollection.searchGifs('The Incredibles');

// Loads when the document started
$( document ).ready(function() {
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
        $(this).toggleClass('image-checkbox-checked');
        var $checkbox = $(this).find('input[type="checkbox"]');
        $checkbox.prop("checked",!$checkbox.prop("checked"))
        $(this).find('i').toggleClass('hidden');
    
        e.preventDefault();
    });
});

// Special characters suck - quick function to strip those and only used for the comparison
function stringReplaceSpecialCharacters(stringInput) {
    stringInput = stringInput.replace(/[^a-zA-Z0-9]/g,'_');

    return stringInput;
}