const omdbAPIKey = '6edcc50';
const giphyAPIKey = '4mVcUe5J1XlxtySdI87CuK0TTQw7yWgJ';

let moviesCollection = {
    movies: [],
    omdbEndpoint: 'http://www.omdbapi.com/?apikey=' + omdbAPIKey,

    returnMovies: function() {
        return moviesCollection.movies;
    },

    addMovie: function(addMovieName) {
        // ajax call to check if the movie is valid
        omdbSearchURL = moviesCollection.omdbEndpoint;
        $.ajax({
            url: omdbSearchURL,
            method: 'GET',
            data: { 
                s: addMovieName
            },
        })
        .then(function(omdbResultCall) {
            // Movie exists
            if(omdbResultCall.Response === 'True') {
                moviesCollection.movies.push(addMovieName);
                console.log('Movie exists');
            } else {
                console.log('Movie doesnt exist');
            }
        });
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
    giphyEndpoint: 'https://api.giphy.com/v1/gifs/search?api_key=' + giphyAPIKey,
    displayCardSelector: '.display-cards',

    searchGifs: function(movieName) {
        $.ajax({
            url: cardCollection.giphyEndpoint,
            method: 'GET',
            data: { 
                q: movieName,
                limit: 10,
                offset: 0,
                rating: 'G',
                lang: 'en'
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
        cardDiv.addClass('card m-2');
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
moviesCollection.addMovie('Indiana Jones');
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
});

// Special characters suck - quick function to strip those and only used for the comparison
function stringReplaceSpecialCharacters(stringInput) {
    stringInput = stringInput.replace(/[^a-zA-Z0-9]/g,'_');

    return stringInput;
}