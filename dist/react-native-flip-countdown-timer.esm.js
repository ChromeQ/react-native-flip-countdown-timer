import React from 'react';
import { StyleSheet, Animated, View, Text, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import invariant from 'invariant';

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

var style = StyleSheet.create({
  wrapper: {
    flexDirection: 'row'
  },
  numberWrapper: {
    backgroundColor: '#333333',
    margin: 3,
    shadowColor: '#1f1f1f',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 2,
    shadowOpacity: 1,
    elevation: 5
  },
  card: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#1f1f1f',
    overflow: 'hidden'
  },
  overflowContainer: {
    overflow: 'hidden'
  },
  number: {
    fontWeight: '700',
    color: '#cccccc'
  },
  flipCard: {
    position: 'absolute',
    left: 0,
    height: '50%',
    width: '100%',
    backgroundColor: '#333333',
    borderColor: '#1f1f1f',
    backfaceVisibility: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  separator: {
    marginHorizontal: 5,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  circle: {
    height: 5,
    width: 5,
    borderRadius: 5,
    backgroundColor: '#333333'
  }
});

/**
 * Memory conservative (mutative) matrix math utilities. Uses "command"
 * matrices, which are reusable.
 */
var MatrixMath = {
  createIdentityMatrix: function createIdentityMatrix() {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  },
  createCopy: function createCopy(m) {
    return [m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[10], m[11], m[12], m[13], m[14], m[15]];
  },
  createOrthographic: function createOrthographic(left, right, bottom, top, near, far) {
    var a = 2 / (right - left);
    var b = 2 / (top - bottom);
    var c = -2 / (far - near);
    var tx = -(right + left) / (right - left);
    var ty = -(top + bottom) / (top - bottom);
    var tz = -(far + near) / (far - near);
    return [a, 0, 0, 0, 0, b, 0, 0, 0, 0, c, 0, tx, ty, tz, 1];
  },
  createFrustum: function createFrustum(left, right, bottom, top, near, far) {
    var r_width = 1 / (right - left);
    var r_height = 1 / (top - bottom);
    var r_depth = 1 / (near - far);
    var x = 2 * (near * r_width);
    var y = 2 * (near * r_height);
    var A = (right + left) * r_width;
    var B = (top + bottom) * r_height;
    var C = (far + near) * r_depth;
    var D = 2 * (far * near * r_depth);
    return [x, 0, 0, 0, 0, y, 0, 0, A, B, C, -1, 0, 0, D, 0];
  },
  /**
   * This create a perspective projection towards negative z
   * Clipping the z range of [-near, -far]
   *
   * @param fovInRadians - field of view in radians
   */
  createPerspective: function createPerspective(fovInRadians, aspect, near, far) {
    var h = 1 / Math.tan(fovInRadians / 2);
    var r_depth = 1 / (near - far);
    var C = (far + near) * r_depth;
    var D = 2 * (far * near * r_depth);
    return [h / aspect, 0, 0, 0, 0, h, 0, 0, 0, 0, C, -1, 0, 0, D, 0];
  },
  createTranslate2d: function createTranslate2d(x, y) {
    var mat = MatrixMath.createIdentityMatrix();
    MatrixMath.reuseTranslate2dCommand(mat, x, y);
    return mat;
  },
  reuseTranslate2dCommand: function reuseTranslate2dCommand(matrixCommand, x, y) {
    matrixCommand[12] = x;
    matrixCommand[13] = y;
  },
  reuseTranslate3dCommand: function reuseTranslate3dCommand(matrixCommand, x, y, z) {
    matrixCommand[12] = x;
    matrixCommand[13] = y;
    matrixCommand[14] = z;
  },
  createScale: function createScale(factor) {
    var mat = MatrixMath.createIdentityMatrix();
    MatrixMath.reuseScaleCommand(mat, factor);
    return mat;
  },
  reuseScaleCommand: function reuseScaleCommand(matrixCommand, factor) {
    matrixCommand[0] = factor;
    matrixCommand[5] = factor;
  },
  reuseScale3dCommand: function reuseScale3dCommand(matrixCommand, x, y, z) {
    matrixCommand[0] = x;
    matrixCommand[5] = y;
    matrixCommand[10] = z;
  },
  reusePerspectiveCommand: function reusePerspectiveCommand(matrixCommand, p) {
    matrixCommand[11] = -1 / p;
  },
  reuseScaleXCommand: function reuseScaleXCommand(matrixCommand, factor) {
    matrixCommand[0] = factor;
  },
  reuseScaleYCommand: function reuseScaleYCommand(matrixCommand, factor) {
    matrixCommand[5] = factor;
  },
  reuseScaleZCommand: function reuseScaleZCommand(matrixCommand, factor) {
    matrixCommand[10] = factor;
  },
  reuseRotateXCommand: function reuseRotateXCommand(matrixCommand, radians) {
    matrixCommand[5] = Math.cos(radians);
    matrixCommand[6] = Math.sin(radians);
    matrixCommand[9] = -Math.sin(radians);
    matrixCommand[10] = Math.cos(radians);
  },
  reuseRotateYCommand: function reuseRotateYCommand(matrixCommand, amount) {
    matrixCommand[0] = Math.cos(amount);
    matrixCommand[2] = -Math.sin(amount);
    matrixCommand[8] = Math.sin(amount);
    matrixCommand[10] = Math.cos(amount);
  },
  // http://www.w3.org/TR/css3-transforms/#recomposing-to-a-2d-matrix
  reuseRotateZCommand: function reuseRotateZCommand(matrixCommand, radians) {
    matrixCommand[0] = Math.cos(radians);
    matrixCommand[1] = Math.sin(radians);
    matrixCommand[4] = -Math.sin(radians);
    matrixCommand[5] = Math.cos(radians);
  },
  createRotateZ: function createRotateZ(radians) {
    var mat = MatrixMath.createIdentityMatrix();
    MatrixMath.reuseRotateZCommand(mat, radians);
    return mat;
  },
  reuseSkewXCommand: function reuseSkewXCommand(matrixCommand, radians) {
    matrixCommand[4] = Math.tan(radians);
  },
  reuseSkewYCommand: function reuseSkewYCommand(matrixCommand, radians) {
    matrixCommand[1] = Math.tan(radians);
  },
  multiplyInto: function multiplyInto(out, a, b) {
    var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3],
      a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7],
      a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11],
      a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
    var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  },
  determinant: function determinant(matrix) {
    var m00 = matrix[0],
      m01 = matrix[1],
      m02 = matrix[2],
      m03 = matrix[3],
      m10 = matrix[4],
      m11 = matrix[5],
      m12 = matrix[6],
      m13 = matrix[7],
      m20 = matrix[8],
      m21 = matrix[9],
      m22 = matrix[10],
      m23 = matrix[11],
      m30 = matrix[12],
      m31 = matrix[13],
      m32 = matrix[14],
      m33 = matrix[15];
    return m03 * m12 * m21 * m30 - m02 * m13 * m21 * m30 - m03 * m11 * m22 * m30 + m01 * m13 * m22 * m30 + m02 * m11 * m23 * m30 - m01 * m12 * m23 * m30 - m03 * m12 * m20 * m31 + m02 * m13 * m20 * m31 + m03 * m10 * m22 * m31 - m00 * m13 * m22 * m31 - m02 * m10 * m23 * m31 + m00 * m12 * m23 * m31 + m03 * m11 * m20 * m32 - m01 * m13 * m20 * m32 - m03 * m10 * m21 * m32 + m00 * m13 * m21 * m32 + m01 * m10 * m23 * m32 - m00 * m11 * m23 * m32 - m02 * m11 * m20 * m33 + m01 * m12 * m20 * m33 + m02 * m10 * m21 * m33 - m00 * m12 * m21 * m33 - m01 * m10 * m22 * m33 + m00 * m11 * m22 * m33;
  },
  /**
   * Inverse of a matrix. Multiplying by the inverse is used in matrix math
   * instead of division.
   *
   * Formula from:
   * http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
   */
  inverse: function inverse(matrix) {
    var det = MatrixMath.determinant(matrix);
    if (!det) {
      return matrix;
    }
    var m00 = matrix[0],
      m01 = matrix[1],
      m02 = matrix[2],
      m03 = matrix[3],
      m10 = matrix[4],
      m11 = matrix[5],
      m12 = matrix[6],
      m13 = matrix[7],
      m20 = matrix[8],
      m21 = matrix[9],
      m22 = matrix[10],
      m23 = matrix[11],
      m30 = matrix[12],
      m31 = matrix[13],
      m32 = matrix[14],
      m33 = matrix[15];
    return [(m12 * m23 * m31 - m13 * m22 * m31 + m13 * m21 * m32 - m11 * m23 * m32 - m12 * m21 * m33 + m11 * m22 * m33) / det, (m03 * m22 * m31 - m02 * m23 * m31 - m03 * m21 * m32 + m01 * m23 * m32 + m02 * m21 * m33 - m01 * m22 * m33) / det, (m02 * m13 * m31 - m03 * m12 * m31 + m03 * m11 * m32 - m01 * m13 * m32 - m02 * m11 * m33 + m01 * m12 * m33) / det, (m03 * m12 * m21 - m02 * m13 * m21 - m03 * m11 * m22 + m01 * m13 * m22 + m02 * m11 * m23 - m01 * m12 * m23) / det, (m13 * m22 * m30 - m12 * m23 * m30 - m13 * m20 * m32 + m10 * m23 * m32 + m12 * m20 * m33 - m10 * m22 * m33) / det, (m02 * m23 * m30 - m03 * m22 * m30 + m03 * m20 * m32 - m00 * m23 * m32 - m02 * m20 * m33 + m00 * m22 * m33) / det, (m03 * m12 * m30 - m02 * m13 * m30 - m03 * m10 * m32 + m00 * m13 * m32 + m02 * m10 * m33 - m00 * m12 * m33) / det, (m02 * m13 * m20 - m03 * m12 * m20 + m03 * m10 * m22 - m00 * m13 * m22 - m02 * m10 * m23 + m00 * m12 * m23) / det, (m11 * m23 * m30 - m13 * m21 * m30 + m13 * m20 * m31 - m10 * m23 * m31 - m11 * m20 * m33 + m10 * m21 * m33) / det, (m03 * m21 * m30 - m01 * m23 * m30 - m03 * m20 * m31 + m00 * m23 * m31 + m01 * m20 * m33 - m00 * m21 * m33) / det, (m01 * m13 * m30 - m03 * m11 * m30 + m03 * m10 * m31 - m00 * m13 * m31 - m01 * m10 * m33 + m00 * m11 * m33) / det, (m03 * m11 * m20 - m01 * m13 * m20 - m03 * m10 * m21 + m00 * m13 * m21 + m01 * m10 * m23 - m00 * m11 * m23) / det, (m12 * m21 * m30 - m11 * m22 * m30 - m12 * m20 * m31 + m10 * m22 * m31 + m11 * m20 * m32 - m10 * m21 * m32) / det, (m01 * m22 * m30 - m02 * m21 * m30 + m02 * m20 * m31 - m00 * m22 * m31 - m01 * m20 * m32 + m00 * m21 * m32) / det, (m02 * m11 * m30 - m01 * m12 * m30 - m02 * m10 * m31 + m00 * m12 * m31 + m01 * m10 * m32 - m00 * m11 * m32) / det, (m01 * m12 * m20 - m02 * m11 * m20 + m02 * m10 * m21 - m00 * m12 * m21 - m01 * m10 * m22 + m00 * m11 * m22) / det];
  },
  /**
   * Turns columns into rows and rows into columns.
   */
  transpose: function transpose(m) {
    return [m[0], m[4], m[8], m[12], m[1], m[5], m[9], m[13], m[2], m[6], m[10], m[14], m[3], m[7], m[11], m[15]];
  },
  /**
   * Based on: http://tog.acm.org/resources/GraphicsGems/gemsii/unmatrix.c
   */
  multiplyVectorByMatrix: function multiplyVectorByMatrix(v, m) {
    var vx = v[0],
      vy = v[1],
      vz = v[2],
      vw = v[3];
    return [vx * m[0] + vy * m[4] + vz * m[8] + vw * m[12], vx * m[1] + vy * m[5] + vz * m[9] + vw * m[13], vx * m[2] + vy * m[6] + vz * m[10] + vw * m[14], vx * m[3] + vy * m[7] + vz * m[11] + vw * m[15]];
  },
  /**
   * From: https://code.google.com/p/webgl-mjs/source/browse/mjs.js
   */
  v3Length: function v3Length(a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
  },
  /**
   * Based on: https://code.google.com/p/webgl-mjs/source/browse/mjs.js
   */
  v3Normalize: function v3Normalize(vector, v3Length) {
    var im = 1 / (v3Length || MatrixMath.v3Length(vector));
    return [vector[0] * im, vector[1] * im, vector[2] * im];
  },
  /**
   * The dot product of a and b, two 3-element vectors.
   * From: https://code.google.com/p/webgl-mjs/source/browse/mjs.js
   */
  v3Dot: function v3Dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  },
  /**
   * From:
   * http://www.opensource.apple.com/source/WebCore/WebCore-514/platform/graphics/transforms/TransformationMatrix.cpp
   */
  v3Combine: function v3Combine(a, b, aScale, bScale) {
    return [aScale * a[0] + bScale * b[0], aScale * a[1] + bScale * b[1], aScale * a[2] + bScale * b[2]];
  },
  /**
   * From:
   * http://www.opensource.apple.com/source/WebCore/WebCore-514/platform/graphics/transforms/TransformationMatrix.cpp
   */
  v3Cross: function v3Cross(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  },
  /**
   * Based on:
   * http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToEuler/
   * and:
   * http://quat.zachbennett.com/
   *
   * Note that this rounds degrees to the thousandth of a degree, due to
   * floating point errors in the creation of the quaternion.
   *
   * Also note that this expects the qw value to be last, not first.
   *
   * Also, when researching this, remember that:
   * yaw   === heading            === z-axis
   * pitch === elevation/attitude === y-axis
   * roll  === bank               === x-axis
   */
  quaternionToDegreesXYZ: function quaternionToDegreesXYZ(q, matrix, row) {
    var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3];
    var qw2 = qw * qw;
    var qx2 = qx * qx;
    var qy2 = qy * qy;
    var qz2 = qz * qz;
    var test = qx * qy + qz * qw;
    var unit = qw2 + qx2 + qy2 + qz2;
    var conv = 180 / Math.PI;
    if (test > 0.49999 * unit) {
      return [0, 2 * Math.atan2(qx, qw) * conv, 90];
    }
    if (test < -0.49999 * unit) {
      return [0, -2 * Math.atan2(qx, qw) * conv, -90];
    }
    return [MatrixMath.roundTo3Places(Math.atan2(2 * qx * qw - 2 * qy * qz, 1 - 2 * qx2 - 2 * qz2) * conv), MatrixMath.roundTo3Places(Math.atan2(2 * qy * qw - 2 * qx * qz, 1 - 2 * qy2 - 2 * qz2) * conv), MatrixMath.roundTo3Places(Math.asin(2 * qx * qy + 2 * qz * qw) * conv)];
  },
  /**
   * Based on:
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
   */
  roundTo3Places: function roundTo3Places(n) {
    var arr = n.toString().split("e");
    return Math.round(arr[0] + "e" + (arr[1] ? +arr[1] - 3 : 3)) * 0.001;
  },
  /**
   * Decompose a matrix into separate transform values, for use on platforms
   * where applying a precomposed matrix is not possible, and transforms are
   * applied in an inflexible ordering (e.g. Android).
   *
   * Implementation based on
   * http://www.w3.org/TR/css3-transforms/#decomposing-a-2d-matrix
   * http://www.w3.org/TR/css3-transforms/#decomposing-a-3d-matrix
   * which was based on
   * http://tog.acm.org/resources/GraphicsGems/gemsii/unmatrix.c
   */
  decomposeMatrix: function decomposeMatrix(transformMatrix) {
    invariant(transformMatrix.length === 16, "Matrix decomposition needs a list of 3d matrix values, received %s", transformMatrix);

    // output values
    var perspective = [];
    var quaternion = [];
    var scale = [];
    var skew = [];
    var translation = [];

    // create normalized, 2d array matrix
    // and normalized 1d array perspectiveMatrix with redefined 4th column
    if (!transformMatrix[15]) {
      return;
    }
    var matrix = [];
    var perspectiveMatrix = [];
    for (var i = 0; i < 4; i++) {
      matrix.push([]);
      for (var j = 0; j < 4; j++) {
        var value = transformMatrix[i * 4 + j] / transformMatrix[15];
        matrix[i].push(value);
        perspectiveMatrix.push(j === 3 ? 0 : value);
      }
    }
    perspectiveMatrix[15] = 1;

    // test for singularity of upper 3x3 part of the perspective matrix
    if (!MatrixMath.determinant(perspectiveMatrix)) {
      return;
    }

    // isolate perspective
    if (matrix[0][3] !== 0 || matrix[1][3] !== 0 || matrix[2][3] !== 0) {
      // rightHandSide is the right hand side of the equation.
      // rightHandSide is a vector, or point in 3d space relative to the origin.
      var rightHandSide = [matrix[0][3], matrix[1][3], matrix[2][3], matrix[3][3]];

      // Solve the equation by inverting perspectiveMatrix and multiplying
      // rightHandSide by the inverse.
      var inversePerspectiveMatrix = MatrixMath.inverse(perspectiveMatrix);
      var transposedInversePerspectiveMatrix = MatrixMath.transpose(inversePerspectiveMatrix);
      perspective = MatrixMath.multiplyVectorByMatrix(rightHandSide, transposedInversePerspectiveMatrix);
    } else {
      // no perspective
      perspective[0] = perspective[1] = perspective[2] = 0;
      perspective[3] = 1;
    }

    // translation is simple
    for (var _i = 0; _i < 3; _i++) {
      translation[_i] = matrix[3][_i];
    }

    // Now get scale and shear.
    // 'row' is a 3 element array of 3 component vectors
    var row = [];
    for (var _i2 = 0; _i2 < 3; _i2++) {
      row[_i2] = [matrix[_i2][0], matrix[_i2][1], matrix[_i2][2]];
    }

    // Compute X scale factor and normalize first row.
    scale[0] = MatrixMath.v3Length(row[0]);
    row[0] = MatrixMath.v3Normalize(row[0], scale[0]);

    // Compute XY shear factor and make 2nd row orthogonal to 1st.
    skew[0] = MatrixMath.v3Dot(row[0], row[1]);
    row[1] = MatrixMath.v3Combine(row[1], row[0], 1.0, -skew[0]);

    // Now, compute Y scale and normalize 2nd row.
    scale[1] = MatrixMath.v3Length(row[1]);
    row[1] = MatrixMath.v3Normalize(row[1], scale[1]);
    skew[0] /= scale[1];

    // Compute XZ and YZ shears, orthogonalize 3rd row
    skew[1] = MatrixMath.v3Dot(row[0], row[2]);
    row[2] = MatrixMath.v3Combine(row[2], row[0], 1.0, -skew[1]);
    skew[2] = MatrixMath.v3Dot(row[1], row[2]);
    row[2] = MatrixMath.v3Combine(row[2], row[1], 1.0, -skew[2]);

    // Next, get Z scale and normalize 3rd row.
    scale[2] = MatrixMath.v3Length(row[2]);
    row[2] = MatrixMath.v3Normalize(row[2], scale[2]);
    skew[1] /= scale[2];
    skew[2] /= scale[2];

    // At this point, the matrix (in rows) is orthonormal.
    // Check for a coordinate system flip.  If the determinant
    // is -1, then negate the matrix and the scaling factors.
    var pdum3 = MatrixMath.v3Cross(row[1], row[2]);
    if (MatrixMath.v3Dot(row[0], pdum3) < 0) {
      for (var _i3 = 0; _i3 < 3; _i3++) {
        scale[_i3] *= -1;
        row[_i3][0] *= -1;
        row[_i3][1] *= -1;
        row[_i3][2] *= -1;
      }
    }

    // Now, get the rotations out
    quaternion[0] = 0.5 * Math.sqrt(Math.max(1 + row[0][0] - row[1][1] - row[2][2], 0));
    quaternion[1] = 0.5 * Math.sqrt(Math.max(1 - row[0][0] + row[1][1] - row[2][2], 0));
    quaternion[2] = 0.5 * Math.sqrt(Math.max(1 - row[0][0] - row[1][1] + row[2][2], 0));
    quaternion[3] = 0.5 * Math.sqrt(Math.max(1 + row[0][0] + row[1][1] + row[2][2], 0));
    if (row[2][1] > row[1][2]) {
      quaternion[0] = -quaternion[0];
    }
    if (row[0][2] > row[2][0]) {
      quaternion[1] = -quaternion[1];
    }
    if (row[1][0] > row[0][1]) {
      quaternion[2] = -quaternion[2];
    }

    // correct for occasional, weird Euler synonyms for 2d rotation
    var rotationDegrees;
    if (quaternion[0] < 0.001 && quaternion[0] >= 0 && quaternion[1] < 0.001 && quaternion[1] >= 0) {
      // this is a 2d rotation on the z-axis
      rotationDegrees = [0, 0, MatrixMath.roundTo3Places(Math.atan2(row[0][1], row[0][0]) * 180 / Math.PI)];
    } else {
      rotationDegrees = MatrixMath.quaternionToDegreesXYZ(quaternion, matrix, row);
    }

    // expose both base data and convenience names
    return {
      rotationDegrees: rotationDegrees,
      perspective: perspective,
      quaternion: quaternion,
      scale: scale,
      skew: skew,
      translation: translation,
      rotate: rotationDegrees[2],
      rotateX: rotationDegrees[0],
      rotateY: rotationDegrees[1],
      scaleX: scale[0],
      scaleY: scale[1],
      translateX: translation[0],
      translateY: translation[1]
    };
  }
};
var MatrixMath_1 = MatrixMath;

