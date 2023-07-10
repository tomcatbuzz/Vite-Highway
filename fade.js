import Highway from '@dogstudio/highway';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
gsap.registerPlugin(SplitText);
// import { transition } from "./src/js/transition3";
// import Cursors from "./src/js/Cursors";
// import Transition from './src/js/Transition';

import A from './canvas/app';

let sketch = new A();

let animation = gsap.timeline({});


export default class Fade extends Highway.Transition {

  out({from, done}) {
    // console.log('OUT', from);
    // original timeline below
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
    // gsap.set(this.element, { rotation: 180 })
    //   const tl = gsap.timeline({
    //     defaults: {
    //       duration: 1.5,
    //       ease: 'expo.inOut'
    //     },
    //     onComplete: done,
    //     onUpdate: this.onUpdate.bind(this),
    //     progress: 0
    //   })
    //   // tl.to(this),
    //   tl.to(from, {opacity: 0})
    //   tl.add(this)
    //   return tl
  }

  in({from, to, done}) {
    let goto = to.getAttribute('data-router-view');
    sketch.goto(goto);
    const split = new SplitText('#tagLine', {type:'chars'});
	  animation.from(split.chars, {opacity:0, y:50, ease:'back(4)', stagger:{
		from:'end',
		each:0.05
	  }});
    from.remove();
    // console.log('IN', from, to);
    // original timeline below
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

    // gsap.set(this.element, { rotation: 0 })
    //   const tl = gsap.timeline({
    //     defaults: {
    //       duration: 1.5, 
    //       ease: 'expo.inOut'
    //     },
    //     onComplete: done,
    //     onUpdate: this.onUpdate.bind(this),
    //     progress: 1
    //   })
    //   // tl.to(this),
    //   tl.fromTo(to, {opacity: 0}, {opacity: 1})
    //   tl.add(this)
    //   return tl
  }
}