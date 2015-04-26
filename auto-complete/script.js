/**
 * Auto complete example
 *
 * @see  https://xgrommx.github.io/rx-book/WhyRx.html
 */

$(function() {

  function searchWikipedia (term) {
      return $.ajax({
          url: 'http://en.wikipedia.org/w/api.php',
          dataType: 'jsonp',
          data: {
              action: 'opensearch',
              format: 'json',
              search: term
          }
      }).promise();
  }

  var $input = $('#input'),
    $results = $('#results');

  /* capture all keyup events */
  var keyups = Rx.Observable.fromEvent($input, 'keyup').
    map(function(e) {
      /* we only care about text in the input */
      return e.target.value;
    }).
    filter(function(text) {
      /* only query server when user input is at least 2 characters */
      return text.length > 2;
    });

  /* debounce input for 500 ms*/
  var throttled = keyups.throttle(500 /*ms*/);

  /* get only distinct values, so we eliminate the arrows and other control characters */ 
  var distinct = throttled.distinctUntilChanged();

  /* get the value and ensure that we're not introducing any out of order sequence calls */
  var suggestions = distinct.flatMapLatest(searchWikipedia);

  suggestions.subscribe(function(data) {
    var res = data[1];

    /* clear results */
    $results.empty();

    res.forEach(function(value) {
      $('<li>' + value + '</li>').appendTo($results);
    });
  }, function(error) {
    $results.empty();
    $('<li>Error: ' + error + '</li>').appendTo($results);
  });
});