/* eslint-disable no-bitwise, radix, no-param-reassign */
var createIdentityMatrix = MatrixMath_1.createIdentityMatrix;
var multiplyInto = MatrixMath_1.multiplyInto;
/**
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/PI
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cos
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sin
 *  https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotateX
 * */
function rotateXMatrix(matrix, deg) {
  var rad = Math.PI / 180 * deg;
  var cos = Math.cos(rad);
  var sin = Math.sin(rad);
  var rotate = [1, 0, 0, 0, 0, cos, -sin, 0, 0, sin, cos, 0, 0, 0, 0, 1];
  multiplyInto(matrix, matrix, rotate);
}

/**
 *  https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/perspective
 * */
function perspectiveMatrix(matrix, value) {
  var perspective = createIdentityMatrix();
  MatrixMath_1.reusePerspectiveCommand(perspective, value);
  multiplyInto(matrix, matrix, perspective);
}

/**
 *  https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate
 * */
function translateMatrix(matrix, origin) {
  var x = origin.x,
    y = origin.y,
    z = origin.z;
  var translate = createIdentityMatrix();
  MatrixMath_1.reuseTranslate3dCommand(translate, x, y, z);
  multiplyInto(matrix, translate, matrix);
}
function untranslateMatrix(matrix, origin) {
  var x = origin.x,
    y = origin.y,
    z = origin.z;
  var unTranslate = createIdentityMatrix();
  MatrixMath_1.reuseTranslate3dCommand(unTranslate, -x, -y, -z);
  multiplyInto(matrix, matrix, unTranslate);
}
function formatTime(hours, minutes, seconds) {
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
}
function convertNumberToTime(number) {
  var secNum = parseInt(number);
  var hours = Math.floor(secNum / 3600);
  var minutes = Math.floor((secNum - hours * 3600) / 60);
  var seconds = secNum - hours * 3600 - minutes * 60;
  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
}

