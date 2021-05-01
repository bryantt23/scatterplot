let dataset = [];
const padding = 60;
let w = 500,
  h = 500,
  xScale = 1,
  yScale = 1,
  startDate = 10000,
  endDate = 0,
  startTime = new Date(),
  endTime = new Date(null),
  rangeOfYears,
  rangeOfTime;

const timeFormat = d3.timeFormat('%M:%S');
const keys = ['No doping allegations', 'Riders with doping allegations'];
const size = 20;

const color = d3.scaleOrdinal().domain(keys).range(['green', 'red']);

async function getData() {
  const data = await fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
  );
  dataset = await data.json();

  //convert seconds to date
  dataset = dataset.map(d => {
    d.Seconds = new Date(d.Seconds * 1000);
    return d;
  });

  dataset.forEach(element => {
    startDate = Math.min(startDate, element['Year']);
    endDate = Math.max(endDate, element['Year']);
    startTime = Math.min(startTime, element['Seconds']);
    endTime = Math.max(endTime, element['Seconds']);
  });
  rangeOfYears = endDate - startDate;
  rangeOfTime = endTime - startTime;

  xScale = w / rangeOfYears;

  loadPage();
}

getData();

function loadPage() {
  d3.select('body')
    .append('div')
    .attr('id', 'tooltip')
    .attr('style', 'position:absolute; visibility:hidden')
    .attr('width', w)
    .attr('height', h)
    .on('mousemove', () => {
      d3.select('#tooltip');
    });

  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
    .attr('id', 'title');

  svg
    .selectAll('mydots')
    .data(keys)
    .enter()
    .append('rect')
    .attr('x', 100)
    .attr('y', (d, i) => {
      return 100 + i * (size + 5);
    })
    .attr('width', size)
    .attr('height', size)
    .style('fill', d => color(d));

  svg
    .selectAll('mylabels')
    .data(keys)
    .enter()
    .append('text')
    .attr('id', 'legend')
    .attr('x', 100 + size * 1.2)
    .attr('y', function (d, i) {
      return 100 + i * (size + 5) + size / 2;
    })
    .style('fill', function (d) {
      return color(d);
    })
    .text(function (d) {
      return d;
    })
    .attr('text-anchor', 'left')
    .style('alignment-baseline', 'middle');

  const xAxisScale = d3
    .scaleTime()
    .domain([new Date(startDate + ''), new Date(endDate + '')])
    .range([0, w]);

  const xAxis = d3.axisTop().scale(xAxisScale);
  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${h})`)
    .call(xAxis);

  const yAxisScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, d => d.Seconds))
    .range([0, h]);

  const yAxis = d3.axisRight(yAxisScale).tickFormat(timeFormat);

  svg
    .append('div')
    .attr('id', 'tooltip')
    .attr('style', 'position: absolute; visibilty:hidden')
    .attr('width', w)
    .attr('height', h)
    .on('mousemove', () => {
      d3.select('#tooltip');
    });

  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(0, 0)`)
    .call(yAxis);

  svg
    .selectAll('dot')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('data-xvalue', (d, i) => {
      return d['Year'];
    })
    .attr('data-yvalue', (d, i) => {
      return d.Seconds;
    })
    .attr('cx', function (d) {
      const num = (d['Year'] - startDate) * xScale;
      return num;
    })
    .attr('cy', function (d, i) {
      return yAxisScale(d.Seconds);
    })
    .attr('r', 5)
    .style('fill', (d, i) => {
      if (d.Doping.length === 0) {
        return 'green';
      }
      return 'red';
    })
    .on('mouseover', (d, i) => {
      const x = d.clientX,
        y = d.clientY;

      d3
        .select('#tooltip')
        .style('top', y - 10 + 'px')
        .style('left', x + 'px')
        .style('visibility', 'visible')
        .style('background-color', 'yellow')
        .attr('data-year', `${i['Year']}`).html(`        
        ${i.Name}: ${i.Nationality} </br>
        Year: ${i.Year}, Time: ${i.Time}</br>
        ${i.Doping}
      `);
    })
    .on('mouseout', () => {
      d3.select('#tooltip')
        .style('visibility', 'hidden')
        .attr('data-date', null);
    });
}

function getDateFromTime(time) {
  const [min, sec] = time;
  const d1 = new Date(null),
    d2 = new Date(d1);
  d2.setMinutes(d1.getMinutes() + min);
  d2.setSeconds(d2.getSeconds() + sec);
  return d2;
}
