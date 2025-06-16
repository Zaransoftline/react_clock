import React, { useRef, useState } from 'react';
import './App.scss';
import { useEffect } from 'react';
import { render } from 'react-dom';

function getRandomName(): string {
  const value = Date.now().toString().slice(-4);

  return `Clock-${value}`;
}

interface AppState {
  currentTime: Date;
  clockName: string;
  hasClock: boolean;
}

export class App extends React.Component<{}, AppState> {
  private timeIntervalId: number | undefined;
  private nameIntervalId: number | undefined;

  constructor(props: {}) {
    super(props);
    this.state = {
      currentTime: new Date(),
      clockName: 'Clock-0',
      hasClock: true,
    };
  }
  componentDidMount() {
    this.timeIntervalId = window.setInterval(() => {
      const newTime = new Date();
      this.setState({ currentTime: newTime });
      // eslint-disable-next-line no-console
      console.log(newTime.toUTCString().slice(-12, -4));
    }, 1000);

    this.nameIntervalId = window.setInterval(() => {
      const prevName = this.state.clockName;
      this.setState({ clockName: getRandomName() }, () => {
        // eslint-disable-next-line no-console
        console.log(`Renamed from ${prevName} to ${this.state.clockName}`);
      });
    }, 3300);
    document.addEventListener('contextmenu', this.hideClock);
    document.addEventListener('click', this.showClock);
  }

  componentWillUnmount() {
    if (this.nameIntervalId) {
      clearInterval(this.nameIntervalId);
    }
    document.removeEventListener('contextmenu', this.hideClock);
    document.removeEventListener('click', this.showClock);
  }

  hideClock = (event: MouseEvent) => {
    event.preventDefault();
    this.setState({ hasClock: false });
    if (this.timeIntervalId) {
      clearInterval(this.timeIntervalId);
    }
  };

  showClock = (event: MouseEvent) => {
    event.preventDefault();
    this.setState({ hasClock: true });
    this.timeIntervalId = window.setInterval(() => {
      const newTime = new Date();
      this.setState({ currentTime: newTime });
      console.log(newTime.toUTCString().slice(-12, -4));
    }, 1000);
  };

  render() {
    const { clockName, currentTime, hasClock } = this.state;
    return hasClock ? (
      <div className="App">
        <h1>React clock</h1>

        <div className="Clock">
          <strong className="Clock__name">{clockName}</strong>

          {' time is '}

          <span className="Clock__time">
            {currentTime.toUTCString().slice(-12, -4)}
          </span>
        </div>
      </div>
    ) : null;
  }
}
