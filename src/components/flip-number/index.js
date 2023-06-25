/* eslint-disable no-param-reassign, radix */
import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import NumberCard from './number-card';

import style from '../style';

function FlipNumber({
  number,
  unit,
  flip,
  size,
  perspective,
  numberWrapperStyle,
  cardStyle,
  flipCardStyle,
  numberStyle,
  firstRender,
}) {
  let previousNumber = number + (flip ? 1 : 0);

  if (firstRender) {
    previousNumber = number;
  } else if (unit !== 'hours') {
    previousNumber = previousNumber === 60 ? 0 : previousNumber;
  } else {
    previousNumber = previousNumber === 24 ? 0 : previousNumber;
  }

  const numberDisplay = number < 10 ? `0${number}` : String(number);
  const previousNumberDisplay = previousNumber < 10 ? `0${previousNumber}` : String(previousNumber);
  const numberSplit = numberDisplay.split('');
  const previousNumberSplit = previousNumberDisplay.split('');

  return (
    <View style={style.wrapper}>
      <NumberCard
        number={previousNumberSplit[0]}
        previousNumber={numberSplit[0]}
        size={size}
        perspective={perspective}
        numberWrapperStyle={numberWrapperStyle}
        cardStyle={cardStyle}
        flipCardStyle={flipCardStyle}
        numberStyle={numberStyle}
      />
      <NumberCard
        number={previousNumberSplit[1]}
        previousNumber={numberSplit[1]}
        size={size}
        perspective={perspective}
        numberWrapperStyle={numberWrapperStyle}
        cardStyle={cardStyle}
        flipCardStyle={flipCardStyle}
        numberStyle={numberStyle}
      />
    </View>
  );
}

FlipNumber.defaultProps = {
  unit: 'seconds',
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
  firstRender: PropTypes.bool,
};

export default FlipNumber;
