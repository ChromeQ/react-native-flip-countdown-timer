import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import FlipNumber from './flip-number';
import Separator from './flip-number/separator';

import TransformUtils from '../utils';

import style from './style';

class CountdownTimer extends React.Component {
  constructor(props) {
    super(props);

    const { time } = this.props;
    const { hours, minutes, seconds } = TransformUtils.convertNumberToTime(time);

    this.state = {
      hours,
      minutes,
      seconds,
    };
    this.initialTime = true;
  }

  componentDidMount() {
    this.timer = setInterval(this.updateTime, 1000);
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
    this.initialTime = false;
    const { hours, minutes, seconds } = this.state;
    const { onComplete } = this.props;
    const newState = TransformUtils.subtractTime(hours, minutes, seconds);
    this.setState(prevState => ({ ...prevState, ...newState }));

    if (
      newState.hours === 0
      && newState.minutes === 0
      && newState.seconds === 0
    ) {
      clearInterval(this.timer);
      // Delay the `onComplete` callback the animation duration
      setTimeout(onComplete, 800);
    }
  };

  render() {
    const {
      wrapperStyle, flipNumberProps, unitsToShow, separators,
    } = this.props;
    const { hours, minutes, seconds } = this.state;
    const showHours = unitsToShow.includes('H');
    const showMinutes = unitsToShow.includes('M');
    const showSeconds = unitsToShow.includes('S');

    return (
      <View style={[style.wrapper, wrapperStyle]}>
        {showHours && (
          <>
            <FlipNumber
              number={hours}
              unit="hours"
              flip={minutes === 59}
              firstRender={this.initialTime}
              {...flipNumberProps}
            />
            {separators && <Separator />}
          </>
        )}

        {showMinutes && (
          <>
            <FlipNumber
              number={minutes}
              unit="minutes"
              flip={seconds === 59}
              firstRender={this.initialTime}
              {...flipNumberProps}
            />
            {separators && <Separator />}
          </>
        )}

        {showSeconds && (
          <FlipNumber
            number={seconds}
            unit="seconds"
            flip
            firstRender={this.initialTime}
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
  onComplete: () => {},
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
  onComplete: PropTypes.func,
  separators: PropTypes.bool,
  unitsToShow: PropTypes.arrayOf(PropTypes.string),
};

export default CountdownTimer;