// Convert timestamp or Date to internal hours, minutes and seconds
function convertDateToTime(time) {
  var now = Date.now();
  // eslint-disable-next-line no-nested-ternary
  var target = typeof time === 'number' ? time : time instanceof Date ? time.getTime() : 0;
  var delta = Math.round((target - now) / 1000);
  if (delta <= 0) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  }
  return convertNumberToTime(delta);
}
function subtractTime(hours, minutes, seconds) {
  seconds -= 1;
  if (seconds < 0) {
    if (minutes <= 0 && hours <= 0) {
      minutes = 0;
      seconds = 0;
    } else {
      minutes -= 1;
      seconds = 59;
    }
  }
  if (minutes < 0) {
    if (hours <= 0) {
      hours = 0;
      minutes = 0;
    } else {
      hours -= 1;
      minutes = 59;
    }
  }
  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
}
var TransformUtil = {
  createIdentityMatrix: createIdentityMatrix,
  multiplyInto: multiplyInto,
  rotateXMatrix: rotateXMatrix,
  perspectiveMatrix: perspectiveMatrix,
  translateMatrix: translateMatrix,
  untranslateMatrix: untranslateMatrix,
  convertNumberToTime: convertNumberToTime,
  convertDateToTime: convertDateToTime,
  subtractTime: subtractTime,
  formatTime: formatTime
};

