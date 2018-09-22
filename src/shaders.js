const glsl = x => x;

export const vert = glsl`
  attribute vec4 aVertexPosition;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    gl_PointSize = 10.0;
  }
`;

export const frag = glsl`
  precision highp float;
  uniform vec3 uColor;
  void main() { 
    gl_FragColor = vec4(uColor, 1.0);
  }
`;
