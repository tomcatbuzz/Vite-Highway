// import './style.scss'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
import Highway from '@dogstudio/highway';

import Cursors from "./src/js/Cursors";
// import testImage from './src/home.jpg'
import gsap from 'gsap'
import { ScrollSmoother } from 'gsap/all';
import { ScrollTrigger } from 'gsap/all';
import { SplitText } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText)

ScrollTrigger.normalizeScroll(true)

// create the smooth scroller FIRST!
const smoother = ScrollSmoother.create({
  wrapper: "#wrapper",
  content: "#content",
  smooth: 1,
  normalizeScroll: true, // prevents address bar from showing/hiding on most devices, solves various other browser inconsistencies
  ignoreMobileResize: true, // skips ScrollTrigger.refresh() on mobile resizes from address bar showing/hiding
  effects: true,
  preventDefault: true
}); 

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

// const loaderContainer = document.querySelector('.loader-wrapper');
// const cursors = document.querySelector('.cursor')

const splashScreen = document.querySelector('.splash__screen')
const splashLeft = document.querySelector('.left');
const splashRight = document.querySelector('.right');
const progressBar = document.querySelector('.progress__bar');
const percentage = document.querySelector('.percentage');
let loading = true;

window.addEventListener('load', () => { 
  setTimeout(() => {
    progressBar.style.height = '40%'
  }, 2000);

  setTimeout(() => {
    progressBar.style.height = '80%'
  }, 4000);

  setTimeout(() => {
    progressBar.style.height = '100%'
  }, 5000);

  setTimeout(() => {
    splashLeft.classList.add('active')
    splashRight.classList.add('active')
    progressBar.classList.add('complete')
    splashScreen.classList.add('complete')
    loading = false
  }, 6000);

  setTimeout(() => {
    Cursors.init()
  },4000)

  function percentageTracker() {
    if(loading) {
        let { height, top } = progressBar.getBoundingClientRect()
        let p = Math.ceil((height / window.innerHeight) * 100)
        // percentage.style.color = 'white'
        percentage.textContent = `${p}%`
        percentage.style.transform = `translateY(calc(${top - window.innerHeight}px)`
        requestAnimationFrame(percentageTracker)
    }
  }
  
  percentageTracker()

  let path = document.querySelector(".path");
function lerp(start, end, t){
    return start * (1 - t) + end * t;
}

let toggle = false;

// Start SVG at bottom of screen
let y = 100;
let c = 100;


function animate(){
    if(toggle) {
        y = lerp(y, 0, .055);
        c = lerp(c, 0, 0.075);
        path.setAttribute('d', `M 0 ${y} L 0 100 100 100 100 ${y} C ${50} ${c}, ${50} ${c}, 0 ${y}` )
    } else {
        y = lerp(y, 100, .055)
        c = lerp(c, 100, 0.075);
        path.setAttribute('d', `M 0 ${y} L 0 100 100 100 100 ${y} C 50 ${c}, ${50} ${c}, 0 ${y}` )
    }
    
    requestAnimationFrame(animate)
}

animate()


const menuToggle = document.querySelector('.menu-toggle')
// const closeToggle = document.querySelector('.menu__close')
const div = document.querySelector('.wrapper')
const ul = document.querySelector('.menu__ul')
const menuClose = document.querySelector('.close-toggle')
// const links = document.querySelectorAll('.menu__ul li a')
console.log(ul, "UL")
menuToggle.addEventListener('click', () => {
    setTimeout(() => {
        toggle = !toggle;
    }, 300)
    if(toggle) {
        ul.classList.remove('active')
        div.classList.remove('active')
        document.body.style.overflow = 'visible'

    } else {
        setTimeout(() => {
            ul.classList.add('active')
            div.classList.add('active')
            document.body.style.overflow = 'hidden'
        }, 1000)
    }
    
    menuToggle.classList.toggle('active')
    // closeToggle.classList.toggle('active')
    // links.classList.toggle('active')
})

  // const closeToggle = document.querySelector('.close-toggle')
  // closeToggle.addEventListener('click', () => {
  // setTimeout(() => {
  //     close = !close;
  // }, 300)
  // if(close) {
  //     ul.classList.remove('active')
  //     div.classList.remove('active')
  // } else {
  //     setTimeout(() => {
  //         ul.classList.add('active')
  //         div.classList.add('active')
  //     }, 1000)
  // }
  
  // closeToggle.classList.close('active')
  // })
})

// document.addEventListener('click', testScene)
// const el = document.getElementById('testScene')
//   el.addEventListener('click', testScene())
// const testScene = () => {
//   const div = document.createElement('div')
//   div.className = 'transition'
//       div.style.position = 'fixed'
//       div.style.top = 0
//       div.style.width = '100%'
//       div.style.height = '100%'
//       div.style.backgroundColor = 'white'
//       div.innerHTML = '<span class="rock">Rock On</span><ul><li><a href="index.html">Home</a></li><a href="about.html">About</a><li></li><a href="contact.html">Contact</a><li></li></ul>'
//       div.style.zIndex = 100
//       document.body.appendChild(div)
// }

// document.addEventListener("DOMContentLoaded", () => {
//   setTimeout(() => {
//     Cursors.init()
//   },4000)
  
//   console.log(Cursors, "when")
// })

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