function FlipCard(_ref) {
  var setRef = _ref.setRef,
    type = _ref.type,
    size = _ref.size,
    number = _ref.number,
    flipCardStyle = _ref.flipCardStyle,
    numberStyle = _ref.numberStyle;
  return React.createElement(Animated.View, {
    ref: setRef,
    style: [style.flipCard, type === 'front' ? {
      top: 0,
      borderTopLeftRadius: size / 10,
      borderTopRightRadius: size / 10,
      borderBottomWidth: 0.5
    } : {
      top: '50%',
      borderBottomLeftRadius: size / 10,
      borderBottomRightRadius: size / 10,
      borderTopWidth: 0.5
    }, flipCardStyle]
  }, React.createElement(View, {
    style: style.overflowContainer
  }, React.createElement(Text, {
    style: [style.number, {
      transform: [type === 'front' ? {
        translateY: size * 0.3
      } : {
        translateY: -size * 0.3
      }],
      fontSize: size / 1.5,
      lineHeight: size / 1.5
    }, numberStyle]
  }, number)));
}
FlipCard.defaultProps = {
  flipCardStyle: {},
  numberStyle: {}
};
FlipCard.propTypes = {
  setRef: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  flipCardStyle: PropTypes.object,
  numberStyle: PropTypes.object
};

