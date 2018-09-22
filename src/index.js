import { vert, frag } from './shaders';
import {
  attachBuffer,
  initBuffer,
  clearCanvas,
  initShaderProgram,
  initViewMatrices
} from './utils';

const canvas = document.querySelector('#glCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gl = canvas.getContext('webgl');
window.gl = gl;

const shaderProgram = initShaderProgram(gl, vert, frag);

const programInfo = {
  vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
  projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
  modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
  color: gl.getUniformLocation(shaderProgram, 'uColor')
};

initViewMatrices(gl, shaderProgram, programInfo);

/*prettier-ignore*/
const color = [
  0.0, 255.0, 255.0
];

gl.uniform3fv(programInfo.color, color);

/*prettier-ignore*/
const positions = [
  -1.0,  1.0,
   1.0,  1.0,
  -1.0, -1.0,
   1.0, -1.0,

  -2.0,  2.0,
   2.0,  2.0,
  -2.0, -2.0,
   2.0, -2.0,
];

const buffers = {
  position: initBuffer(gl, positions, gl.ARRAY_BUFFER)
};

const iter2 = 2;
const first = 0;
const count = positions.length / iter2;
attachBuffer(gl, programInfo, buffers.position, iter2);
gl.drawArrays(gl.LINE_STRIP, first, count);

console.log('ok');
