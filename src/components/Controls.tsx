import * as React from "react";
import "../pages/common.scss";

interface Props {
  size: number;
  onSizeChange: (v: number) => void;
  speed: number;
  onSpeedChange: (v: number) => void;
  onStart: () => void;
  started: boolean;
  onReset: () => void;
  paused: boolean;
  onPause: () => void;
  onResume: () => void;
}

export default function Controls(props: Props) {
  const {
    size,
    onSizeChange,
    speed,
    onSpeedChange,
    onStart,
    started,
    onReset,
    paused,
    onPause,
    onResume
  } = props;
  return (
    <div className="card row sort__controls">
      <div className="col s12 m6" style={{ display: "flex" }}>
        <select
          className="browser-default sort__select"
          value={size}
          onChange={(e) => {
            onSizeChange(Number(e.target.value));
          }}
        >
          <option value={10}>10 items</option>
          <option value={15}>15 items</option>
          <option value={20}>20 items</option>
        </select>
        <select
          className="browser-default sort__select"
          value={speed}
          onChange={(e) => {
            onSpeedChange(Number(e.target.value));
          }}
          style={{ marginLeft: "8px" }}
        >
          <option value={0.5}>0.5x speed</option>
          <option value={1}>1x speed</option>
          <option value={1.5}>1.5x speed</option>
          <option value={2}>2x speed</option>
        </select>
      </div>
      <div className="col s12 m6 sort__control_buttons">
        <button
          className="waves-effect green darken-2 waves-light btn-small"
          onClick={() => onStart()}
          disabled={started}
        >
          Start
        </button>
        <button
          className="waves-effect red darken-2 waves-light btn-small"
          onClick={() => onReset()}
        >
          Reset
        </button>
        {started && (
          <button
            className="waves-effect deep-purple darken-2 waves-light btn-small"
            onClick={() => onPause()}
            disabled={paused}
          >
            Pause
          </button>
        )}
        {paused && (
          <button
            className="waves-effect deep-purple accent-3 darken-2 waves-light btn-small"
            onClick={() => onResume()}
          >
            Resume
          </button>
        )}
      </div>
    </div>
  );
}
