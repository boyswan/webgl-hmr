import { mat4 } from 'gl-matrix';

export const checkShaderSafe = (shader, gl) => {
  let msg = 'An error occurred compiling the shaders: ';
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(msg + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

export const checkProgramSafe = (shaderProgram, gl) => {
  let msg = 'Unable to initialize the shader program: ';
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error(msg + gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  return shaderProgram;
};

export const initShaderProgram = (gl, vert, frag) => {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vert);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, frag);
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  return checkProgramSafe(shaderProgram, gl);
};

export const loadShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return checkShaderSafe(shader, gl);
};

export const initViewMatrices = (gl, shaderProgram, programInfo) => {
  clearCanvas(gl);
  const progProjecMatrix = programInfo.projectionMatrix;
  const progModelMatrix = programInfo.modelViewMatrix;
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
  const numComponents = iter; // pull out 2 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  const offset = 0; // how many bytes inside the buffer to start from

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(
    programInfo.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.vertexPosition);
};
