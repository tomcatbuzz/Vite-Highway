import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import fragment from './shaders/scenefragment.glsl';
import vertex from './shaders/scenevertex.glsl';
// import * as dat from 'dat.gui';
import gsap from 'gsap';
import { Text } from 'troika-three-text'

import sphere360 from '../img/outdoor.jpg'
// import planet from '../img/planet2k.jpg'
import planet from '../src/globe.jpeg'

function calcPosFromLatLonRad(lat, lon) {
  let phi = (lat)*(Math.PI/180)
  let theta = (lon+180)*(Math.PI/180)
  let theta1 = (270 - lon)*(Math.PI/180)
  let x = -(Math.cos(phi)*Math.cos(theta))
  let z = (Math.cos(phi)*Math.sin(theta))
  let y = (Math.sin(phi))
  let vector = {x, y, z}
  let euler = new THREE.Euler(phi, theta1, 0, 'XYZ')
  let quaternion = new THREE.Quaternion().setFromEuler(euler)
  return {vector, quaternion}
}

let points = [
  {
    title: 'Kyiv',
    coords: {
      lat: 50.4501,
      lng: 38.5234
    },
    texture: sphere360
  },
  {
    title: 'Cancun',
    coords: {
      lat: 21.1619,
      lng: -86.8515
    },
    texture: sphere360
  },
  {
    title: 'Marseille',
    coords: {
      lat: 48.8566,
      lng: 2.3522
    },
    texture: sphere360
  }
]

export default class Scene {
  constructor(options) {
    this.scene360 = new THREE.Scene();
    this.scenePlanet = new THREE.Scene();
    this.sceneFinal = new THREE.Scene();
    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.physicallyCorrectLights = true;
    // this.renderer.outputEncoding = THREE.sRGBEncoding;
    
    // not sure if needed here
    // this.container = document.getElementById("container");
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70, 
      window.innerWidth / window.innerHeight, 
      0.001, 
      1000
    );

    this.camera1 = new THREE.PerspectiveCamera(
      70, 
      window.innerWidth / window.innerHeight, 
      0.001, 
      1000
    );

    let frustumSize = 1;
    let aspect = window.innerWidth / window.innerHeight;
    this.cameraFinal = new THREE.OrthographicCamera(
      frustumSize / -2, frustumSize / 2, frustumSize / 2, frustumSize / -2, -1000, 1000
    );

    this.camera.position.set(0, 0, 2);
    this.camera1.position.set(0, 0, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls1 = new OrbitControls(this.camera1, this.renderer.domElement);
    this.time = 0;

    this.isPlaying = true;

    this.close = document.getElementById('close')
    this.list = document.getElementById('list')

    this.create360();
    this.createPlanet();
    this.createFinal();
    this.resize();
    this.render();
    this.setupResize();
    // this.settings();
    this.animate();
  }

  // settings() {
  //   this.settings = {
  //     progress: 0,
  //   };
  //   this.gui = new dat.GUI();
  //   this.gui.add(this.settings, 'progress', 0, 1, 0.01);
  // }

  animate() {
    this.animate = {
      progress: 0,
    }
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    //image convert
    // this.imageAspect = 2592/3872;
    // let a1;
    // let a2;
    // if(this.height/this.width>this.imageAspect) {
    //   a1 = (this.width/this.height) * this.imageAspect;
    //   a2 = 1;
    // } else {
    //   a1 = 1;
    //   a2 = (this.height/this.width) / this.imageAspect;
    // }
    
    // this.material.uniforms.resolution.value.x = this.width;
    // this.material.uniforms.resolution.value.y = this.height;
    // this.material.uniforms.resolution.value.z = a1;
    // this.material.uniforms.resolution.value.w = a2;

    // this.camera.fov =
    //   2 *
    //   Math.atan(this.width / this.camera.aspect / (2 * this.cameraDistance)) *
    //   (180 / Math.PI); // in degrees

    this.camera.updateProjectionMatrix();
  }

