PaceStrategy = (function() {
  
  var mileAxixArray = function(){
    // create miles array
    var miles = Array.from(Array(26)).map((e,i)=>i+1);
    miles.push(26.2)
    return miles
  }
  
  var Build = function(paceSeconds, splitDeltaSec) {
    // create miles array
    var miles = mileAxixArray();
    
    var splitDiff = splitDeltaSec/2;
    var maxSplit = paceSeconds + splitDiff;
    var minSplit = paceSeconds - splitDiff;
    var continuousDiff = splitDeltaSec/26.2;
    
    var evenSplits = miles.map((e,i) => ({ mile: e, y: paceSeconds }));
    var negativeHalf = miles.map((e,i) => ({ mile: e, y: e<13.1 ? maxSplit : minSplit }));
    var negativeContinuous = miles.map((e,i) => ({ mile: e, y: maxSplit - e*continuousDiff }));
    
    var BuildPaceInfo = function(paceArray) {
      for (i = 0; i < paceArray.length; i++) { 
        var prev = i>0 ? paceArray[i-1] : {timeSec:0,mile:0}
        var prev_total = prev.timeSec;
        var mileDelta = paceArray[i].mile - prev.mile;
        var cur_pace = paceArray[i].y;
        var cur_time = prev_total + mileDelta * cur_pace;
        
        // update item
        paceArray[i].name = 'Mile ' + paceArray[i].mile;
        paceArray[i].pace = DateMath.secondsToTimeSpan(cur_pace);
        paceArray[i].timeSec = cur_time;
        paceArray[i].time = DateMath.secondsToTimeSpan(cur_time);
      }
    }
    
    BuildPaceInfo(evenSplits);
    BuildPaceInfo(negativeHalf);
    BuildPaceInfo(negativeContinuous);
    
    
    var commonChartSettings = {
      chart: {
            type: 'column'
      },
      xAxis: {
          categories: miles,
          title: {
              text: 'Miles'
          }
      },
      yAxis: {
          min: minSplit-10,
          max: maxSplit+10,
          title: {
              text: 'Pace Time (sec)'
          },
          visible: false
      },
      tooltip: {
          formatter: function () {
              return 'Mile: <b>' + this.point.mile + '</b><br> '+
                     'Pace: <b>' + this.point.pace + '</b><br> '+
                     'Time: <b>' + this.point.time + '</b> ';
          }
      },
      plotOptions: {
          column: {
              pointPadding: -0.05,
              borderWidth: 0
          }
      },
      legend: {
          enabled: false
      }
    }
    
    var evenSplitOptions = $.extend({}, commonChartSettings, {
        title:  { text: 'Even Splits'},
        series: [{name: 'Pace', data: evenSplits }]
    });
    var negHalfOptions = $.extend({}, commonChartSettings, {
        title:  { text: 'Negative Half'},
        series: [{name: 'Pace', data: negativeHalf }]
    });
    var negContOptions = $.extend({}, commonChartSettings, {
        title:  { text: 'Negative Continuous'},
        series: [{name: 'Pace', data: negativeContinuous }]
    });
    
    Highcharts.chart('container-1', evenSplitOptions);
    Highcharts.chart('container-2', negHalfOptions);
    Highcharts.chart('container-3', negContOptions);
  }
  
  return {
    Build: Build
  }
})();

