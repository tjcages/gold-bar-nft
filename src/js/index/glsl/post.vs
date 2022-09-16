attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv; // output to interpolate over screen

uniform float strength;          // s: 0 = perspective, 1 = stereographic
uniform float height;            // h: tan(verticalFOVInRadians / 2)
uniform float aspectRatio;       // a: screenWidth / screenHeight
uniform float cylindricalRatio;  // c: cylindrical distortion ratio. 1 = spherical

varying vec2 vUVDot;

void main() {
  // gl_Position = projectionMatrix * (modelViewMatrix * vec4(position, 1.0));

  float scaledHeight = strength * height;
  float cylAspectRatio = aspectRatio * cylindricalRatio;
  float aspectDiagSq = aspectRatio * aspectRatio + 1.0;
  float diagSq = scaledHeight * scaledHeight * aspectDiagSq;
  vec2 signedUV = (2.0 * uv + vec2(-1.0, -1.0));

  float z = 0.5 * sqrt(diagSq + 1.0) + 0.5;
  float ny = (z - 1.0) / (cylAspectRatio * cylAspectRatio + 1.0);

  vUVDot = sqrt(ny) * vec2(cylAspectRatio, 1.0) * signedUV;
  // vUV = vec3(0.5, 0.5, 1.0) * z + vec3(-0.5, -0.5, 0.0);
  // vUV.xy += uv;

  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
