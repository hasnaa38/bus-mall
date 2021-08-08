'use strict';

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

let counter = 0;
let numOfRounds = 25;

let imagesArray = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg',
  'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg',
  'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png',
  'tauntaun.jpg', 'unicorn.jpg', 'water-can.jpg', 'wine-glass.jpg'];

//Constructor function:
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

//Rendering function:
function render () {
  //to make sure not to display the same image twice
  let firstRandom = genRandomNumber(0, imagesArray.length-1);
  let secondRandom = genRandomNumber(0, imagesArray.length-1);
  if (secondRandom === firstRandom) {
    secondRandom = genRandomNumber(0, imagesArray.length-1);
  }
  let thirdRandom = genRandomNumber(0, imagesArray.length-1);
  if (thirdRandom === firstRandom || thirdRandom === secondRandom) {
    thirdRandom = genRandomNumber(0, imagesArray.length-1);
  }

  //Appending the random selected image to its area
  firstImage.src = ImagesGen.all[firstRandom].imgSrc;
  secondImage.src = ImagesGen.all[secondRandom].imgSrc;
  thirdImage.src = ImagesGen.all[thirdRandom].imgSrc;

  ImagesGen.all[firstRandom].displayed++;
  ImagesGen.all[secondRandom].displayed++;
  ImagesGen.all[thirdRandom].displayed++;
  counterBox.textContent = `${counter}`;
}

render();

imagesArea.addEventListener('click', itemPicked);

function itemPicked (e) {
  e.preventDefault();
  let thisImage = eval(e.target.id).src.split('/')[4].split('.')[0]; // to get the name of the chosen image
  console.log('this image is a ' + thisImage);

  for (let i=0; i<imagesArray.length; i++) {
    if (ImagesGen.all[i].name === thisImage) {
      ImagesGen.all[i].clicks++;
      console.log('the clicks for ' + ImagesGen.all[i].name + ' are equal to ' + ImagesGen.all[i].clicks); }
  }
  if ((e.target.id === 'firstImage' || e.target.id === 'secondImage' || e.target.id === 'thirdImage') && (counter<numOfRounds-1)) {
    counter++;
    render(); }
  else {
    counterBox.textContent = `${counter+1}`;
    imagesArea.removeEventListener('click', itemPicked);
    button1.removeAttribute('hidden');
    button2.removeAttribute('hidden'); }
}

button1.addEventListener('click', showResults);

function showResults (e) {
  e.preventDefault();
  for (let i=0; i<imagesArray.length; i++) {
    let listItem = document.createElement('li');
    listItem.textContent = `${ImagesGen.all[i].name} had ${ImagesGen.all[i].clicks} votes, and was seen ${ImagesGen.all[i].displayed} times.`;
    resultsList.appendChild(listItem);
  }
}

button2.addEventListener('click', reloadPage);

function reloadPage () {
  window.location.reload();
}
