import * as d3 from 'd3';

const MARGIN = { TOP: 25, RIGHT: 10, BOTTOM: 150, LEFT: 100 };
const WIDTH = 1000 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

const initCanvas = () => {
  return d3
    .select('#chart-area')
    .append('svg')
    .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
    .append('g')
    .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);
};

const start = async () => {
  // ФАЙЛ ИЗ SRC/DATA НАДО СКОПИРОВАТЬ В DIST
  const data = await d3.json('data.json');
  const beginYear = 1800;

  const formattedData = data.map((year) =>
    year.countries.filter((country) => country.income && country.life_exp)
  );

  const canvas = initCanvas();

  const maxExp = d3.max(data, (d) => d3.max(d.countries, (c) => c.life_exp));
  const maxGDP = d3.max(data, (d) => d3.max(d.countries, (c) => c.income));
  const populationMax = d3.max(data, (d) =>
    d3.max(d.countries, (c) => c.population)
  );

  const y = d3.scaleLinear().domain([0, maxExp]).range([HEIGHT, 0]);
  const x = d3.scaleLog().domain([100, maxGDP]).range([0, WIDTH]).base(10);
  const area = d3
    .scaleLinear()
    .domain([1000, populationMax])
    .range([Math.PI * 25, Math.PI * 1500]);

  const xAxisCall = d3
    .axisBottom(x)
    .tickFormat(d3.format('$'))
    .tickValues([400, 4000, 40000]);

  const xAxisGroup = canvas
    .append('g')
    .attr('transform', `translate(0, ${HEIGHT})`);

  const yAxisCall = d3.axisLeft(y);
  const yAxisGroup = canvas.append('g');

  xAxisGroup.call(xAxisCall);
  yAxisGroup.call(yAxisCall);

  const colors = d3.schemePaired;
  const countries = data[0].countries.map((item) => item.country);
  const countriesColorsMap = d3.scaleOrdinal().domain(countries).range(colors);

  canvas
    .append('text')
    .attr('x', -HEIGHT / 2)
    .attr('y', -60)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Продолжительность жизни');

  canvas
    .append('text')
    .attr('x', WIDTH / 2)
    .attr('y', HEIGHT + 110)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .text('ВВП на душу населения');

  const timeLabel = canvas
    .append('text')
    .attr('y', HEIGHT - 10)
    .attr('x', WIDTH - 40)
    .attr('font-size', '40px')
    .attr('opacity', '0.4')
    .attr('text-anchor', 'middle')
    .text(beginYear);

  let time = 0;

  const update = (data) => {
    const t = d3.transition().duration(100);
    const circles = canvas.selectAll('circle').data(data, (d) => d.country); // ЕСЛИ МАССИВ ОБЪЕКТОВ, ТО ПОЗВОЛЯЕТ ВЕРНУТЬ КЛЮЧ ПО КОТОРОМУ СРАВНИВАТЬ

    circles.exit().remove(); // УДАЛИТЬ ТЕКУЩУЮ ВЫБОРКУ С ПОЛОТНА

    // ОБНОВЛЕНИЕ И ДОБАВЛЕНИЕ НА ПОЛОТНО
    circles
      .enter()
      .append('circle')
      .attr('fill', (d) => countriesColorsMap(d.country))
      .merge(circles) // МЕТОД MERGE ПОЗВОЛЯЕТ ОБНОВИТЬ ЗНАЧЕНИЯ И СРАЗУ ДОБАВИТЬ ИХ НА ПОЛОТНО
      .transition(t)
      .attr('cx', (d) => x(d.income))
      .attr('cy', (d) => y(d.life_exp))
      .attr('r', (d) => Math.sqrt(area(d.population) / Math.PI));

    timeLabel.text(String(time + beginYear));
  };

  update(formattedData[0]);

  d3.interval(() => {
    time = time < 214 ? time + 1 : 0;
    update(formattedData[time]);
  }, 100);
};

const startBtn = document.getElementById('start');

startBtn.addEventListener('click', () => setTimeout(() => start(), 250));
