// import './style.scss'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
import Highway from '@dogstudio/highway';

import Cursors from "./src/js/Cursors";
// import testImage from './src/home.jpg'


import Fade from './fade';

const H = new Highway.Core({
  transitions: {
    default: Fade
  }
});

// Get all menu links
const links = document.querySelectorAll('.nav li a');
console.log(links, "links")

// Listen the `NAVIGATE_IN` event
// This event is sent everytime a `data-router-view` is added to the DOM Tree
H.on('NAVIGATE_IN', ({ to, location }) => {
  // Check Active Link
  for (let i = 0; i < links.length; i++) {
    const link = links[i];

    // Clean class
    // link.classList.remove('is-active');
    link.style.color = ''

    // Active link
    if (link.href === location.href) {
      // link.classList.add('is-active');
      link.style.color = 'red'
    }
  }
});

const loaderContainer = document.querySelector('.loader-wrapper');
window.addEventListener('load', () => {
  setTimeout(() => {
    loaderContainer.classList.add('loader-finish')
  }, 3000)
  console.log(setTimeout, "Time")
    // loaderContainer.classList.add('loader-finish')
    // Cursors.init()
})

const testScene = () => {
  const div = document.createElement('canvas')
}

document.addEventListener("DOMContentLoaded", () => {
  Cursors.init()
})

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))
