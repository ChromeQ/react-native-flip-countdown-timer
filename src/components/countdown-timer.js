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

    const { duration, time } = this.props;
    const { hours, minutes, seconds } = time
      ? TransformUtils.convertDateToTime(time)
      : TransformUtils.convertNumberToTime(duration);

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
        this.timer = setInterval(this.updateTime, 1000);
      } else {
        clearInterval(this.timer);
      }
    }
    return true;
  }

  componentDidUpdate(prevProps) {
    const { time, duration } = this.props;

    if (time !== prevProps.time || duration !== prevProps.duration) {
      clearInterval(this.timer);

      const newState = time !== prevProps.time
        ? TransformUtils.convertDateToTime(time)
        : TransformUtils.convertNumberToTime(duration);

      this.initialTime = true;
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(newState);
      this.timer = setInterval(this.updateTime, 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  updateTime = () => {
    this.initialTime = false;
    const { hours, minutes, seconds } = this.state;

    if (hours || minutes || seconds) {
      const { onComplete } = this.props;
      const newState = TransformUtils.subtractTime(hours, minutes, seconds);

      this.setState(prevState => ({ ...prevState, ...newState }));

      if (
        newState.hours === 0
        && newState.minutes === 0
        && newState.seconds === 0
      ) {
        clearInterval(this.timer);
        setTimeout(onComplete, 800); // Delay the `onComplete` callback the animation duration
      }
    } else if (!hours && !minutes && !seconds) {
      clearInterval(this.timer);
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
    numberStyle: PropTypes.object,
  }),
  onComplete: PropTypes.func,
  separators: PropTypes.bool,
  unitsToShow: PropTypes.arrayOf(PropTypes.string),
};

export default CountdownTimer;
