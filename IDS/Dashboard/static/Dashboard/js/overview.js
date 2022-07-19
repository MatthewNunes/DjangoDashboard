function loadSwatData(dataset, dst_nums, src_nums, ip_address_map) {
  // for (const key of Object.keys(dataset["StartTime"])) {
  //   let oldDate = dataset["StartTime"][key];
  //   dataset["StartTime"][key] = new Date(oldDate.split("-")[2].split(" ")[0], oldDate.split("-")[1], oldDate.split("-")[0], oldDate.split(" ")[1].split(":")[0], oldDate.split(" ")[1].split(":")[1], oldDate.split(" ")[1].split(":")[2].split(".")[0]);
  // }
  // for (const key of Object.keys(dataset["LastTime"])) {
  //   let oldDate = dataset["LastTime"][key];
  //   dataset["LastTime"][key] =  new Date(oldDate.split("-")[2].split(" ")[0], oldDate.split("-")[1], oldDate.split("-")[0], oldDate.split(" ")[1].split(":")[0], oldDate.split(" ")[1].split(":")[1], oldDate.split(" ")[1].split(":")[2].split(".")[0]);
  // }

  dataset.forEach(function(row, index) {
     row["StartTime"] = new Date(row["StartTime"].split("-")[2].split(" ")[0], row["StartTime"].split("-")[1], row["StartTime"].split("-")[0], row["StartTime"].split(" ")[1].split(":")[0], row["StartTime"].split(" ")[1].split(":")[1], row["StartTime"].split(" ")[1].split(":")[2].split(".")[0]);
     row["LastTime"] = new Date(row["LastTime"].split("-")[2].split(" ")[0], row["LastTime"].split("-")[1], row["LastTime"].split("-")[0], row["LastTime"].split(" ")[1].split(":")[0], row["LastTime"].split(" ")[1].split(":")[1], row["LastTime"].split(" ")[1].split(":")[2].split(".")[0]);
    // row["Trans"] = parseInt(row["Trans"]);
    // row["RunTime"] = parseFloat(row["RunTime"]);
    // row["IdleTime"] = parseFloat(row["IdleTime"]);
    // row["Mean"] = parseFloat(row["Mean"]);
    // row["StdDev"] = parseFloat(row["StdDev"]);
    // row["Sum"] = parseFloat(row["Sum"]);
    // row["Min"] = parseFloat(row["Min"]);
    // row["Max"] = parseFloat(row["Max"]);
    // row["SrcAddr"] = parseInt(row["SrcAddr"]);
    // row["DstAddr"] = parseInt(row["DstAddr"]);
    // row["Proto"] = parseInt(row["Proto"]);
    // row["Sport"] = parseInt(row["Sport"]);
    // row["Dport"] = parseInt(row["Dport"]);
    // row["sTos"] = parseFloat(row["sTos"]);
    // row["sDSb"] = parseFloat(row["sDSb"]);
    // row["sTtl"] = parseFloat(row["sTtl"]);
    // row["sHops"] = parseFloat(row["sHops"]);
    // row["TotPkts"] = parseInt(row["TotPkts"]);
    // row["SrcPkts"] = parseInt(row["SrcPkts"]);
    // row["DstPkts"] = parseInt(row["DstPkts"]);
    // row["TotBytes"] = parseInt(row["TotBytes"]);
    // row["SrcBytes"] = parseInt(row["SrcBytes"]);
    // row["DstBytes"] = parseInt(row["DstBytes"]);
    // row["Load"] = parseFloat(row["Load"]);
    // row["SrcLoad"] = parseFloat(row["SrcLoad"]);
    // row["DstLoad"] = parseFloat(row["DstLoad"]);
    // row["Loss"] = parseInt(row["Loss"]);
    // row["SrcLoss"] = parseInt(row["SrcLoss"]);
    // row["DstLoss"] = parseInt(row["DstLoss"]);
    // row["pLoss"] = parseFloat(row["pLoss"]);
    // row["Rate"] = parseFloat(row["Rate"]);
    // row["SrcRate"] = parseFloat(row["SrcRate"]);
    // row["DstRate"] = parseFloat(row["DstRate"]);
    // row["Dir"] = parseInt(row["Dir"]);
    // row["TcpRtt"] = parseFloat(row["TcpRtt"]);
    // row["SynAck"] = parseFloat(row["SynAck"]);
    // row["AckDat"] = parseFloat(row["AckDat"]);
    // row["sMeanPktSz"] = parseFloat(row["sMeanPktSz"]);
    // row["dMeanPktSz"] = parseFloat(row["dMeanPktSz"]);
    // row["Flg-e"] = parseInt(row["Flg-e"]);
    // row["Flg-g"] = parseInt(row["Flg-g"]);
    // row["Flg-r"] = parseInt(row["Flg-r"]);
    // row["Flg-d"] = parseInt(row["Flg-d"]);
    // row["Flg-i"] = parseInt(row["Flg-i"]);
    // row["Flg-s"] = parseInt(row["Flg-s"]);
    // row["Flg-U"] = parseInt(row["Flg-U"]);
    // row["Flg-&"] = parseInt(row["Flg-&"]);
    // row["Flg-*"] = parseInt(row["Flg-*"]);
    // row["Flg-*2"] = parseInt(row["Flg-*2"]);
    // row["Start"] = parseInt(row["Start"]);
    // row["Status"] = parseInt(row["Status"]);
    // row["CON"] = parseInt(row["CON"]);
    // row["ECO"] = parseInt(row["ECO"]);
    // row["FIN"] = parseInt(row["FIN"]);
    // row["INT"] = parseInt(row["INT"]);
    // row["REQ"] = parseInt(row["REQ"]);
    // row["RST"] = parseInt(row["RST"]);
    // row["URN"] = parseInt(row["URN"]);
    // row["URP"] = parseInt(row["URP"]);
    // row["Classification"] = parseInt(row["Classification"]);
   });
  //const ip_address_map = await d3.json("../resources/SWaT/unique_vals_ips_reversed_SWAT.json");
  //const src_num = await d3.json("../resources/SWaT/2017_SWAT_src_ips.json");
  //const dst_num = await d3.json("../resources/SWaT/2017_SWAT_dst_ips.json");
  const src_addresses = src_nums.map(d => ip_address_map[d]);
  const dst_addresses = dst_nums.map(d => ip_address_map[d]);
  drawScatter(dataset, ip_address_map, src_addresses, dst_addresses);
}


