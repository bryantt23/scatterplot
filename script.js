let dataset = [];
const padding = 60;
let w = 500,
  h = 500,
  xScale = 1,
  yScale = 1,
  startDate = 10000,
  endDate = 0,
  rangeOfYears;

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
  rangeOfYears = endDate - startDate;
  const n = dataset.length;
  // startDate = dataset[0][0];
  // endDate = dataset[n - 1][0];
  yScale = h / (endDate - startDate);

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
    .attr('data-xvalue', (d, i) => {
      return d['Year'];
    })
    .attr('data-yvalue', (d, i) => {
      console.log(d);
      return new Date(d['Time']);
    })

    .attr('cx', function (d, i) {
      console.log(d, i);
      const num = (endDate - d['Year']) * yScale;
      // debugger;
      console.log(num);

      return num;
    })
    .attr('cy', function (d) {
      return 20;
    })
    .attr('r', 1.5)
    .style('fill', '#69b3a2')
    .attr('width', 20)
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

  const xAxisScale = d3
    .scaleTime()
    .domain([new Date(startDate + ''), new Date(endDate + '')])
    .range([0, h]);

  const xAxis = d3.axisBottom().scale(xAxisScale);
  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(${0}, 0)`)
    .call(xAxis);
}
