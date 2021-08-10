'use strict';

//--------> Code preparation <--------
const imagesArea = document.getElementById('imagesArea');
let firstImage = document.getElementById('firstImage');
let secondImage = document.getElementById('secondImage');
let thirdImage = document.getElementById('thirdImage');
let counterBox = document.getElementById('counterBox');
let button1 = document.getElementById('button1');
let button2 = document.getElementById('button2');
let resultsList = document.getElementById('results');

function genRandomNumber (min, max) {
  return Math.floor( Math.random() * ( max - min + 1 ) + min );
}

let currentRound = 0;
let totalRounds = 25;
let imagesArray = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg',
  'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg',
  'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png',
  'tauntaun.jpg', 'unicorn.jpg', 'water-can.jpg', 'wine-glass.jpg'];

//--------> Constructor function <--------
function ImagesGen (name, imgSrc, displayed=0, clicks=0) {
  this.name = name; // name of the product
  this.imgSrc = imgSrc; // path of the image
  this.displayed = displayed;
  this.clicks = clicks;
  ImagesGen.all.push( this );
}
ImagesGen.all = [];
getData();

//Creating the objects:
// for (let i=0; i<imagesArray.length; i++) {
//   new ImagesGen (imagesArray[i].split('.')[0], `img/${imagesArray[i]}`);
// }

//--------> Rendering function <--------
let firstRandom; let secondRandom; let thirdRandom;
let previousRands = []; let currentRands = [];
function render () {
  previousRands = currentRands;

  do { firstRandom = genRandomNumber(0, imagesArray.length-1);
  }
  while (previousRands.includes(firstRandom));

  currentRands = [firstRandom];

  do {
    secondRandom = genRandomNumber(0, imagesArray.length-1);
  } while (previousRands.includes(secondRandom) || currentRands.includes(secondRandom));

  currentRands = [firstRandom, secondRandom];

  do {
    thirdRandom = genRandomNumber(0, imagesArray.length-1);
  } while (previousRands.includes(thirdRandom) || currentRands.includes(thirdRandom));

  currentRands = [firstRandom, secondRandom, thirdRandom];

  console.log('These are the randoms, current randoms: ' + currentRands + ' previous randoms: ' + previousRands);

  //Appending the random selected image to its area
  firstImage.src = ImagesGen.all[firstRandom].imgSrc;
  secondImage.src = ImagesGen.all[secondRandom].imgSrc;
  thirdImage.src = ImagesGen.all[thirdRandom].imgSrc;

  //Increment the display counter for the chosen objects
  ImagesGen.all[firstRandom].displayed++;
  ImagesGen.all[secondRandom].displayed++;
  ImagesGen.all[thirdRandom].displayed++;

  counterBox.textContent = `${currentRound}`; //Add current round counter

  localStorage.data = JSON.stringify(ImagesGen.all);

}
render();

//--------> Clicking on images event <--------
imagesArea.addEventListener('click', itemPicked);
function itemPicked (e) {
  e.preventDefault();

  //Incrementing the clicks
  if (e.target.id === 'firstImage') {
    ImagesGen.all[firstRandom].clicks++;
  }
  else if (e.target.id === 'secondImage') {
    ImagesGen.all[secondRandom].clicks++;
  }
  else if (e.target.id === 'thirdImage') {
    ImagesGen.all[thirdRandom].clicks++;
  }

  if (currentRound < totalRounds -1 ) {
    currentRound++;
    render();
  }
  else {
    counterBox.textContent = `${currentRound+1}`; //To show the number of the last round since it won't be incremented
    imagesArea.removeEventListener('click', itemPicked);
    button1.removeAttribute('hidden'); //Results button is shown after rounds are finished
    button2.removeAttribute('hidden'); //Reset button is shown after rounds are finished
  }
}

//--------> Results Button <--------
button1.addEventListener('click', showResults);
function showResults (e) {
  e.preventDefault();
  document.getElementById('resultsHeader').textContent = 'Results';
  chartGen(); //to generate the chart
  for (let i=0; i<imagesArray.length; i++) {
    let listItem = document.createElement('li');
    let percentage = Math.floor((ImagesGen.all[i].clicks * ImagesGen.all[i].displayed/totalRounds)*100);
    listItem.textContent = `${ImagesGen.all[i].name} had ${ImagesGen.all[i].clicks} votes, and was seen ${ImagesGen.all[i].displayed} times - percentage = ${percentage}%`;
    resultsList.appendChild(listItem);
  }
}

//--------> Reset Button <--------
button2.addEventListener('click', reloadPage);
function reloadPage () {
  currentRound = 0;
  window.location.reload();
}

console.log(ImagesGen.all);

//--------> Results Bar Chart <--------
function chartGen () {

  let chartNames = []; let chartDisplayed = []; let chartClicks = [];

  for (let i=0; i<ImagesGen.all.length; i++) {
    chartNames.push(ImagesGen.all[i].name);
    chartDisplayed.push(ImagesGen.all[i].displayed);
    chartClicks.push(ImagesGen.all[i].clicks);
  }

  let ctx = document.getElementById('resultsBarChart').getContext('2d');
  let resultsBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartNames,
      datasets: [{
        label: 'Displayed',
        data: chartDisplayed,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }, {
        label: 'Votes',
        data: chartClicks,
        backgroundColor: 'rgba(155, 99, 132, 0.2)',
        borderColor: 'rgba(155, 99, 132, 1)',
        borderWidth: 1
      }]
    },
  });
}

function getData() {
  if (localStorage.data) {
    let data = JSON.parse(localStorage.data);
    for (let i=0; i<data.length; i++) {
      new ImagesGen(data[i].name, data[i].imgSrc, data[i].displayed, data[i].clicks);
    }
  }
  else {
    for (let i=0; i<imagesArray.length; i++) {
      new ImagesGen (imagesArray[i].split('.')[0], `img/${imagesArray[i]}`);
    }
  }
}
