// https://scotch.io/bar-talk/4-javascript-design-patterns-you-should-know
DateMath = (function() {

  var secondsToTimeSpan = function(secString) {
      // http://stackoverflow.com/a/6313008/1366033
      var sec_num = parseInt(secString, 10); // don't forget the second param
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);
  
      var includeHours = hours > 0;
  
      if (minutes < 10 && includeHours) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      
      var timespan = (includeHours ? hours+':' : '') + minutes+':'+seconds;
      return timespan
  }
  
  var timespanToSeconds = function(str) {
    // http://stackoverflow.com/a/9640417/1366033
      var p = str.split(':'),
          s = 0, m = 1;
  
      while (p.length > 0) {
          s += m * parseInt(p.pop(), 10);
          m *= 60;
      }
  
      return s;
  }

  return {
    secondsToTimeSpan: secondsToTimeSpan,
    timespanToSeconds: timespanToSeconds
  };

})();