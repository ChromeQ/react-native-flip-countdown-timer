import React from 'react';
import { StyleSheet, Animated, View, Text, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import MatrixMath from 'react-native/Libraries/Utilities/MatrixMath';

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

/* eslint-disable no-bitwise, radix, no-param-reassign */
var createIdentityMatrix = MatrixMath.createIdentityMatrix;
var multiplyInto = MatrixMath.multiplyInto;
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
  MatrixMath.reusePerspectiveCommand(perspective, value);
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
  MatrixMath.reuseTranslate3dCommand(translate, x, y, z);
  multiplyInto(matrix, translate, matrix);
}
function untranslateMatrix(matrix, origin) {
  var x = origin.x,
    y = origin.y,
    z = origin.z;
  var unTranslate = createIdentityMatrix();
  MatrixMath.reuseTranslate3dCommand(unTranslate, -x, -y, -z);
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
