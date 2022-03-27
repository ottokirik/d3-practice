import * as d3 from 'd3';

const data = [10, 68, 19, 90, 60, 10, 25, 5, 57, 71, 9, 8];
const chartArea = d3.select('#chart-area');

const canvas = chartArea
  .append('svg')
  .attr('width', '100%')
  .attr('height', '100vh');

const circles = canvas.selectAll('circle').data(data);

canvas
  .append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', '100%')
  .attr('height', '100vh')
  .attr('fill', '#08f7ee');

canvas
  .append('circle')
  .attr('cx', '60%')
  .attr('cy', '50vh')
  .attr('r', 250)
  .attr('fill', '#fff500');

circles
  .enter()
  .append('circle')
  .attr('cx', (d, i) => i * 100 + 50)
  .attr('cy', '50vh')
  .attr('r', (d) => d)
  .attr('fill', '#fff');