function Card(_ref) {
  var type = _ref.type,
    size = _ref.size,
    number = _ref.number,
    cardStyle = _ref.cardStyle,
    numberStyle = _ref.numberStyle;
  return React.createElement(View, {
    style: [style.card, type === 'upper' ? {
      borderBottomWidth: 0.5
    } : {
      borderTopWidth: 0.5
    }, cardStyle]
  }, React.createElement(Text, {
    style: [style.number, {
      transform: [type === 'upper' ? {
        translateY: size * 0.3
      } : {
        translateY: -size * 0.3
      }],
      fontSize: size / 1.5,
      lineHeight: size / 1.5
    }, numberStyle]
  }, number));
}
Card.defaultProps = {
  cardStyle: {},
  numberStyle: {}
};
Card.propTypes = {
  type: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  cardStyle: PropTypes.object,
  numberStyle: PropTypes.object
};

var _Dimensions$get = Dimensions.get('window'),
  width = _Dimensions$get.width;
var NumberCard = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(NumberCard, _React$Component);
  function NumberCard(props) {
    var _this;
    _this = _React$Component.call(this, props) || this;
    _defineProperty(_assertThisInitialized(_this), "setFrontRef", function (ref) {
      _this.frontRef = ref;
    });
    _defineProperty(_assertThisInitialized(_this), "setBackRef", function (ref) {
      _this.backRef = ref;
    });
    _defineProperty(_assertThisInitialized(_this), "animateTick", function () {
      _this.rotateFront.setValue(0);
      _this.rotateBack.setValue(-180);
      Animated.parallel([Animated.timing(_this.rotateFront, {
        toValue: 180,
        duration: 800,
        useNativeDriver: true
      }), Animated.timing(_this.rotateBack, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true
      })]).start();
    });
    _defineProperty(_assertThisInitialized(_this), "transformRef", function (ref, deg, y) {
      var perspective = _this.props.perspective;
      var matrix = TransformUtil.createIdentityMatrix();
      TransformUtil.translateMatrix(matrix, {
        x: 0,
        y: y,
        z: 0
      });
      TransformUtil.perspectiveMatrix(matrix, perspective);
      TransformUtil.rotateXMatrix(matrix, deg);
      TransformUtil.untranslateMatrix(matrix, {
        x: 0,
        y: y,
        z: 0
      });
      if (ref) {
        ref.setNativeProps({
          style: {
            transform: [{
              matrix: matrix
            }]
          }
        });
      }
    });
    _this.rotateFront = new Animated.Value(0);
    _this.rotateBack = new Animated.Value(-180);
    _this.frontRef = null;
    _this.backRef = null;
    return _this;
  }
  var _proto = NumberCard.prototype;
  _proto.componentDidMount = function componentDidMount() {
    var _this2 = this;
    var size = this.props.size;
    this.rotateFront.addListener(function (_ref) {
      var value = _ref.value;
      _this2.transformRef(_this2.frontRef, value, size * 0.3);
    });
    this.rotateBack.addListener(function (_ref2) {
      var value = _ref2.value;
      _this2.transformRef(_this2.backRef, value, -size * 0.3);
    });
  };
  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    var previousNumber = this.props.previousNumber;
    if (nextProps.previousNumber !== previousNumber) {
      this.animateTick();
    }
    return true;
  };
  _proto.render = function render() {
    var _this$props = this.props,
      number = _this$props.number,
      previousNumber = _this$props.previousNumber,
      size = _this$props.size,
      numberWrapperStyle = _this$props.numberWrapperStyle,
      cardStyle = _this$props.cardStyle,
      flipCardStyle = _this$props.flipCardStyle,
      numberStyle = _this$props.numberStyle;
    return React.createElement(View, {
      style: [style.numberWrapper, {
        width: size * 0.8,
        height: size * 1.2,
        borderRadius: size / 10
      }, numberWrapperStyle]
    }, React.createElement(Card, {
      type: "upper",
      size: size,
      number: previousNumber,
      cardStyle: cardStyle,
      numberStyle: numberStyle
    }), React.createElement(Card, {
      type: "lower",
      size: size,
      number: number,
      cardStyle: cardStyle,
      numberStyle: numberStyle
    }), React.createElement(FlipCard, {
      setRef: this.setFrontRef,
      type: "front",
      size: size,
      number: number,
      flipCardStyle: flipCardStyle,
      numberStyle: numberStyle
    }), React.createElement(FlipCard, {
      setRef: this.setBackRef,
      type: "back",
      size: size,
      number: previousNumber,
      flipCardStyle: flipCardStyle,
      numberStyle: numberStyle
    }));
  };
  return NumberCard;
}(React.Component);
NumberCard.defaultProps = {
  size: width / 6,
  perspective: 250
};
NumberCard.propTypes = {
  number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  previousNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  perspective: PropTypes.number,
  size: PropTypes.number,
  numberWrapperStyle: PropTypes.object,
  cardStyle: PropTypes.object,
  flipCardStyle: PropTypes.object,
  numberStyle: PropTypes.object
};