function drawScatter(data, ip_address_map, src_addresses, dst_addresses) {

  const margin = {top: 20, right: 20, bottom: 90, left: 10};
  const width = 1060 - margin.left - margin.right,
  height = 800 - margin.top - margin.bottom;

  let div = d3.select("body")
    .append("div")
      .attr("class", "tooltip");

  const svg = d3.select(".main_area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    //.attr("viewBox", [0, 0, width, height])
    //.attr("style", "max-width: 100%; height: auto; height: intrinsic;");




  var x1Accessor = d => ip_address_map[d.SrcAddr];

  var x2Accessor = d => ip_address_map[d.DstAddr];

  var y1Accessor = d => d.Sport;

  var y2Accessor = d => d.Dport;

  var r1Accessor = d => d.SrcBytes;

  var r2Accessor = d => d.DstBytes;

  var xScale1 = d3.scalePoint()
    .domain(src_addresses);

  var xScale2 = d3.scalePoint()
    .domain(dst_addresses);
    //.paddingInner(0.5);

  const y1Scale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.Sport));

  const y2Scale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Dport));

  const r1Scale = d3.scaleLinear()
          .domain(d3.extent(data, d=>d.SrcBytes))
          .range([5, 15])

  const r2Scale = d3.scaleLinear()
            .domain(d3.extent(data, d=>d.DstBytes))
            .range([5, 15])


  var config1 = {
    top: 10,
    left: 80,
    width: 450,
    height: height,
    dotClassName: "dot1",
    xLabel: "Source IP Address",
    tickSize: 0,
    domainOpacity: 0,
    xAxisOffset: 10,
    yAxisOffset: 10,
    yTicks: null,
    drawingName: "drawingAreaFirst",
    fill: "#ffb4d9"
  };

  var config2 = {
    top: 10,
    left: 600,
    width: 450,
    height: height,
    dotClassName: "dot2",
    xLabel: "Destination IP Address",
    tickSize: 0,
    domainOpacity: 0,
    xAxisOffset: 10,
    yAxisOffset: 10,
    yTicks: 3,
    drawingName: "drawingAreaSecond",
    fill: "#90bcf9"
  };

  // Draws a scatter plot
  var plot1 = scatterPlot(svg, config1, xScale1, y1Scale, r1Scale, x1Accessor, y1Accessor, r1Accessor, src_addresses);

  var plot2 = scatterPlot(svg, config2, xScale2, y2Scale, r2Scale, x2Accessor, y2Accessor, r2Accessor, dst_addresses);

  function scatterPlot(mysvg, cfg, x, y, r, xAcc, yAcc, rAcc, used_addresses) {

      var plot = mysvg.append("g")
      	.attr("class", "scatter-plot")
      	.attr("transform", "translate(" + [cfg.left, cfg.top] + ")");

      // plot.append("g")
      // 	.attr("class", "chart-background")
      // 	.attr("width", cfg.width)
      // 	.attr("height", cfg.height);

			x.range([0, cfg.width]);
      y.range([cfg.height, 0]);

      var xAxis = d3.axisBottom(x)
      	.ticks(used_addresses.length);
        //.tickSize(-cfg.height, 0)
        //.tickFormat("")
        //.orient("top")

      var xAxisGroup = plot.append("g")
      	.attr("transform", "translate(" + [0, cfg.height + cfg.xAxisOffset] + ")")
      	.call(xAxis)
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");

      var xLabel = plot.append("g")
      	.append("text")
      	.attr("class", "axis-label")
      	.attr("text-anchor", "middle")
      	.attr("transform", "translate(" + [cfg.width / 2, cfg.height + 100] +")")
      	.text(cfg.xLabel);

      xAxisGroup.select(".domain").style("opacity", cfg.domainOpacity);

      var yAxis = d3.axisLeft(y.nice());

      var yAxisGroup = plot.append("g")
      	.attr("transform", "translate(" + [-cfg.yAxisOffset, 0] + ")")
      	.call(yAxis);

      yAxisGroup.select(".domain").style("opacity", cfg.domainOpacity);

      plot.append("g")
        .attr("class", cfg.drawingName);

      return plot;

    }

  var newData = data.filter(function(val, index, array) {
    return val.StartTime.getTime() === data[0]["StartTime"].getTime();
  });
  addDots(newData, plot1, config1, xScale1, y1Scale, r1Scale, x1Accessor, y1Accessor, r1Accessor);
  addDots(newData, plot2, config2, xScale2, y2Scale, r1Scale, x2Accessor, y2Accessor, r1Accessor);

  return svg;

}

