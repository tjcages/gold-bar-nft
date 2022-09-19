const THREE = require("three");

import vs from "./glsl/title.vs";
import fs from "./glsl/title.fs";

export default class ImageObject {
  constructor(image, width, height) {
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
    this.image = image;
    this.width = width;
    this.height = height;
  }
  loadTexture(callback) {
    const loader = new THREE.TextureLoader();
    loader.load(this.image, (texture) => {
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      this.uniforms.texture.value = texture;
      this.obj = this.createObj();
      this.obj.position.set(0, 0, 0);

      this.isLoaded = true;
      callback();
    });
  }
  createObj() {
    return new THREE.Mesh(
      new THREE.PlaneGeometry(this.width, this.height, 40, 10),
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
