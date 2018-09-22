import { vert, frag } from './shaders';
import {
  initContext,
  initBuffer,
  initProgramInfo,
  initShaderProgram,
  initViewMatrices,
  attachBuffer
} from './utils';

const info = ['uColor'];

const gl = initContext();
const shaderProgram = initShaderProgram(gl, vert, frag);
const programInfo = initProgramInfo(gl, shaderProgram, info);

initViewMatrices(gl, shaderProgram, programInfo);

/*prettier-ignore*/
const color = [
  0.0, 255.0, 255.0
];

gl.uniform3fv(programInfo.uColor, color);

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
