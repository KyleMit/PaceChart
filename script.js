var paceArray, dataTable
var dirtyFlag = false;
var updateScroll = true;

$(document).ready(function() {

  // customize ripple  
  //$.material.options.withRipples += ',.panel-heading.collapsible'
  
  // init mask
  //$("#pace_min").mask("99:99")
  //$("#total_time").mask("9:99:99")
  //$("#bq_aqe").mask("99")


  $.material.init();
  
  // defaults
  var splitDeltaSec = 20;
  var pace_sec = 10*60;
  
  BuildSlider(pace_sec)

  PaceStrategy.Build(pace_sec, splitDeltaSec)
  
  var output = PaceTable.Build();
  paceArray = output.paceArray

  // second half init (wait until table has a chance to settle in)
  setTimeout(function(){
    
    dataTable = InitDataTables()
  
    $("#pace_min").change(function() {

      var pace_span = this.value;
      var pace_sec = DateMath.timespanToSeconds(pace_span);
      var total_time = pace_sec * 26.2;
      var total_timespan = DateMath.secondsToTimeSpan(total_time)
      
      // highlight errors
      if (isNaN(pace_sec)) {
        $(this).closest('.form-group').addClass('has-warning')
        return
      } else {
        $(this).closest('.form-group').removeClass('has-warning')
      }
      
      
      
      //merely setting val - won't trigger change
      $("#total_time").val(total_timespan)

      
      highlightAndScrollToRow(pace_sec, updateScroll)
      
      BuildSlider(pace_sec)
      PaceStrategy.Build(pace_sec, splitDeltaSec)
      
      
    });
  
    $("#total_time").change(function() {

      
      var total_timespan = this.value;
      var total_time = DateMath.timespanToSeconds(total_timespan);
      var pace_sec = total_time / 26.2;
      var pace_span = DateMath.secondsToTimeSpan(pace_sec)
  
      // highlight errors
      if (isNaN(pace_sec)) {
        $(this).closest('.form-group').addClass('has-warning')
        return
      } else {
        $(this).closest('.form-group').removeClass('has-warning')
      }
  
      //merely setting val - won't trigger change
      $("#pace_min").val(pace_span)

      
      highlightAndScrollToRow(pace_sec, updateScroll)
  
      BuildSlider(pace_sec)
      PaceStrategy.Build(pace_sec, splitDeltaSec)
      
    });
  
    //bq saveable
    $("#sex_m, #sex_f, #bq_aqe").change(function(){
      var sex = $('input[name=sex]:checked').val();
      var age = $('#bq_aqe').val();
      var enabled = (sex === 'M' || sex === 'F') && (age !== '')
      var $saveBtn = $("#bq-save")
      if (enabled) {
        $saveBtn.removeAttr("disabled");
      } else {
        $saveBtn.attr("disabled", true);
      }
      $("#bq-save")
    }).change();
    
    //bq save
    $("#bq-save").click(function(){
      $('#bq-modal').modal('hide');
      var sex = $('input[name=sex]:checked').val();
      var age = $('#bq_aqe').val();
      
      for (i = 0; i < PaceData.bqTimes.length; i++) {
        var ageGroup = PaceData.bqTimes[i];
        var min_age = ageGroup.min
        if (age >= min_age) {
          // we got our group, now grab the time
          var finish_time = ageGroup[sex];
          $("#total_time").val(finish_time).trigger("change")
          break;
        }
      }
      
    })
    
    // capture grid clicks
    $('body').on('click', 'tr', function () {
      // get pace
      var pace_span = $(this).find("td:first").html();
      // feed into control
      updateScroll = false;
      $("#pace_min").val(pace_span).trigger("change")
      updateScroll = true;
    });
  
    // set init pace
    var pace_span = DateMath.secondsToTimeSpan(pace_sec)
    $("#pace_min").val(pace_span).trigger("change")
  }, 1000);
  
  
});


function InitDataTables()  {
   
  // https://datatables.net/reference/option/
  // https://cdn.datatables.net/
  var dataTable = $("#placeholder table").DataTable({
    ordering: false,
    paging: false,
    searching: false,
    info: false,
    fixedHeader: true,
    fixedColumns: true,
    scrollY: "300px",
  	scrollX: true,
  	
  });
  
  // https://datatables.net/examples/api/highlight.html
  $('#placeholder table tbody')
    .on( 'mouseenter', 'td', function () {
        var colIdx = dataTable.cell(this).index().column;
  
        $( dataTable.cells().nodes() ).removeClass( 'highlight' );
        $( dataTable.column( colIdx ).nodes() ).addClass( 'highlight' );
    })
    .on( 'mouseleave', function () {
        $( dataTable.cells().nodes() ).removeClass( 'highlight' );
    });
  
  return dataTable

}