/* eslint-disable no-param-reassign, radix */
function FlipNumber(_ref) {
  var number = _ref.number,
    unit = _ref.unit,
    flip = _ref.flip,
    size = _ref.size,
    perspective = _ref.perspective,
    numberWrapperStyle = _ref.numberWrapperStyle,
    cardStyle = _ref.cardStyle,
    flipCardStyle = _ref.flipCardStyle,
    numberStyle = _ref.numberStyle,
    firstRender = _ref.firstRender;
  var previousNumber = number + (flip ? 1 : 0);
  if (firstRender) {
    previousNumber = number;
  } else if (unit !== 'hours') {
    previousNumber = previousNumber === 60 ? 0 : previousNumber;
  } else {
    previousNumber = previousNumber === 24 ? 0 : previousNumber;
  }
  var numberDisplay = number < 10 ? "0" + number : String(number);
  var previousNumberDisplay = previousNumber < 10 ? "0" + previousNumber : String(previousNumber);
  var numberSplit = numberDisplay.split('');
  var previousNumberSplit = previousNumberDisplay.split('');
  return React.createElement(View, {
    style: style.wrapper
  }, React.createElement(NumberCard, {
    number: previousNumberSplit[0],
    previousNumber: numberSplit[0],
    size: size,
    perspective: perspective,
    numberWrapperStyle: numberWrapperStyle,
    cardStyle: cardStyle,
    flipCardStyle: flipCardStyle,
    numberStyle: numberStyle
  }), React.createElement(NumberCard, {
    number: previousNumberSplit[1],
    previousNumber: numberSplit[1],
    size: size,
    perspective: perspective,
    numberWrapperStyle: numberWrapperStyle,
    cardStyle: cardStyle,
    flipCardStyle: flipCardStyle,
    numberStyle: numberStyle
  }));
}
FlipNumber.defaultProps = {
  unit: 'seconds'
};
FlipNumber.propTypes = {
  number: PropTypes.number.isRequired,
  unit: PropTypes.oneOf(['hours', 'minutes', 'seconds']),
  flip: PropTypes.bool,
  size: PropTypes.number,
  perspective: PropTypes.number,
  numberWrapperStyle: PropTypes.object,
  cardStyle: PropTypes.object,
  flipCardStyle: PropTypes.object,
  numberStyle: PropTypes.object,
  firstRender: PropTypes.bool
};

