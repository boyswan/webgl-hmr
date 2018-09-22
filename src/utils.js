import { mat4 } from 'gl-matrix';

export const initContext = () => {
  const canvas = document.querySelector('#glCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const gl = canvas.getContext('webgl');
  window.gl = gl;
  return gl;
};

export const initProgramInfo = (gl, shaderProgram, info) => {
  const location = v => {
    if (v[0] == 'a') return gl.getAttribLocation(shaderProgram, v);
    if (v[0] == 'u') return gl.getUniformLocation(shaderProgram, v);
  };
  return info
    .concat(['aVertexPosition', 'uProjectionMatrix', 'uModelViewMatrix'])
    .reduce((acc, v) => Object.assign(acc, { [v]: location(v) }), {});
};

export const initShaderProgram = (gl, vert, frag) => {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vert);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, frag);
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  return shaderProgram;
};

export const loadShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
};

export const initViewMatrices = (gl, shaderProgram, programInfo) => {
  clearCanvas(gl);
  const progProjecMatrix = programInfo.uProjectionMatrix;
  const progModelMatrix = programInfo.uModelViewMatrix;
  const modelViewMatrix = mat4.create();
  const projectionMatrix = mat4.create();
  const fieldOfView = (45 * Math.PI) / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
  gl.useProgram(shaderProgram);
  gl.uniformMatrix4fv(progProjecMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(progModelMatrix, false, modelViewMatrix);
};

export const clearCanvas = gl => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

export const initBuffer = (gl, matrix, type) => {
  const buffer = gl.createBuffer();
  gl.bindBuffer(type, buffer);
  gl.bufferData(type, new Float32Array(matrix), gl.STATIC_DRAW);
  return buffer;
};

export const attachBuffer = (gl, programInfo, buffer, iter) => {
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  const offset = 0; // how many bytes inside the buffer to start from
  const vertPos = programInfo.aVertexPosition;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(vertPos, iter, type, normalize, stride, offset);
  gl.enableVertexAttribArray(vertPos);
};
