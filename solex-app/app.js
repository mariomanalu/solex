import { showGroundView, leavePlanet, stopGroundView } from "./Perspectives/groundPerspective.js";
import {
  showPlanetView,
  changeCamera,
  goToPlanet,
  stopPlanetView
} from "./Perspectives/planetPerspective.js";
import { slipspace, stopSlipspace } from "./Perspectives/travelSpace.js";
import { solarView, goToPlanet2, stopSolar } from "./Perspectives/solarSystem.js";

//  Sources for Facts
//https://www.universetoday.com/33415/interesting-facts-about-the-planets/
//https://space-facts.com/planets/


const alertFunFacts = {
    'mercurySpace' : ["Mercury is the smallest planet in our solar system", "Because of its rotation and speed it circles the sun, on Mercury there are only 2 days in a year!" ],
    'mercuryGround' : ["Mercury is hot, but not too hot for ice!", "Mercury’s craters are named after famous artists, musicians and authors" ],
    'venusSpace' : ["Venus doesn’t have any moons, and we aren’t sure why.", "Venus spins slowly in the opposite direction of most planets " ],
    'venusGround' : ["Venus is the hottest planet in the solar system", "A day on Venus is longer than a year " ],
    'earthSpace' : ["You can see Earth’s magnetic field at work during light shows", "The earth’s molten iron core creates a magnetic field. " ],
    'earthGround' : [" Earth is the only planet we know of so far that’s inhabited by living things", "Three Quarters of the Earth is covered by water! " ],
    'marsSpace' : ["There have been more missions to mars than any other planet!", " You can jump three times higher on Mars than you can on Earth!" ],
    'marsGround' : ["Mars is a dusty, cold, desert world", " Mars Is the home of the largest volcano in the solar system, triple the height of mount Everest!" ],
    'jupiterSpace' : ["Jupiter has more than double the mass of all the other planets combined!", " Jupiter is a great comet catcher" ],
    'saturnSpace' : ["No one knows how old Saturn’s rings are", "Saturn is the lightest planet!" ],
    'uranusSpace' : ["Uranus is the coldest planet in the solar System ", "Uranus orbits lying on its side! " ],
    'neptuneSpace' : ["Neptune has supersonic winds", "It takes more than 4 hours for light to reach Neptune from the sun " ],
    'plutoSpace' : ["Pluto is not considered a planet, instead a dwarf planet.", " Pluto’s orbit sometimes brings it closer to the Sun than Neptune!" ],
    'plutoGround' : ["Pluto’s haze extends 1,000 miles from the surface", "There are Mountains on Pluto!" ],
    'moonSpace' : ["The moon helps stabilize our planet’s wobble and moderate our climate", "The Moon has a very thin atmosphere called an exosphere" ],
    'moonGround' : ["The Moons surface is actually dark.", "The moon has earthquakes, too" ],
    'solarSystem' : ["The solar system is 4.6 Billion years old","Light from the sun takes 8 minutes before it reaches earth","The solar system is 2 Light- years across"]
    
}

const distanceFromSun = {
  'earth': 499,
  'mercury': 193,
  'venus': 369,
  'moon': 500,
  'mars': 760,
  'jupiter': 2595,
  'saturn': 4759,
  'neptune': 14998,
  'uranus': 9575,
  'sun': 0,
  'pluto': 19680,
  'solar': -20000
};

let currentPlanet = "solar";
let lastPlanet = "";
let animating = false;
const allowedPlanets = ["earth", "mercury", "venus", "mars", "moon", "pluto"];

let alertDiv = document.getElementById("alertCard");
// animation for alerts
const animation = (messages, isError) => {
    const message = messages[Math.floor(Math.random()*messages.length)]; 
    alertDiv.innerHTML = message;
    alertDiv.classList.add(isError ? 'alert-danger' : 'alert-primary')
    alertDiv.classList.remove(!isError ? 'alert-danger' : 'alert-primary')
    alertDiv.classList.toggle("fadeout");
     alertDiv.classList.toggle("fadein");
     

    setTimeout(() => {
      alertDiv.classList.toggle("fadeout");
      alertDiv.classList.toggle("fadein");
    }, 4500);
}
window.animation = animation;

const calcDist = () => {
  return Math.floor(Math.abs(distanceFromSun[lastPlanet] - distanceFromSun[currentPlanet]) / 5);
}

function buttonAction(buttonSelected) {
  let oldButton = document.getElementsByClassName("btn");
  Array.prototype.forEach.call(oldButton, function (el) {
    el.setAttribute("class", "btn btn-outline-light");
  });

  let button = document.getElementById(buttonSelected);
  button.setAttribute("class", "btn btn-light");
}



window.onload = () => {
  solarView();
};

const changePlanet = (planet) => {
  if (currentPlanet === planet || animating) return;
  lastPlanet = currentPlanet;
  currentPlanet = planet;
  animating = true;
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      if (lastPlanet == "solar") {
        goToPlanet2();
      } else {
        changeCamera();
      }
    }, 20 * i);
  }
  setTimeout(() => {
    const menu = document.getElementById("planetControls");
    menu.hidden = true;
    if (lastPlanet === 'solar') {
      stopSolar();
    } else {
      stopPlanetView();
    }
    slipspace();
  }, 800);
  setTimeout(() => {
    const menu = document.getElementById("planetControls");
    menu.hidden = false;
    stopSlipspace();
    showPlanetView(planet, false);
    animating = false;
    buttonAction(currentPlanet);
  }, 5800);
  setTimeout(() => animation(alertFunFacts[currentPlanet + 'Space'], false), 6300);

};
window.changePlanet = changePlanet;

const visitPlanet = () => {
  if (!allowedPlanets.includes(currentPlanet)) {
    if (currentPlanet == 'solar') {
      animation(["Select a planet from the menu to visit!"], true)
    } else {
      animation([currentPlanet[0].toUpperCase() + currentPlanet.substring(1) + ' is a gaseous planet, we cannot visit!'], true);
    }
    return;
  }
  const menu = document.getElementById("planetControls");
  menu.hidden = true;
  for (let i = 0; i < 20; i++) {
    setTimeout(() => goToPlanet(), 40 * i);
  }
  setTimeout(() => {
    const menu2 = document.getElementById("planetControls2");
    menu2.hidden = false;
    stopPlanetView();
    showGroundView(currentPlanet);
  }, 800);
  setTimeout(() => animation(alertFunFacts[currentPlanet + 'Ground'], false), 1500);
};
window.visitPlanet = visitPlanet;

const backToOrbit = () => {
 
  const menu2 = document.getElementById("planetControls2");
  menu2.hidden = true;
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      leavePlanet();
    }, i * 40);
  }
  setTimeout(() => {
    stopGroundView();
    showPlanetView(currentPlanet, true);
    const menu = document.getElementById("planetControls");
    menu.hidden = false;
  }, 800);
};
window.backToOrbit = backToOrbit;

const changeToSolar = () => {
  if (currentPlanet === "solar" || animating) return;
  currentPlanet = "solar";
  animating = true;
  for (let i = 0; i < 40; i++) {
    setTimeout(() => changeCamera(), 20 * i);
  }
  setTimeout(() => {
      stopPlanetView();
      slipspace();
      const menu = document.getElementById("planetControls");
    menu.hidden = true;}
    , 800);
  setTimeout(() => {
    stopSlipspace();
    solarView();
    animating = false;
    buttonAction('solar');
    const menu = document.getElementById("planetControls");
    menu.hidden = false;
    
  }, 5800);
  setTimeout(() => animation(alertFunFacts['solarSystem'], false), 6300);
};
window.changeToSolar = changeToSolar;