function BuildSlider(pace_sec) {
  var defaultMax = 120;
  var defaultDelta = 10;
  
  var pace_floor = pace_sec - defaultMax;
  var pace_ceil = pace_sec + defaultMax;
  var pace_start = pace_sec - defaultDelta;
  var pace_end = pace_sec + defaultDelta;
  
  
  $("#slider-value-max").html(DateMath.secondsToTimeSpan(pace_ceil));
  //$("#slider-value-start").html(DateMath.secondsToTimeSpan(pace_start));
  //$("#slider-value-avg").html(DateMath.secondsToTimeSpan(pace_sec));
  //$("#slider-value-end").html(DateMath.secondsToTimeSpan(pace_end));
  $("#slider-value-min").html(DateMath.secondsToTimeSpan(pace_floor));
  
  
  
  // incremenets of integers
  
  var slider = document.getElementById('slider');
  
  if (slider.noUiSlider) {
    slider.noUiSlider.destroy()
  }

  noUiSlider.create(slider, {
  	start: [pace_start, pace_end],
  	connect: true,
  	range: {
  		'min': pace_floor,
  		'max': pace_ceil
    },
  	direction: 'rtl',
  	margin: defaultDelta,
  	tooltips: true,
  	//step: 1,
  	//pips: {
  	//	mode: 'range',
  	//	density: 2
  	//},
  	format: {
  	  to: function ( value ) {
  		  return DateMath.secondsToTimeSpan(value)
  	  },
  	  from: function ( value ) {
  		  return  DateMath.timespanToSeconds(value);
  	  }
  	}
  });
  
  // on change, update text, mirror finish
  // respond to change in pace input
  slider.noUiSlider.on('update', function ( values, handle ) {
    
    var start_span = values[0]
    var end_span = values[1]
    var start_sec = DateMath.timespanToSeconds(start_span)
    var end_sec = DateMath.timespanToSeconds(end_span)
    var avg_sec = (start_sec + end_sec) / 2
    var avg_span = DateMath.secondsToTimeSpan(avg_sec)

    //$("#slider-value-avg").html(avg_span);
    //$("#slider-value-start").html(values[1])
    //$("#slider-value-end").html(values[0])

  });
  
  // on change, update text, mirror finish
  // respond to change in pace input
  slider.noUiSlider.on('change', function ( values, handle ) {
    
    var pace_span = values[handle]
    var cur_value = DateMath.timespanToSeconds(pace_span)
    var max = slider.noUiSlider.options.range.max
    var min = slider.noUiSlider.options.range.min
    
    // Set the upper handle,
    // don't change the lower one.
    var cur_distance,opp_value, handleValues
    if (handle == 0) {
      // handle zero -> start -> lower # -> right side
      cur_distance = cur_value - min
      opp_value = max - cur_distance
      handleValues = [null, opp_value]
    } else {
      cur_distance = max - cur_value
      opp_value = min + cur_distance
      handleValues = [opp_value, null]
    }
    var half_distance = (cur_value - opp_value) / 2
    var avg =  (cur_value + opp_value) / 2
    
    // https://refreshless.com/nouislider/more/#section-update
    slider.noUiSlider.updateOptions({
  		margin:half_distance
  	});
    
    // https://refreshless.com/nouislider/slider-read-write/#section-setting
    slider.noUiSlider.set(handleValues);
    
    // update pace charts
    PaceStrategy.Build(pace_sec, half_distance * 2)
  });
  
}

function highlightAndScrollToRow(pace_sec, updateScroll) {
  // find row index
  var tableData = dataTable.rows().data()
  var index = 0
  for (i = 0; i < tableData.length; i++) {
    var row_pace_span = tableData[i][0];
    var row_pace_sec = DateMath.timespanToSeconds(row_pace_span)
    if (row_pace_sec >= pace_sec) {
      index = i
      break;
    }
  }

  // https://datatables.net/reference/api/row().select()
  dataTable.rows().deselect();
  dataTable.row(index).select();
  
  if (updateScroll) {
    //https://stackoverflow.com/a/35469812/1366033
    var row_select = $("#placeholder tbody tr").eq(Math.max(index - 5,0))
    $(".dataTables_scrollBody").scrollTo(row_select);
  }
 

}
