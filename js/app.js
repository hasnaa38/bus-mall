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
function ImagesGen (name, imageSrc) {
  this.name = name; // name of the product
  this.imgSrc = imageSrc; // path of the image
  this.displayed = 0; // how many times the images was displayed on the screen
  this.clicks = 0; // how many times the visitor picked this image
  ImagesGen.all.push( this );
}
ImagesGen.all = [];

//Creating the objects:
for (let i=0; i<imagesArray.length; i++) {
  new ImagesGen (imagesArray[i].split('.')[0], `img/${imagesArray[i]}`);
}

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
  firstImage.src = ImagesGen.all[currentRands[0]].imgSrc;
  secondImage.src = ImagesGen.all[currentRands[1]].imgSrc;
  thirdImage.src = ImagesGen.all[currentRands[2]].imgSrc;

  //Increment the display counter for the chosen objects
  ImagesGen.all[currentRands[0]].displayed++;
  ImagesGen.all[currentRands[1]].displayed++;
  ImagesGen.all[currentRands[2]].displayed++;

  counterBox.textContent = `${currentRound}`; //Add current round counter

}
render();

//--------> Clicking on images event <--------
imagesArea.addEventListener('click', itemPicked);
function itemPicked (e) {
  e.preventDefault();
  let thisImage = eval(e.target.id).src.split('/')[4].split('.')[0]; // to get the name of the chosen image
  console.log('this image is a ' + thisImage);

  //To determine the chosen image from the images array
  for (let i=0; i<imagesArray.length; i++) {
    if (ImagesGen.all[i].name === thisImage) {
      ImagesGen.all[i].clicks++;
      console.log('the clicks for ' + ImagesGen.all[i].name + ' are equal to ' + ImagesGen.all[i].clicks); }
  }
  //Selecting the clicked image while we still have rounds
  if ((e.target.id === 'firstImage' || e.target.id === 'secondImage' || e.target.id === 'thirdImage') && (currentRound<totalRounds-1)) {
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
