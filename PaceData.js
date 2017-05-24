PaceData = (function() {

  var bqTimes = [
    {min:18, max:34,  F:'3:05:00', M:'3:35:00'},
    {min:35, max:39,  F:'3:10:00', M:'3:40:00'},
    {min:40, max:44,  F:'3:15:00', M:'3:45:00'},
    {min:45, max:49,  F:'3:25:00', M:'3:55:00'},
    {min:50, max:54,  F:'3:30:00', M:'4:00:00'},
    {min:55, max:59,  F:'3:40:00', M:'4:10:00'},
    {min:60, max:64,  F:'3:55:00', M:'4:25:00'},
    {min:65, max:69,  F:'4:10:00', M:'4:40:00'},
    {min:70, max:74,  F:'4:25:00', M:'4:55:00'},
    {min:75, max:79,  F:'4:40:00', M:'5:10:00'},
    {min:80, max:150, F:'4:55:00', M:'5:25:00'}
  ];

  var distances = [
    {name:"1 Mile",   distanceInMiles:1},
    {name:"2 Miles",  distanceInMiles:2},
    {name:"3 Miles",  distanceInMiles:3},
    {name:"5k",       distanceInMiles:3.1},
    {name:"4 Miles",  distanceInMiles:4},
    {name:"5 Miles",  distanceInMiles:5},
    {name:"6 Miles",  distanceInMiles:6},
    {name:"10k",      distanceInMiles:6.2},
    {name:"7 Miles",  distanceInMiles:7},
    {name:"8 Miles",  distanceInMiles:8},
    {name:"9 Miles",  distanceInMiles:9},
    {name:"10 Miles", distanceInMiles:10},
    {name:"11 Miles", distanceInMiles:11},
    {name:"12 Miles", distanceInMiles:12},
    {name:"13 Miles", distanceInMiles:13},
    {name:"Half",     distanceInMiles:13.1},
    {name:"14 Miles", distanceInMiles:14},
    {name:"15 Miles", distanceInMiles:15},
    {name:"16 Miles", distanceInMiles:16},
    {name:"17 Miles", distanceInMiles:17},
    {name:"18 Miles", distanceInMiles:18},
    {name:"19 Miles", distanceInMiles:19},
    {name:"20 Miles", distanceInMiles:20},
    {name:"21 Miles", distanceInMiles:21},
    {name:"22 Miles", distanceInMiles:22},
    {name:"23 Miles", distanceInMiles:23},
    {name:"24 Miles", distanceInMiles:24},
    {name:"25 Miles", distanceInMiles:25},
    {name:"26 Miles", distanceInMiles:26},
    {name:"Full",     distanceInMiles:26.2},
  ]

  return {
    bqTimes: bqTimes,
    distances, distances
  };

})();

