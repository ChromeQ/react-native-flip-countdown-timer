import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import FlipNumber from './flip-number';
import Separator from './flip-number/separator';

import TransformUtils from '../utils';

import style from './style';

class CountdownTimer extends React.Component {
  state = {
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  componentDidMount() {
    const { time } = this.props;
    const { hours, minutes, seconds } = TransformUtils.formatNumberToTime(time);
    this.setState({
      hours,
      minutes,
      seconds,
    });
    this.timer = setInterval(() => this.updateTime(), 1000);
  }

  shouldComponentUpdate(nextProps) {
    const { play } = this.props;
    if (nextProps.play !== play) {
      if (nextProps.play) {
        this.timer = setInterval(() => this.updateTime(), 1000);
      } else {
        clearInterval(this.timer);
      }
    }
    return true;
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  updateTime = () => {
    const { hours, minutes, seconds } = this.state;
    const { onFinish } = this.props;
    const newState = TransformUtils.subtractTime(hours, minutes, seconds);
    this.setState(prevState => ({ ...prevState, ...newState }));

    if (
      newState.hours === 0
      && newState.minutes === 0
      && newState.seconds === 0
    ) {
      clearInterval(this.timer);
      onFinish();
    }
  };

  render() {
    const {
      wrapperStyle, flipNumberProps, unitsToShow, separators,
    } = this.props;
    const { hours, minutes, seconds } = this.state;
    const showHours = !!hours && unitsToShow.includes('H');
    const showMinutes = !!minutes && unitsToShow.includes('M');
    const showSeconds = !!seconds && unitsToShow.includes('S');

    return (
      <View style={[style.wrapper, wrapperStyle]}>
        {showHours && (
          <FlipNumber
            number={hours}
            flippable={hours !== 0}
            unit="hours"
            {...flipNumberProps}
          />
        )}
        {separators && <Separator />}
        {showMinutes && (
          <FlipNumber
            number={minutes}
            flippable={hours !== 0}
            unit="minutes"
            {...flipNumberProps}
          />
        )}
        {separators && <Separator />}
        {showSeconds && (
          <FlipNumber
            number={seconds}
            flippable={minutes !== 0 || hours !== 0}
            unit="seconds"
            {...flipNumberProps}
          />
        )}
      </View>
    );
  }
}

CountdownTimer.defaultProps = {
  play: true,
  wrapperStyle: {},
  onFinish: () => {},
  separators: true,
  unitsToShow: ['H', 'M', 'S'],
};

CountdownTimer.propTypes = {
  time: PropTypes.number.isRequired,
  play: PropTypes.bool,
  wrapperStyle: PropTypes.object,
  flipNumberProps: PropTypes.shape({
    size: PropTypes.number,
    perspective: PropTypes.number,
    numberWrapperStyle: PropTypes.object,
    cardStyle: PropTypes.object,
    flipCardStyle: PropTypes.object,
    numberStyle: PropTypes.object,
  }),
  onFinish: PropTypes.func,
  separators: PropTypes.bool,
  unitsToShow: PropTypes.arrayOf(PropTypes.string),
};

export default CountdownTimer;
