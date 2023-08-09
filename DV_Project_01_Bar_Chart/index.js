let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let xmlhttp = new XMLHttpRequest();

let data 
let values

let heightScale
let widthScale
let xAxisScale
let yAxisScale
let width = 830
let height = 520
let padding = 40

let svg = d3.select('svg')

let generateScale = () => {
  let datesArray = values.map((item) => {
    return new Date(item[0])
  })

  heightScale = d3.scaleLinear()
  .domain([0, d3.max(values, (item) => { return item[1] })])
  .range([0, height - (2*padding)])

   widthScale = d3.scaleLinear()
  .domain([0, values.length-1])
  .range([padding, width-padding ])  

  xAxisScale = d3.scaleTime()
  .domain([d3.min(datesArray), d3.max(datesArray)])
  .range([padding, width-padding])
   
  yAxisScale = d3.scaleLinear()
  .domain([0, d3.max(values, (item) => { return item[1] })])
  .range([height - padding, padding])

}

let drawCanvas = () => {
  svg.attr('width', width);
  svg.attr('height' , height)
}

let drawBars = () => {

  let tooltip = d3.select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style('visibility', 'hidden')
  .style('width', 'auto')
  .style('height', 'auto')

  svg.selectAll('rect')
  .data(values)
  .enter()
  .append('rect')
  .attr('class', 'bar')
  .attr('width', (width - (2*padding)) / values.length)
  .attr('data-date', (item) => { return item[0] })
  .attr('data-gdp', (item) => { return item[1] })
  .attr('height', (item) => { return heightScale(item[1]) })
  .attr('x', (item, index) => { return widthScale(index) })
  .attr('y', (item) => { return (height - padding) - heightScale(item[1]) })
  .on('mouseover', (item) => {         
    tooltip.transition()
    .style('visibility', 'visible')              
    tooltip.text(item[0])
  })

}

let drawAxis = () => {

  let xAxis = d3.axisBottom(xAxisScale);
  let yAxis = d3.axisLeft(yAxisScale)
  
  svg.append('g')
  .call(xAxis)
  .attr('id', 'x-axis' )
  .attr('transform', 'translate(0, ' + (height-padding) + ')')

  svg.append('g')
  .call(yAxis)
  .attr('id', 'y-axis')
  .attr('transform', 'translate(' + padding + ', 0)' )
}

xmlhttp.open ('GET', url, true);
xmlhttp.onload = () => {
   data = JSON.parse(xmlhttp.responseText)
   values = data.data
   generateScale()
   drawCanvas()
   drawBars()
   drawAxis()
}
xmlhttp.send();