function addDots(dataset, plot, cfg, x, y, r, xAcc, yAcc, rAcc) {
  //console.log(plot.selectAll(".drawingArea"));
  const t = plot.transition()
        .duration(750);
  plot
    .select("."+cfg.drawingName)
    .selectAll("circle")
    .data(dataset, d => d.StartTime.getTime() + d.SrcAddr + d.Sport + d.Dport + d.DstAddr)
    // .join("circle")
    //     .attr("class", function(d) {
    //       let startTime = d.StartTime.getTime()
    //       return cfg.dotClassName +" _"+ startTime + "_" + d.SrcAddr + "_" + d.Sport +"_" + d.Dport +"_" + d.DstAddr
    //     })
    //     .attr("cx", function(d, i) {
    //       if (Math.random < 0.5) {
    //         return x(xAcc(d)) - (Math.random() * x.step());
    //       } else {
    //         return x(xAcc(d)) + (Math.random() * x.step());
    //       }
    //     })
    //     .attr("cy", d => y(yAcc(d)))
    //     .attr("r", d => 0)
    //     .call(enter => enter.transition(t)
    //           .attr("r", d => r(rAcc(d)))
    //          )
    //     .on("mouseover", function(event, d) {
    //       let startTime = d.StartTime.getTime()
    //       let className = "_" + startTime +"_" + d.SrcAddr +"_" + d.Sport +"_" + d.Dport +"_" + d.DstAddr;
    //       d3.selectAll("circle." + className)
    //         .transition()
    //         .style("stroke-width", 2.5)
    //         .style("stroke", "black");
    //       showLabel(event, d, div);
    //     })
    //     .on("mouseout", function(event, d) {
    //       let startTime = "_" + d.StartTime.getTime()
    //       let className = startTime +"_" + d.SrcAddr +"_" + d.Sport +"_" + d.Dport +"_" + d.DstAddr;
    //       d3.selectAll("circle." + className)
    //         .transition()
    //         .style("stroke-width", 0)
    //         .style("stroke", "none");
    //       hideLabel(div);
    //     })
    .join(
         enter => enter
            .append("circle")
            .attr("class", function(d) {
              let startTime = d.StartTime.getTime()
              return cfg.dotClassName +" _"+ startTime + "_" + d.SrcAddr + "_" + d.Sport +"_" + d.Dport +"_" + d.DstAddr
            })
            .attr("cx", function(d, i) {
              return x(xAcc(d))
              // if (Math.random < 0.5) {
              //   return x(xAcc(d)) - (Math.random() * x.step());
              // } else {
              //   return x(xAcc(d)) + (Math.random() * x.step());
              // }
            })
            .attr("cy", d => y(yAcc(d)))
            .attr("r", 0)
            .call(enter => enter.transition(d3.transition().duration(750))
                      .attr("r", d => r(rAcc(d)))
                      .attr("fill", cfg.fill)
                  )
            .on("mouseover", function(event, d) {
              let startTime = d.StartTime.getTime();
              let className = "_" + startTime +"_" + d.SrcAddr +"_" + d.Sport +"_" + d.Dport +"_" + d.DstAddr;
              d3.selectAll("circle." + className)
                .transition()
                .style("stroke-width", 2.5)
                .style("stroke", "black");
              showLabel(event, d);
            })
            .on("mouseout", function(event, d) {
              let startTime = "_" + d.StartTime.getTime();
              let className = startTime +"_" + d.SrcAddr +"_" + d.Sport +"_" + d.Dport +"_" + d.DstAddr;
              d3.selectAll("circle." + className)
                .transition()
                .style("stroke-width", 0)
                .style("stroke", "none");
              hideLabel();
            }).selection(),
            //.on("mousemove", moveLabel)
       update => update
                .attr("fill","yellow")
                .selection(),
       exit => exit
          .call(exit => exit.transition(d3.transition().duration(750))
              .attr("r", 0)
              .attr("fill", "black")
              .remove()
              )

         )

}

