
PaceTable = (function() {
  
  var CreateTimeArray = function(){
    var lowestPaceSeconds = 4*60+40;
    var highestPaceSeconds = 15*60;
    var paceIntervalSeconds = 5
    var numberIntervals = Math.round((highestPaceSeconds - lowestPaceSeconds) / paceIntervalSeconds) + 1;
        

    var paces = []
    for (i = 0; i < numberIntervals; i++) {
      var seconds = lowestPaceSeconds + i*paceIntervalSeconds;
        paces.push({
          sec: seconds,
          timespan: DateMath.secondsToTimeSpan(seconds)
        });
    }
    
    
    // combine paces + distances
    for (i = 0; i < paces.length; i++) {
      var pace = paces[i];
      var secPerMile = pace.sec;
      pace.times = []
      for (j = 0; j < PaceData.distances.length; j++) {
        var distance = PaceData.distances[j];
        var miles = distance.distanceInMiles;
        var totalSeconds = secPerMile * miles;
        pace.times.push(DateMath.secondsToTimeSpan(totalSeconds));
      }
    
    }
    
    return paces

  }

  var BuildTable = function(paces){
    // build table
    // https://datatables.net/examples/styling/hover.html
    // https://datatables.net/examples/styling/material.html
    var $table = $("<table class='hover mdl-data-table' style='font-size: .8em;'>")
    
    // header
    var $thead = $("<thead>")
    var $tr  = $("<tr>")
    $tr.append("<th>Mile pace</th>")
    for (j = 0; j < PaceData.distances.length; j++) {
      $tr.append("<th>"+PaceData.distances[j].name+"</th>");
    }
    $thead.append($tr);
    $table.append($thead);
    
    // rows
    var $tbody = $("<tbody>")
    
    
    for (i = 0; i < paces.length; i++) {
      var pace = paces[i];
      
      $tr  = $("<tr>")
      $tr.append("<td>"+pace.timespan+"</td>");
      
      for (j = 0; j < pace.times.length; j++) {
        $tr.append("<td>"+pace.times[j]+"</td>");
      }
      $tbody.append($tr);
    }
    
    $table.append($tbody);
    
    $("#placeholder").append($table)
  }

  
  var Build = function() {

    
    var paceArray = CreateTimeArray();
    BuildTable(paceArray);
    
    
    return {
        dataTable: dataTable
      };
      
  }

  return {
    Build: Build,
  };

})();
