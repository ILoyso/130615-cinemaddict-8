const Emoji = {
  sleeping: `😴`,
  grinning: `😀`,
  neutralFace: `😐`
};


/** Class for help transforming data from server to our model */
export default class ModelFilm {

  /**
   * Transform data from server to our app
   * @param {Object} data
   */
  constructor(data) {
    this.id = data[`id`];
    this.filmInfo = {
      title: data[`film_info`][`title`] || ``,
      originalTitle: data[`film_info`][`alternative_title`] || ``,
      description: data[`film_info`][`description`] || ``,
      poster: data[`film_info`][`poster`].slice(15, -4),
      duration: data[`film_info`][`runtime`] * 60000,
      actors: data[`film_info`][`actors`],
      genres: new Set(data[`film_info`][`genre`]),
      restrictions: data[`film_info`][`age_rating`],
      director: data[`film_info`][`director`] || ``,
      writers: data[`film_info`][`writers`] || [],
      premiere: data[`film_info`][`release`][`date`],
      country: data[`film_info`][`release`][`release_country`],
      rating: data[`film_info`][`total_rating`]
    };
    this.userInfo = {
      isFavorite: Boolean(data[`user_details`][`favorite`]),
      isViewed: Boolean(data[`user_details`][`already_watched`]),
      isGoingToWatch: Boolean(data[`user_details`][`watchlist`]),
      rating: Math.round(data[`user_details`][`personal_rating`]),
      date: data[`user_details`][`watching_date`]
    };
    this.comments = data[`comments`].reduce((comments, comment) => {
      const emojiName = comment[`emotion`] === `neutral-face` ? `neutralFace` : comment[`emotion`];

      comments.push({
        text: comment[`comment`],
        author: comment[`author`],
        emoji: Emoji[emojiName],
        date: comment[`date`]
      });
      return comments;
    }, []);
  }

  /**
   * Method for transform film data from our data model to server
   * @return {Object}
   */
  toRAW() {
    return {
      'id': this.id,
      'film_info': {
        'title': this.filmInfo.title,
        'alternative_title': this.filmInfo.originalTitle,
        'description': this.filmInfo.description,
        'poster': `images/posters/${this.filmInfo.poster}.jpg`,
        'runtime': this.filmInfo.duration / 60000,
        'actors': this.filmInfo.actors,
        'genre': [...this.filmInfo.genres.values()],
        'age_rating': this.filmInfo.restrictions,
        'director': this.filmInfo.director,
        'writers': this.filmInfo.writers,
        'total_rating': this.filmInfo.rating,
        'release': {
          'date': this.filmInfo.premiere,
          'release_country': this.filmInfo.country
        }
      },
      'user_details': {
        'favorite': this.userInfo.isFavorite,
        'already_watched': this.userInfo.isViewed,
        'watchlist': this.userInfo.isGoingToWatch,
        'personal_rating': this.userInfo.rating
      },
      'comments': this.comments.reduce((comments, comment) => {
        let emotionName = ``;
        for (const emotion in Emoji) {
          if (Emoji[emotion] === comment.emoji) {
            emotionName = emotion;
          }
        }


        comments.push({
          'comment': comment.text,
          'author': comment.author,
          'emotion': emotionName === `neutralFace` ? `neutral-face` : emotionName,
          'date': comment.date
        });
        return comments;
      }, [])
    };
  }

  /**
   * Method for parse film
   * @param {Object} data
   * @return {Object}
   */
  static parseFilm(data) {
    return new ModelFilm(data);
  }

  /**
   * Method for parse films
   * @param {Array} data
   * @return {Array}
   */
  static parseFilms(data) {
    return data.map(ModelFilm.parseFilm);
  }
}