function showLabel(event, d) {
  //console.log(d);
  var coords = [event.pageX, event.pageY];
  var top = coords[1] + 30,
    left = coords[0] - 50;
  let div = d3.select(".tooltip");
  div.html("<b>Source Port: </b>" + d.Sport + "<br />"
          + "<b>Destination Port: </b>" + d.Dport)
    .style("top", top + "px")
    .style("left", left + "px");

  div.transition()
    .duration(200)
    .style("opacity", .9);


}

function hideLabel(div) {
  d3.select(".tooltip")
    .transition()
    .duration(200)
    .style("opacity", 0);
}

function drawTable(dataset, ipaddress_map) {
  // load data
  const table = d3.select(".main_area");

  const numberOfRows= 60

  const columns = [
    //{label: "Start", type: "text", format: d => d["StartTime"]},
    //{label: "Last", type:"text", format: d =>d["LastTime"]},
    {label: "Source", type: "text", format: d => ipaddress_map[d["SrcAddr"]]},
    {label: "Destination", type: "text", format: d => ipaddress_map[d["DstAddr"]]},
    {label: "Protocol", type: "number", format: d => d["Proto"]},
    {label: "S-Port", type: "number", format: d => d["Sport"]},
    {label: "D-Port", type: "number", format: d => d["Dport"]},
    {label: "Trans", type:"number", format: d=>d["Trans"]},
    {label: "Run Time", type:"number", format: d=>d["RunTime"]},
    {label: "Idle Time", type:"number", format: d=>d["IdleTime"]},
    {label: "S-Packets", type: "number", format: d => d["SrcPkts"]},
    {label: "D-Packets", type: "number", format: d => d["DstPkts"]},
    {label: "S-Bytes", type: "number", format: d => d["SrcBytes"]},
    {label: "D-Bytes", type: "number", format: d => d["DstBytes"]},
    {label: "S-Load", type: "number", format: d => d["SrcLoad"]},
    {label: "D-Load", type: "number", format: d => d["DstLoad"]},
    {label: "S-Loss", type: "number", format: d => d["SrcLoss"]},
    {label: "D-Loss", type: "number", format: d => d["DstLoss"]},
    {label: "pLoss", type: "number", format: d => d["pLoss"]},
    {label: "S-Rate", type: "number", format: d => d["SrcRate"]},
    {label: "D-Rate", type: "number", format: d => d["DstRate"]},
    {label: "Dir", type: "number", format: d => d["Dir"]},
    {label: "TCPRtt", type: "number", format: d => d["TcpRtt"]},
    {label: "SynAck", type: "number", format: d => d["SynAck"]},
    {label: "AckDat", type: "number", format: d => d["AckDat"]},
    {label: "sMeanPktSz", type: "number", format: d => d["sMeanPktSz"]},
    {label: "dMeanPktSz", type: "number", format: d => d["dMeanPktSz"]},
    {label: "Flags", type: "number", format: d => d["Flg-e"] + d["Flg-*"] + d["Flg-d"] + d["Flg-g"] + d["Flg-s"] + d["Flg-S"] + d["Flg-D"] + d["Flg-U"] + d["Flg-*2"]},
    {label: "ACC", type: "number", format: d => d["ACC"]},
    {label: "CLO", type: "number", format: d => d["CLO"]},
    {label: "CON", type: "number", format: d => d["CON"]},
    {label: "ECO", type: "number", format: d => d["ECO"]},
    {label: "FIN", type: "number", format: d => d["FIN"]},
    {label: "REQ", type: "number", format: d => d["REQ"]},
    {label: "RST", type: "number", format: d => d["RST"]},
    {label: "URO", type: "number", format: d => d["URO"]},
    {label: "Classification", type: "number", format: d => d["Classification"]},
  ]

  table.append("thead").append("tr")
    .selectAll("thead")
    .data(columns)
    .join("th")
      .text(d => d.label)
      .attr("class", d => d.type)

  const body = table.append("tbody")

  dataset.slice(0, numberOfRows).forEach(d => {
    body.append("tr")
      .selectAll("td")
      .data(columns)
      .join("td")
        .text(column => column.format(d))
        .attr("class", column => column.type)
        .style("background", column => column.background && column.background(d))
        .style("transform", column => column.transform && column.transform(d))
  })
}
