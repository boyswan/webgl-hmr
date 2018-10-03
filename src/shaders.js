const glsl = x => x;

export const vert = glsl`
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform float uTime;
  uniform float uRand;

  attribute vec4 aPosition;
  attribute vec3 aNormal;

  varying vec4 vPos;
  varying vec3 vNormal;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  }
`;

export const frag = glsl`
  precision highp float;

  uniform vec3 uColor;
  uniform float uTime;

  varying vec4 vPos;
  varying vec3 vNormal;

  void main() { 
    vec3 color = uColor;
    vec3 adj = normalize(vNormal) * 0.5 + 0.5;
    adj.xz += sin(uTime);
    gl_FragColor = vec4(uColor, 1.0);
  }
`;