  create360() {
    this.geometry = new THREE.SphereBufferGeometry(10, 30, 30);

    let t = new THREE.TextureLoader().load(sphere360);
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.x = -1;
    this.sphere = new THREE.Mesh(
      this.geometry, 
      new THREE.MeshBasicMaterial({
        map: t,
        side: THREE.BackSide
      })
      );
    this.scene360.add(this.sphere);

    const myText = new Text()
    this.scene360.add(myText)

    // Set properties to configure:
    myText.text = 'Marseille'
    myText.fontSize = 1
    myText.anchorX = 'center'
    myText.position.z = -2
    myText.color = 0xFFFFFF

    // Update the rendering:
    myText.sync()

    // let close = document.getElementById('close')
    let el = document.createElement('div')
    el.innerText = 'X'
    el.style.color = 'white'
    el.style.backgroundColor = 'black'
    this.close.appendChild(el)
    gsap.set(this.close, {
      opacity: 0
    })
    el.addEventListener('click', () => {
      gsap.to(this.animate, {
        duration: 1.5,
        delay: 0.5,
        progress: 0
      })
      gsap.to(this.close, {
        opacity: 0
      })
      gsap.to(this.list, {
        opacity: 1
      })
    })
  }

  createPlanet() {
    this.group = new THREE.Group()

    this.earth = new THREE.Mesh(
      new THREE.SphereBufferGeometry(1, 30, 30),
      new THREE.ShaderMaterial({
        planetvertex, 
        planetfragment,
        uniforms: {
          planetTexture: {
            value: new THREE.TextureLoader().load(planet)
          }
        } 
      })
    )

    this.group.add(this.earth)
    this.scenePlanet.add(this.group)

    // let list = document.getElementById('list')
    points.forEach(p => {
      let coords = calcPosFromLatLonRad(p.coords.lat, p.coords.lng)
      let el = document.createElement('div');
      el.innerText = p.title;
      this.list.appendChild(el)

      let mesh = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.02, 10, 10),
        new THREE.MeshBasicMaterial({color: 0xff0000})
      )
      this.group.add(mesh);
      mesh.position.copy(coords.vector)

      let animatedQuaternion = new THREE.Quaternion()
      let currentQuaternion = new THREE.Quaternion()

      el.addEventListener('click', () => {
        let o = {p: 0}

        // Make an ARRAY of LINKS here to go to other scenes on click
        
        currentQuaternion.copy(this.group.quaternion)
        gsap.to(o, {
          p: 1,
          duration: 1,
          onUpdate: () => {
            console.log(o.p)
            animatedQuaternion.slerpQuaternions(currentQuaternion, coords.quaternion, o.p)
            this.group.quaternion.copy(animatedQuaternion)
          }
        })
        gsap.to(this.animate, {
          duration: 1,
          delay: 0.5,
          progress: 1
        })
        gsap.to(this.list, {
          opacity: 0
        })
        gsap.to(this.close, {
          opacity: 1
        })
      })
    })
  }

  createHome() {
    
  }

  createFinal() {
    this.texture360 = new THREE.WebGLRenderTarget(this.width, this.height, {
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter
    })
    this.textureplanet = new THREE.WebGLRenderTarget(this.width, this.height, {
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter
    })
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        scene360: { value: null },
        scenePlanet: { value: null },
        progress: { value: 0 },
        texture1: { value: null },
        // t1: { value: new THREE.TextureLoader().load(texture1) },
        // t2: { value: new THREE.TextureLoader().load(blog) },
        resolution: { value: new THREE.Vector4() },
        uvRate1: { value: new THREE.Vector2(1, 1) },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment
    });

    let geo = new THREE.PlaneBufferGeometry(1, 1)
    let mesh = new THREE.Mesh(geo, this.material)

    this.sceneFinal.add(mesh)
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
    this.material.uniforms.progress.value = this.animate.progress;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.setRenderTarget(this.texture360);
    this.renderer.render(this.scene360, this.camera);
    this.renderer.setRenderTarget(this.textureplanet);
    this.renderer.render(this.scenePlanet, this.camera);
    this.material.uniforms.scene360.value = this.texture360.texture;
    this.material.uniforms.scenePlanet.value = this.textureplanet.texture
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.sceneFinal, this.cameraFinal);
  }
}

new Scene({
  dom: document.getElementById('container')
});