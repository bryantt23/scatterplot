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
  rangeOfYears;

async function getData() {
  const data = await fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
  );
  dataset = await data.json();
  // console.log(dataset);
  dataset.forEach(element => {
    startDate = Math.min(startDate, element['Year']);
    endDate = Math.max(endDate, element['Year']);
    // const [hr, min] = element['Time'].split(':');
    // console.log(hr, min);
    // console.log(element['Seconds']);
    // const date = new Date(null);
    // console.log(date);
    // date.setHours(hr);
    // date.setMinutes(min);

    startTime = Math.min(startTime, element['Seconds']);
    endTime = Math.max(endTime, element['Seconds']);
  });
  rangeOfYears = endDate - startDate;
  const n = dataset.length;
  // startDate = dataset[0][0];
  // endDate = dataset[n - 1][0];
  yScale = h / endTime;
  console.log('yScale', yScale);
  xScale = w / rangeOfYears;
  // console.log(new Date(startTime).getMinutes());
  // console.log(new Date(endTime));
  console.log(startTime, endTime);

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
    .attr('class', 'dot')
    .attr('data-xvalue', (d, i) => {
      return d['Year'];
    })
    .attr('data-yvalue', (d, i) => {
      // console.log(d);
      // console.log(typeof d['Time']);
      // console.log(new Date(d['Time']));
      const [min, sec] = d['Time'].split(':');
      // console.log(hr, min);

      const d1 = new Date(null),
        d2 = new Date(d1);
      d2.setMinutes(d1.getMinutes() + min);
      d2.setSeconds(d2.getSeconds() + sec);
      // alert(dsec);

      // return new Date(Number(d['Time']));
      return d2;
    })

    .attr('cx', function (d, i) {
      // console.log(d, i);
      const num = (d['Year'] - startDate) * xScale;
      // debugger;
      // console.log(num);

      return num;
    })
    .attr('cy', function (d) {
      // console.log(d['Seconds']);
      const num = (endTime - d['Seconds']) * yScale;
      console.log(num);
      return '500';
    })
    .attr('r', 5)
    .style('fill', '#69b3a2');
  // .attr('width', 200)
  // .attr('height', 200);
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
    .range([0, w]);

  const xAxis = d3.axisBottom().scale(xAxisScale);
  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(${0}, 0)`)
    .call(xAxis);

  const yAxisScale = d3
    .scaleLinear()
    .domain([startTime, endTime])
    .range([h, 0]);

  const yAxis = d3.axisLeft().scale(yAxisScale);
  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${w}, 0)`)
    .call(yAxis);
}