function Separator() {
  return React.createElement(View, {
    style: style.separator
  }, React.createElement(View, {
    style: style.circle
  }), React.createElement(View, {
    style: style.circle
  }));
}

var CountdownTimer = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(CountdownTimer, _React$Component);
  function CountdownTimer(props) {
    var _this;
    _this = _React$Component.call(this, props) || this;
    _defineProperty(_assertThisInitialized(_this), "updateTime", function () {
      _this.initialTime = false;
      var _this$state = _this.state,
        hours = _this$state.hours,
        minutes = _this$state.minutes,
        seconds = _this$state.seconds;
      if (hours || minutes || seconds) {
        var onComplete = _this.props.onComplete;
        var newState = TransformUtil.subtractTime(hours, minutes, seconds);
        _this.setState(function (prevState) {
          return _extends({}, prevState, newState);
        });
        if (newState.hours === 0 && newState.minutes === 0 && newState.seconds === 0) {
          clearInterval(_this.timer);
          setTimeout(onComplete, 800); // Delay the `onComplete` callback the animation duration
        }
      } else if (!hours && !minutes && !seconds) {
        clearInterval(_this.timer);
      }
    });
    var _this$props = _this.props,
      duration = _this$props.duration,
      time = _this$props.time;
    var _ref = time !== undefined ? TransformUtil.convertDateToTime(time) : TransformUtil.convertNumberToTime(duration),
      _hours = _ref.hours,
      _minutes = _ref.minutes,
      _seconds = _ref.seconds;
    _this.state = {
      hours: _hours,
      minutes: _minutes,
      seconds: _seconds
    };
    _this.initialTime = true;
    return _this;
  }
  var _proto = CountdownTimer.prototype;
  _proto.componentDidMount = function componentDidMount() {
    var _this$state2 = this.state,
      hours = _this$state2.hours,
      minutes = _this$state2.minutes,
      seconds = _this$state2.seconds;
    var play = this.props.play;
    if ((hours || minutes || seconds) && play) {
      this.timer = setInterval(this.updateTime, 1000);
    }
  };
  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    var _this$props2 = this.props,
      time = _this$props2.time,
      duration = _this$props2.duration,
      play = _this$props2.play;
    if (nextProps.time !== time || nextProps.duration !== duration) {
      clearInterval(this.timer);
      var newState = nextProps.time !== time ? TransformUtil.convertDateToTime(nextProps.time) : TransformUtil.convertNumberToTime(nextProps.duration);
      this.initialTime = true;
      this.setState(newState);
      this.timer = setInterval(this.updateTime, 1000);
    }
    if (nextProps.play !== play) {
      clearInterval(this.timer);
      if (nextProps.play) {
        this.timer = setInterval(this.updateTime, 1000);
      }
    }
    return true;
  };
  _proto.componentWillUnmount = function componentWillUnmount() {
    clearInterval(this.timer);
  };
  _proto.render = function render() {
    var _this$props3 = this.props,
      wrapperStyle = _this$props3.wrapperStyle,
      flipNumberProps = _this$props3.flipNumberProps,
      unitsToShow = _this$props3.unitsToShow,
      separators = _this$props3.separators;
    var _this$state3 = this.state,
      hours = _this$state3.hours,
      minutes = _this$state3.minutes,
      seconds = _this$state3.seconds;
    var showHours = unitsToShow.includes('H');
    var showMinutes = unitsToShow.includes('M');
    var showSeconds = unitsToShow.includes('S');
    return React.createElement(View, {
      style: [style.wrapper, wrapperStyle]
    }, showHours && React.createElement(React.Fragment, null, React.createElement(FlipNumber, _extends({
      number: hours,
      unit: "hours",
      flip: minutes === 59,
      firstRender: this.initialTime
    }, flipNumberProps)), separators && React.createElement(Separator, null)), showMinutes && React.createElement(React.Fragment, null, React.createElement(FlipNumber, _extends({
      number: minutes,
      unit: "minutes",
      flip: seconds === 59,
      firstRender: this.initialTime
    }, flipNumberProps)), separators && React.createElement(Separator, null)), showSeconds && React.createElement(FlipNumber, _extends({
      number: seconds,
      unit: "seconds",
      flip: true,
      firstRender: this.initialTime
    }, flipNumberProps)));
  };
  return CountdownTimer;
}(React.Component);
CountdownTimer.defaultProps = {
  play: true,
  wrapperStyle: {},
  onComplete: function onComplete() {},
  separators: true,
  unitsToShow: ['H', 'M', 'S']
};
CountdownTimer.propTypes = {
  duration: PropTypes.number,
  time: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]),
  play: PropTypes.bool,
  wrapperStyle: PropTypes.object,
  flipNumberProps: PropTypes.shape({
    size: PropTypes.number,
    perspective: PropTypes.number,
    numberWrapperStyle: PropTypes.object,
    cardStyle: PropTypes.object,
    flipCardStyle: PropTypes.object,
    numberStyle: PropTypes.object
  }),
  onComplete: PropTypes.func,
  separators: PropTypes.bool,
  unitsToShow: PropTypes.arrayOf(PropTypes.string)
};

export { CountdownTimer, FlipNumber };
//# sourceMappingURL=react-native-flip-countdown-timer.esm.js.map
