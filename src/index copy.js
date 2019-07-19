const glsl = x => x;
import { initContext, circle, render, rand, Polygon } from './utils';

const gl = initContext();

const foo = new Polygon({
  vert: glsl`
  attribute vec4 aVertexPosition;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform float uTime;
  vec4 pos;
  void main() {
    pos = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    pos.x -= sin(uTime + (aVertexPosition.y));
    pos.y += sin(uTime - (aVertexPosition.x));
    gl_Position = pos;
  }
`,
  frag: glsl`
  precision highp float;
  uniform vec3 uColor;
  uniform float uTime;
  void main() { 
    gl_FragColor = vec4(uColor, 1.);
  }
`,
  uniforms: ['uColor', 'uTime']
});

const foo2 = new Polygon({
  vert: glsl`
  attribute vec4 aVertexPosition;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform float uTime;
  vec4 pos;
  void main() {
    pos = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    pos.x += sin(uTime + (aVertexPosition.y));
    pos.y -= sin(uTime - (aVertexPosition.x));
    gl_Position = pos;
  }
`,
  frag: glsl`
  precision highp float;
  uniform vec3 uColor;
  uniform float uTime;
  void main() { 
    gl_FragColor = vec4(uColor, 1.);
  }
`,
  uniforms: ['uColor', 'uTime']
});

render(time => {
  foo.setPositions(circle(1000, 1, 0, 0));
  foo.setUniform('uColor', [255, 255, 255]);
  foo.setUniform('uTime', [time]);

  foo2.setPositions(circle(1000, 0.5, 0, 0));
  foo2.setUniform('uColor', [255, 0, 255]);
  foo2.setUniform('uTime', [time]);
}, 60);
