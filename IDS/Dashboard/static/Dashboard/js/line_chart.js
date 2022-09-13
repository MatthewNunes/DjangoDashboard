function parseDatasetTime(data) {
  const parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
  data.forEach((item, i) => {
    item.Timestamp = parseTime(item.Timestamp)
  });
}

function drawBrushLineChart(data, var_to_display, id_val){
  // set the dimensions and margins of the graph
  const margin = {top: 15, right: 30, bottom: 30, left: 60},
      width = 360 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select(".diagram")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            `translate(${margin.left}, ${margin.top})`);


  svg.append("text")
    .attr("x", width/2)
    .attr("y", -5)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text(var_to_display);


  // Add X axis --> it is a date format
  const x = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.Timestamp; }))
    .range([ 0, width ]);
  xAxis = svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr("class", "x-axis-"+id_val)
    .call(d3.axisBottom(x)
        .ticks(5));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d[var_to_display]; }))
    .range([ height, 0 ]);
  yAxis = svg.append("g")
    .call(d3.axisLeft(y));

  // Add a clipPath: everything out of this area won't be drawn.
  const clip = svg.append("defs").append("svg:clipPath")
      .attr("id", "clip" + id_val)
      .append("svg:rect")
      .attr("width", width )
      .attr("height", height )
      .attr("x", 0)
      .attr("y", 0);

  // Add brushing
  const brush = d3.brushX()                   // Add the brush feature using the d3.brush function
      .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

  // Create the line variable: where both the line and the brush take place
  const line = svg.append('g')
    .attr("clip-path", "url(#clip" + id_val+ ")")

  // Add the line
  line.append("path")
    .datum(data)
    .attr("class", "line")  // I add the class line to be able to modify this line later on.
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.Timestamp) })
      .y(function(d) { return y(d[var_to_display]) })
      )

  // Add the brushing
  line
    .append("g")
      .attr("class", "brush")
      .call(brush);

  // A function that set idleTimeOut to null
  let idleTimeout
  function idled() { idleTimeout = null; }

  // A function that update the chart for given boundaries
  function updateChart(event,d) {
    console.log(event);
    console.log(d);
    // What are the selected boundaries?
    extent = event.selection

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if(!extent){
      if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
      x.domain([ 4,8]);

    }else{
      x.domain([ x.invert(extent[0]), x.invert(extent[1]) ]);
      line.select(".brush").call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
    }
    var newX = d3.select(".x-axis-"+id_val);
    // Update axis and line position
    newX.transition().duration(1000).call(d3.axisBottom(x).ticks(5));
    line
        .select('.line')
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .x(function(d) { return x(d.Timestamp) })
          .y(function(d) { return y(d[var_to_display]) })
        );
  }

  // If user double click, reinitialize the chart
  svg.on("dblclick",function(){
    x.domain(d3.extent(data, function(d) { return d.Timestamp; }));
    var newX = d3.select(".x-axis-"+id_val);
    newX.transition().call(d3.axisBottom(x).ticks(5))
    line
      .select('.line')
      .transition()
      .attr("d", d3.line()
        .x(function(d) { return x(d.Timestamp) })
        .y(function(d) { return y(d[var_to_display]) })
    )
  });

}
