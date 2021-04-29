let dataset = [];
const padding = 60;
let w = 500,
  h = 500,
  xScale = 1,
  yScale = 1,
  startDate,
  endDate;

// const d = document.querySelector('#test-suite-selector');

async function getData() {
  const data = await fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
  );
  const res = await data.json();
  console.log(res);
  const n = res.length;

  loadPage();
}

getData();

function loadPage() {}
