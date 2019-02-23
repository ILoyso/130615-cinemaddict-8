const getFilmTemplate = (hasControls = true) => {
  const controlsTemplate = `<form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist"><!--Add to watchlist--> WL</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched"><!--Mark as watched-->WTCHD</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite"><!--Mark as favorite-->FAV</button>
          </form>`;

  return `<article class="film-card ${hasControls ? `` : `film-card--no-controls`}">
          <h3 class="film-card__title">The Assassination Of Jessie James By The Coward Robert Ford</h3>
          <p class="film-card__rating">9.8</p>
          <p class="film-card__info">
            <span class="film-card__year">2018</span>
            <span class="film-card__duration">1h&nbsp;13m</span>
            <span class="film-card__genre">Comedy</span>
          </p>
          <img src="./images/posters/three-friends.jpg" alt="" class="film-card__poster">
          <p class="film-card__description">A priest with a haunted past and a novice on the threshold of her final vows are sent by the Vatican to investigate the death of a young nun in Romania and confront a malevolent force in the form of a demonic nun.</p>
          <button class="film-card__comments">13 comments</button>
          ${hasControls ? controlsTemplate : ``}
        </article>`;
};

export default getFilmTemplate;

