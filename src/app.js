import * as d3 from 'd3';

const start = async () => {
  const MARGIN = { TOP: 25, RIGHT: 10, BOTTOM: 200, LEFT: 100 };
  const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT;
  const HEIGHT = 800 - MARGIN.TOP - MARGIN.BOTTOM;

  // ФАЙЛ ИЗ SRC/DATA НАДО СКОПИРОВАТЬ В DIST
  const buildingsData = await d3.csv('./buildings.csv');

  buildingsData.forEach((building) => {
    building.height = Number(building.height);
  });

  const buildingsNames = buildingsData.map((building) => building.name);
  const max = d3.max(buildingsData, (d) => d.height);

  const colors = d3.schemeSet3;
  const colorsMap = d3.scaleOrdinal().domain(buildingsNames).range(colors);

  const x = d3
    .scaleBand()
    .domain(buildingsNames)
    .range([0, WIDTH])
    .paddingInner(0)
    .paddingOuter(0.5);

  const y = d3.scaleLinear().domain([0, max]).range([HEIGHT, 0]);

  const xAxisCall = d3.axisBottom(x);
  const yAxisCall = d3.axisLeft(y).tickFormat((d) => `${d} m`);

  const svg = d3
    .select('#chart-area')
    .append('svg')
    .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

  const g = svg
    .append('g')
    .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

  const xAxisGroup = g
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${HEIGHT})`);

  const yAxisGroup = g.append('g').attr('class', 'y-axis');

  g.append('text')
    .attr('class', 'x-axis-label')
    .attr('x', WIDTH / 2)
    .attr('y', HEIGHT + 110)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .text("The world's tallest buildings");

  g.append('text')
    .attr('class', 'x-axis-label')
    .attr('x', -HEIGHT / 2)
    .attr('y', -60)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Height (m)');

  const update = (data) => {
    // ОСЬ X
    xAxisGroup
      .call(xAxisCall)
      .selectAll('text')
      .attr('y', '10')
      .attr('x', '-5')
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-30)');

    // ОСЬ Y
    yAxisGroup.call(yAxisCall);

    const rects = g.selectAll('rects').data(data);

    // УДАЛИТЬ ВСЕ СТАРЫЕ ЭЛЕМЕНТЫ С ЭКРАНА
    rects.exit().remove();

    // ОБНОВИТЬ НУЖНЫЕ АТРИБУТЫ
    rects
      .attr('x', (d) => x(d.name))
      .attr('y', (d) => y(d.height))
      .attr('width', x.bandwidth)
      .attr('height', (d) => HEIGHT - y(d.height))
      .text((d) => d.name);

    // ВЫВЕСТИ НА ЭКРАН
    rects
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.name))
      .attr('y', (d) => y(d.height))
      .attr('width', x.bandwidth)
      .attr('height', (d) => HEIGHT - y(d.height))
      .text((d) => d.name)
      .attr('fill', (d) => colorsMap(d.name));
  };

  update(buildingsData);
};

start();
