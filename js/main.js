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

  $_('.movie-item', cloneMovies).dataset.imdbId = movie.imdbId;
  $_('.movie-title', cloneMovies).textContent = movie.title;
  $_('.movie-img-youtube', cloneMovies).src = movie.image;
  $_('.movie-year', cloneMovies).textContent = movie.year;
  $_('.movie-categories', cloneMovies).textContent = movie.categories.join(', ');
  $_('.movie-youtube', cloneMovies).textContent = `Watch List`;
  $_('.movie-youtube', cloneMovies).href = `https://www.youtube.com/watch?v=${movie.youtubeId}`;
  $_('.movie-rating', cloneMovies).textContent = movie.imdbRating;
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
var elCategorieSelect = $_('.search-select', elSearchForm);
var funcCategories = function() {
  var newCategorieArray = ['All']
  compactMovies.forEach(function (movie) {

    movie.categories.forEach(function (categorie) {
      if (!newCategorieArray.includes(categorie)) {
        newCategorieArray.push(categorie);
      }
    });
  });

  newCategorieArray.sort();
  var elOptionFragment = document.createDocumentFragment();
  newCategorieArray.forEach(function (categorie) {
    var elNewOption = createElement('option', '', categorie);
    elNewOption.value = categorie;
    elOptionFragment.appendChild(elNewOption);
  });

  elCategorieSelect.appendChild(elOptionFragment);

};
funcCategories();
// rating select
var elRatingSelect = $_('.movie-rating-select', elSearchForm);
var elRatingFunc = function() {
  var sortArray = [
  {
    name:"All",
    sort:"all"
  },
  {
    name:"IMdB rating higher",
    sort:"IMdBRH"
  },
  {
    name:"IMdB rating lower",
    sort:"IMdBRL"
  },
  {
    name:"Time Up",
    sort:"timeup"
  },
  {
    name:"Time Down",
    sort:"timedown"
  },
  {
    name:"Year up",
    sort:"yearup"
  },
  {
    name:"Year Down",
    sort:"yeardown"
  },
  {
    name:"A-Z",
    sort:"az"
  },
  {
    name:"Z-A",
    sort:"za"
  }
];

  sortArray.sort();
  var elRatingFragment = document.createDocumentFragment();
  sortArray.forEach(function(rating) {
    var elNewOption = createElement('option', '', rating);
    elNewOption.value = rating.sort;
    elNewOption.textContent = rating.name;
    elRatingFragment.appendChild(elNewOption);
  });
  
  elRatingSelect.appendChild(elRatingFragment);
  
};
elRatingFunc();
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
    var checkCategorie = categoriesValue === 'all' || movie.categories.includes(categoriesValue);
  
    return (checkTitle && checkCategorie);

  });
  //sortlash
  if (elRatingSelect.value === 'yeardown') {
    searchResult.sort(function (a, b) {
      return a.year - b.year;
    })
  }

  else if (elRatingSelect.value === 'yearup') {
    searchResult.sort(function (b, a) {
      return a.year - b.year;
    });
  }

  else if (elRatingSelect.value === 'timeup') {
    searchResult.sort(function (b, a) {
      return a.runTime - b.runTime;
    });
  }

  else if (elRatingSelect.value === 'timedown') {
    searchResult.sort(function (a, b) {
      return a.runTime - b.runTime;
    }); 
  }

  else if (elRatingSelect.value === 'IMdBRH') {
    searchResult.sort(function (b, a) {
      return a.imdbRating - b.imdbRating;
    });
  }

  else if (elRatingSelect.value === 'IMdBRL') {
    searchResult.sort(function (a, b) {
      return a.imdbRating - b.imdbRating;
    }); 
  }
  else if (elRatingSelect.value === 'az') {
    searchResult.sort(function (a, b) {
      if (a.title > b.title) {
      return 1;
    } else if (a.title < b.title) {
      return -1;
    }
    return 0;
    });
  }

  else if (elRatingSelect.value === 'za') {
    searchResult.sort(function (b, a) {
      if (a.title < b.title) {
      return -1;
    } else if (a.title > b.title) {
      return 1;
    }
    return 0;
    }); 
  }

  else if(elRatingSelect.value === "all"){
    searchResult.sort(function(a, b){
      return a.id - b.id;
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
elSearchForm.addEventListener('submit', searchForMovies);

elMoviesBox.addEventListener('click', (evt) => {
  if (evt.target.matches('.js-open-modal-btn')) {
    var elParentLi = evt.target.closest('.movie-item');

    var moreInfo = compactMovies.find(function (movie) {
      return elParentLi.dataset.imdbId === movie.imdbId;
    });

    $_('.modal-title').textContent = moreInfo.title;
    $_('.movie-description').textContent = `Summary: ${moreInfo.summary}`;
  }
});