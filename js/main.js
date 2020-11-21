var compactMovies = movies.map(function(movie, i) {
  return {
    id: i + 1,
    title: movie.Title.toString(),
    image: `http://i3.ytimg.com/vi/${movie.ytid}/hqdefault.jpg`,
    year: movie.movie_year,
    categories: movie.Categories.split('|'),
    summary: movie.summary,
    imdbRating: movie.imdb_rating,
    runTime: movie.runtime,
    youtubeId: movie.ytid,
    imdbId: movie.imdb_id,
  }
});

var elMoviesBox = $_('.movies-list');
var elMoviesTemlate = $_('#moviesTemplate').content;
var elSearchForm = $_('.movies-search-form');
var elSearchInput = $_('.movies-search-input', elSearchForm);

var createMoviesElement = function (movie) {
  var cloneMovies = elMoviesTemlate.cloneNode(true);

  $_('.summary-button', cloneMovies).href = `#${movie.imdbId}`;
  $_('.summary-box', cloneMovies).id = movie.imdbId;

  $_('.movie-title', cloneMovies).textContent = movie.title;
  $_('.movie-img-youtube', cloneMovies).src = movie.image;
  $_('.movie-year', cloneMovies).textContent = movie.year;
  $_('.movie-summar', cloneMovies).textContent = movie.summary;
  $_('.movie-categories', cloneMovies).textContent = movie.categories.join(', ');
  $_('.movie-youtube', cloneMovies).textContent = `Watch List`;
  $_('.movie-youtube', cloneMovies).href = `https://www.youtube.com/watch?v=${movie.youtubeId}`;
  $_('.movie-rating', cloneMovies).textContent = `Movie Rating: ${movie.imdbRating}`;
  $_('.movie-runtime', cloneMovies).textContent = movie.runTime;

  return cloneMovies;
}

//render 
var renderMovies = function (movies) {
  elMoviesBox.innerHTML = '';

  elKinolarFrogmentBox = document.createDocumentFragment();

  movies.forEach(function (movie) {
    elKinolarFrogmentBox.appendChild(createMoviesElement(movie));
  });

  elMoviesBox.appendChild(elKinolarFrogmentBox);
};

//option
var newCategorieArray = ['All']
var elCategorieSelect = $_('.search-select', elSearchForm);

compactMovies.forEach(function (movie) {
  movie.categories.forEach(function (categorie) {
    if (!(newCategorieArray.includes(categorie))) {
      newCategorieArray.push(categorie);
    } 
  });
});

newCategorieArray.forEach(function(categorie) {
  var elNewOption = createElement('option', '', categorie);
  elNewOption.value = categorie;
  elCategorieSelect.appendChild(elNewOption); 
})
// rating select
var elRatingSelect = $_('.movie-rating-select', elSearchForm);


//qidruv
var searchForMovies = function (evt) {
  evt.preventDefault();

  var movieInputValues = elSearchInput.value === '';

  if (movieInputValues) {
    alert(`ma'lumot kiriting`);
    elSearchInput.value = '';
    elSearchInput.focus();
    return;
  }

  var searchInput = elSearchInput.value.trim();
  var categoriesValue = elCategorieSelect.value;
  

  var searchQuery = new RegExp(searchInput, 'gi');

  var searchResult = compactMovies.filter(function (movie) {

    elMoviesBox.innerHTML = '';

    var checkTitle = movie.title.match(searchQuery);
    var checkCategorie = categoriesValue === 'All' || movie.categories.includes(categoriesValue);
  
    return (checkTitle && checkCategorie);

  });
  //sortlash
  if (elRatingSelect.value === 'alphabetical') {
    searchResult.sort(function (a, b) {
      return b.title - a.title;
    })
  }

  else if (elRatingSelect.value === 'rating') {
    searchResult.sort(function (a, b) {
      return b.imdbRating - a.imdbRating;
    });
  }

  else if (elRatingSelect.value === 'release_date') {
    searchResult.sort(function (a, b) {
      return b.year - a.year;
    });
  }

  else {
    searchResult.sort(function (a, b) {
      return b.runTime - a.runTime;
    });
  }

  // yoq bolsa 
  if (!searchResult.length) {
    alert(`bunday kino yo'q`);
    elSearchInput.value = ''
    elSearchInput.focus();
    return;
  }

  renderMovies(searchResult);
}

// renderMovies(compactMovies)

//submit
elSearchForm.addEventListener('submit', searchForMovies)