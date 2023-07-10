import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';
// import * as dat from 'dat.gui';
import gsap from 'gsap';

// import about from '../src/about.jpg'
// import projects from '../src/projects.jpg'
// import contact from '../src/contact.jpeg'
// import home from '../src/home.jpg'

import about from '../src/1.jpg'
import projects from '../src/2.jpg'
import contact from '../src/3.jpg'
import home from '../src/4.jpg'

export default class Sketch {
  constructor() {
    this.scene = new THREE.Scene();
    // this.container = options.dom;
    // this.width = this.container.offsetWidth;
    // this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    // this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.useLegacyLights = true;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // not sure if needed here
    this.container = document.getElementById("container");
    this.container.appendChild(this.renderer.domElement);

    // this.camera = new THREE.PerspectiveCamera(
    //   70, 
    //   window.innerWidth / window.innerHeight, 
    //   0.001, 
    //   1000
    // );

    let frustumSize = 1;
    let aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.OrthographicCamera(
      frustumSize / -2, frustumSize / 2, frustumSize / 2, frustumSize / -2, -1000, 1000
    );
    this.camera.position.set(0, 0, 2);
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.isPlaying = true;

    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
    // this.settings();

    const loader = new THREE.TextureLoader()
    this.config = [
      {
        page: 'home',
        texture: loader.load(home)
      },
      {
        page: 'about',
        texture: loader.load(about)
      },
      {
        page: 'contact',
        texture: loader.load(contact)
      },
      {
        page: 'projects',
        texture: loader.load(projects)
      },
    ];
  }

  // settings() {
  //   this.settings = {
  //     progress: 0,
  //   };
  //   this.gui = new dat.GUI();
  //   this.gui.add(this.settings, 'progress', 0, 1, 0.01);
  // }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    //image convert
    this.imageAspect = 2592/3872;
    let a1;
    let a2;
    if(this.height/this.width>this.imageAspect) {
      a1 = (this.width/this.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = (this.height/this.width) / this.imageAspect;
    }
    
    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    // this.camera.fov =
    //   2 *
    //   Math.atan(this.width / this.camera.aspect / (2 * this.cameraDistance)) *
    //   (180 / Math.PI); // in degrees

    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        progress: { value: 0 },
        // t1: { value: null },
        // t2: { value: null },
        t1: { value: new THREE.TextureLoader().load(home) },
        t2: { value: new THREE.TextureLoader().load(about) },
        resolution: { value: new THREE.Vector4() },
        uvRate1: { value: new THREE.Vector2(1, 1) },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment
    });
    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  goto(page) {
    let gotoPage = this.config.find(o => {
      return o.page == page
    })
    
    this.material.uniforms.t2.value = gotoPage.texture
    
    let tl = new gsap.timeline()
    tl.to(this.material.uniforms.progress, {
      duration: 1,
      value: 1,
      onComplete:()=> {
        this.material.uniforms.progress.value = 0
        this.material.uniforms.t1.value = gotoPage.texture
      }
    })
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.render()
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying) return;
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    // this.material.uniforms.progress.value = this.settings.progress;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

// new Sketch({
//   dom: document.getElementById('container')
// });