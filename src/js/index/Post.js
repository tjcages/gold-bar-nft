const THREE = require("three");

import vs from "./glsl/post.vs";
import fs from "./glsl/post.fs";

export default class PostEffect {
  constructor(texture) {
    this.uniforms = {
      time: {
        type: "f",
        value: 0,
      },
      resolution: {
        type: "v2",
        value: new THREE.Vector2(document.body.clientWidth, window.innerHeight),
      },
      texture: {
        type: "t",
        value: texture,
      },
      strength: {
        type: "f",
        value: 0,
      },
      height: {
        type: "f",
        value: 1,
      },
      aspectRatio: {
        type: "f",
        value: 1,
      },
      cylindricalRatio: {
        type: "f",
        value: 1,
      },
    };
    this.obj = this.createObj(texture);
    this.time = 1;
  }
  createObj() {
    return new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: vs,
        fragmentShader: fs,
      })
    );
  }
  render(time) {
    this.uniforms.time.value += time * this.time;

    // Setup distortion effect
    var horizontalFOV = 140;
    var strength = 0.5;
    var cylindricalRatio = 2;
    var height =
      Math.tan(THREE.Math.degToRad(horizontalFOV) / 2) / 0.5;

    this.uniforms.time.strength = strength;
    this.uniforms.height.value = height;
    this.uniforms.aspectRatio.value = 0.5;
    this.uniforms.cylindricalRatio.value = cylindricalRatio;
  }
  resize() {
    this.uniforms.resolution.value.set(
      document.body.clientWidth,
      window.innerHeight
    );
  }
}
