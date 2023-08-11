let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
let xmlhttp = new XMLHttpRequest();

let data 
let values

let xAxisScale
let yAxisScale

let width = 940
let height = 520
let padding = 48

let svg = d3.select('svg')

let generateScale = () => {
  xAxisScale = d3.scaleLinear()
  .domain([d3.min(values, (item) => { return item.Year }) - 1, d3.max(values, (item) => { return item.Year }) + 1])
  .range([padding, width-padding])
  
  yAxisScale = d3.scaleTime()
  .domain([d3.max(values, (item) => { return new Date(item.Seconds * 1000) }), d3.min(values, (item) => { return new Date(item.Seconds * 1000) })])
  .range([height - padding, padding])
}

let drawCanvas = () => {
  svg.attr('width', width);
  svg.attr('height' , height)
}

let drawAxis = () => {
  let xAxis = d3.axisBottom(xAxisScale)
  .tickFormat(d3.format('d'))

  let yAxis = d3.axisLeft(yAxisScale)
  .tickFormat(d3.timeFormat('%M:%S'))
  
  svg.append('g')
  .call(xAxis)
  .attr('id', 'x-axis' )
  .attr('transform', 'translate(0, ' + (height-padding) + ')')

  svg.append('g')
  .call(yAxis)
  .attr('id', 'y-axis')
  .attr('transform', 'translate(' + padding + ', 0)' )

  svg.append('text')
  .attr('x', -(padding*3) + (padding/2))
  .attr('y', padding + (padding/2))
  .style('text-anchor', 'middle')
  .style('font-size', '16px')
  .attr('font-family', 'segoe')
  .attr('transform', 'rotate(-90)')
  .text('Time in minutes')
}

let drawDots = () => {
  let tooltip = d3.select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style('visibility', 'hidden')
  .style('position', 'absolute')
  .style('width', 'auto')
  .style('height', 'auto')
  .style('box-shadow', '2px 2px 4px rgba(0, 0, 0, 0.8)')
  .style('border-radius', '2.5px')
  .style('padding', '6px')
  .style('text-align', 'left')
  .style('font-size', '14px')
  .attr('font-family', 'segoe')

  svg.selectAll("circle")
  .data(values)
  .enter()
  .append('circle')
  .attr('class', 'dot')
  .attr('data-xvalue', (item) => { return item['Year'] })
  .attr('data-yvalue', (item) => { return new Date(item['Seconds'] * 1000) })
  .attr('cx', (item) => { return xAxisScale(item['Year']) })
  .attr('cy', (item) => { return yAxisScale(new Date(item['Seconds'] * 1000)) })
  .attr('r', 7)
  .attr('fill', (item) => {
    if (item['Doping'] !== "") {
      return "rgba(220, 20, 60, 0.6)";
    } else {
      return "rgba(50, 205, 50, 0.6)";
    }
  })
  .attr("stroke", "black")
  .attr("stroke-width", 1)
  .on('mouseover', (event, item) => {
    tooltip.transition()
    .style('visibility', 'visible')
    
    tooltip.data(values)
    .attr('data-year', item.Year)
    .html(`${item.Name}: ${item.Nationality} <br> Year: ${item.Year} Time: ${item.Time} <br> <br> ${item.Doping}`)
    .style('left', (event.clientX + 16) + 'px')
    .style('top', (event.clientY) + 'px')
    .style('background', (item) => {
      if (item.Doping !== "") {
        return "rgba(220, 20, 60, 0.8)";
      } else {
        return "rgba(50, 205, 50, 0.8)";
      }
    })

    d3.select(event.currentTarget)
    .attr('class', (item) => {
      if (item.Doping !== "") {
        return "circle-doped hover";
      } else {
        return "circle-clean hover";
      }
    })

  })
  .on('mouseout', (event, item) => {
    tooltip.transition()
    .style('visibility', 'hidden');
    
    d3.select(event.currentTarget)
    .attr('class', (item) => {
      if (item.Doping !== "") {
        return "circle-doped";
      } else {
        return "circle-clean";
      }
    });
  })
}

xmlhttp.open ('GET', url, true);
xmlhttp.onload = () => {
  data = JSON.parse(xmlhttp.responseText)
  values = data
  generateScale()
  drawCanvas()
  drawAxis()
  drawDots()
}
xmlhttp.send();
