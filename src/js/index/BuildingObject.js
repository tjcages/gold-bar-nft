const THREE = require("three");

const isiOS = require('../smooth_scroll_manager/isiOS');
const isAndroid = require('../smooth_scroll_manager/isAndroid');

import vs from "./glsl/typo.vs";
import fs from "./glsl/typo.fs";

export default class TitleObject {
  constructor() {
    this.uniforms = {
      time: {
        type: "f",
        value: 0,
      },
      resolution: {
        type: "v2",
        value: new THREE.Vector2(),
      },
      texture: {
        type: "t",
        value: null,
      },
    };
    this.obj;
    this.isLoaded = false;
  }
  loadTexture(callback) {
    const loader = new THREE.TextureLoader();
    loader.load("/img/index/building.png", (texture) => {
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      this.uniforms.texture.value = texture;
      this.obj = this.createObj();
      if (isiOS() | isAndroid()) {
        this.obj.position.set(0, 168, 0);
      } else {
        this.obj.position.set(0, 136, 0);
      }

      this.isLoaded = true;
      callback();
    });
  }
  createObj() {
    return new THREE.Mesh(
      new THREE.PlaneGeometry(200, 260, 40, 10),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: vs,
        fragmentShader: fs,
        transparent: true,
      })
    );
  }
  render(time) {
    if (!this.isLoaded) return;
    this.uniforms.time.value += time;
  }
}
