/* eslint-disable no-bitwise, radix, no-param-reassign */
/**
 * https://github.com/facebook/react-native/blob/master/Libraries/Utilities/MatrixMath.js
 * */
import MatrixMath from 'react-native/Libraries/Utilities/MatrixMath';

const { createIdentityMatrix } = MatrixMath;
const { multiplyInto } = MatrixMath;
/**
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/PI
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cos
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sin
 *  https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotateX
 * */
function rotateXMatrix(matrix, deg) {
  const rad = (Math.PI / 180) * deg;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const rotate = [1, 0, 0, 0, 0, cos, -sin, 0, 0, sin, cos, 0, 0, 0, 0, 1];
  multiplyInto(matrix, matrix, rotate);
}

/**
 *  https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/perspective
 * */
function perspectiveMatrix(matrix, value) {
  const perspective = createIdentityMatrix();
  MatrixMath.reusePerspectiveCommand(perspective, value);
  multiplyInto(matrix, matrix, perspective);
}

/**
 *  https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate
 * */
function translateMatrix(matrix, origin) {
  const { x, y, z } = origin;
  const translate = createIdentityMatrix();
  MatrixMath.reuseTranslate3dCommand(translate, x, y, z);
  multiplyInto(matrix, translate, matrix);
}

function untranslateMatrix(matrix, origin) {
  const { x, y, z } = origin;
  const unTranslate = createIdentityMatrix();
  MatrixMath.reuseTranslate3dCommand(unTranslate, -x, -y, -z);
  multiplyInto(matrix, matrix, unTranslate);
}

function formatTime(hours, minutes, seconds) {
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return { hours, minutes, seconds };
}

function convertNumberToTime(number) {
  const secNum = parseInt(number);
  const hours = Math.floor(secNum / 3600);
  const minutes = Math.floor((secNum - hours * 3600) / 60);
  const seconds = secNum - hours * 3600 - minutes * 60;
  return { hours, minutes, seconds };
}

// Convert timestamp or Date to internal hours, minutes and seconds
function convertDateToTime(time) {
  const now = Date.now();
  // eslint-disable-next-line no-nested-ternary
  const target = typeof time === 'number' ? time : time instanceof Date ? time.getTime() : 0;

  const delta = Math.round((target - now) / 1000);

  if (delta <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
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

  return { hours, minutes, seconds };
}

export default {
  createIdentityMatrix,
  multiplyInto,
  rotateXMatrix,
  perspectiveMatrix,
  translateMatrix,
  untranslateMatrix,
  convertNumberToTime,
  convertDateToTime,
  subtractTime,
  formatTime,
};
