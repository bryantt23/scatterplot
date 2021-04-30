let dataset = [];
const padding = 60;
let w = 500 - padding,
  h = 500 - padding,
  xScale = 1,
  yScale = 1,
  startDate = 10000,
  endDate = 0;

async function getData() {
  const data = await fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
  );
  dataset = await data.json();
  console.log(dataset);
  dataset.forEach(element => {
    startDate = Math.min(startDate, element['Year']);
    endDate = Math.max(endDate, element['Year']);
  });
  console.log(startDate, endDate);
  console.log(new Date(startDate + ''));
  const n = dataset.length;
  // startDate = dataset[0][0];
  // endDate = dataset[n - 1][0];
  xScale = w / dataset.length;

  loadPage();
}

getData();

function loadPage() {
  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
    .attr('id', 'title');

  svg
    .selectAll('dot')
    .data(dataset)
    .enter()
    .append('circle')

    .attr('cx', function (d) {
      // console.log(d);
      return d['Year'] * xScale;
    })
    .attr('cy', function (d) {
      return 10;
    })
    .attr('r', 1.5)
    .style('fill', '#69b3a2')
    .attr('width', xScale)
    .attr('height', 20);
  // .attr('class', 'bar')
  // .style('opacity', 0.5)
  // .attr('x', (d, i) => {
  //   console.log(d);
  //   return 5;
  //   // return i * xScale;
  // })
  // .attr('y', (d, i) => {
  //   return h - 10;
  //   // return h - d[1] * yScale;
  // })
  // .attr('width', xScale)
  // .attr('height', (d, i) => d[1] * yScale);

  const yAxisScale = d3
    .scaleTime()
    .domain([new Date(startDate + ''), new Date(endDate + '')])
    .range([0, h]);

  const yAxis = d3.axisLeft().scale(yAxisScale);
  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis);
}
