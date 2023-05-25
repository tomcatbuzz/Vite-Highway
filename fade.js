import Highway from '@dogstudio/highway';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
gsap.registerPlugin(SplitText);
// import { transition } from "./src/js/transition3";
import Cursors from "./src/js/Cursors";

import A from './canvas/app';

let sketch = new A();

let animation = gsap.timeline({});

export default class Fade extends Highway.Transition {
  out({from, done}) {
    // console.log('OUT', from);
    const tl = gsap.timeline({
      defaults: {
        // duration: 0.5,
        duration: 1,
        ease: 'power1.inOut'
      },
      onComplete: done
    });
    tl.to(from, { opacity: 0 });
    return tl;
    
  }

  in({from, to, done}) {
    // transition()
    // Cursors.init()
    let goto = to.getAttribute('data-router-view');
    sketch.goto(goto);
    const split = new SplitText('h1', {type:'chars'});
	  animation.from(split.chars, {opacity:0, y:50, ease:'back(4)', stagger:{
		from:'end',
		each:0.05
	  }});
    from.remove();
    // console.log('IN', from, to);
    const tl = gsap.timeline({
      defaults: {
        // duration: 0.5,
        duration: 1,
        ease: 'power1.inOut'
      },
      onComplete: done
    })
    tl.fromTo(to, { opacity: 0 }, { opacity: 1 });
    return tl;
  }
}