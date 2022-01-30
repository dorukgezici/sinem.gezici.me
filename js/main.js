// Find the latest version by visiting https://cdn.skypack.dev/three.
import * as THREE
  from 'https://cdn.skypack.dev/pin/three@v0.137.5-HJEdoVYPhjkiJWkt6XIa/mode=imports,min/optimized/three.js';
import {
  OrbitControls,
} from 'https://cdn.skypack.dev/three@v0.137.5-HJEdoVYPhjkiJWkt6XIa/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const controls = new OrbitControls(camera, renderer.domElement);
