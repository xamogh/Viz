import classNames from "classnames";
import * as React from "react";
import { Flipper, Flipped } from "react-flip-toolkit";
import "../common.scss";

const code = {
  0: "for i = 0 to nthLastUnsortedElement",
  1: "    if (i)th element > (i + 1)th element",
  2: "        swap(i, i + 1)"
};

const cc = Object.entries(code)
  .map(([k, v]) => v)
  .join("\n");

type GeneratorFrame = { sorted: number } | Frame | { codeIndex: number };

type Frame = {
  arr: Array<number>;
  swapping: Array<number | null>;
  comparing: Array<number | null>;
  codeIndex: number;
};

const swapInPlace = <T,>(arr: T[], x: number, y: number): T[] => {
  const tmp = arr[x];
  arr[x] = arr[y];
  arr[y] = tmp;
  return arr;
};

function* sortFunc(
  arr: Array<number>
): Generator<GeneratorFrame, any, GeneratorFrame> {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      yield {
        arr,
        comparing: [j, j + 1],
        swapping: [null, null],
        codeIndex: 1
      };
      if (arr[j] > arr[j + 1]) {
        yield {
          arr,
          comparing: [null, null],
          swapping: [j, j + 1],
          codeIndex: 2
        };
        swapInPlace(arr, j, j + 1);
        yield {
          arr,
          comparing: [null, null],
          swapping: [j, j + 1],
          codeIndex: 2
        };
      }
    }
    yield { sorted: arr.length - i - 1, codeIndex: 0 };
  }
  yield { arr, comparing: [null, null], swapping: [null, null], codeIndex: 0 };
  yield { sorted: 0 };
}

function generateFrames(count: number): Array<number> {
  return new Array(count)
    .fill(null)
    .map((_, index) => index * Math.floor(4 / (count / 100)) + 30)
    .sort(() => Math.random() - 0.5);
}

var interval: number | NodeJS.Timer | null | undefined = null;

var clearAllInterval = () => {
  if (interval) {
    for (let i = 1; i <= interval; i++) {
      window.clearInterval(i);
    }
  }
};

export default function BubbleSort() {
  const [comparing, setComparing] = React.useState<Array<null | number>>([
    null,
    null
  ]);
  const [swapping, setSwapping] = React.useState<Array<null | number>>([
    null,
    null
  ]);
  const [sorted, setSorted] = React.useState<Array<number>>([]);
  const [started, setStarted] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const [size, setSize] = React.useState(10);
  const [speed, setSpeed] = React.useState(1);
  const [state, setState] = React.useState(generateFrames(size));
  const [codeIndex, setCodeIndex] = React.useState(0);

  const lastIterator = React.useRef<any>(null);

  const onIntervalTick = (
    iterator: Generator<GeneratorFrame, GeneratorFrame, GeneratorFrame>
  ): void => {
    const next = iterator.next().value;
    if (next === undefined) {
      clearAllInterval();
      lastIterator.current = null;
      setStarted(false);
    } else {
      if ("sorted" in next) {
        setSorted((p) => [...p, next.sorted]);
      }
      if ("arr" in next) {
        setState([...next.arr]);
        setComparing([...next.comparing]);
        setSwapping([...next.swapping]);
      }
      if ("codeIndex" in next) {
        setCodeIndex(next.codeIndex);
      }
    }
  };

  const onStart = (arr: Array<number>, iv: number) => {
    setStarted(true);
    clearAllInterval();
    const iterator = sortFunc(arr);
    lastIterator.current = iterator;
    interval = window.setInterval(() => {
      onIntervalTick(iterator);
    }, 200 / iv);
  };

  const onPause = () => {
    setPaused(true);
    clearAllInterval();
  };

  const onResume = (
    lastIterator: Generator<GeneratorFrame, GeneratorFrame, GeneratorFrame>,
    iv: number
  ) => {
    setPaused(false);
    clearAllInterval();
    interval = setInterval(() => {
      onIntervalTick(lastIterator);
    }, 200 / iv);
  };

  const onReset = () => {
    setCodeIndex(0);
    setStarted(false);
    setPaused(false);
    clearAllInterval();
    lastIterator.current = null;
    setState(generateFrames(size));
    setSwapping([null, null]);
    setComparing([null, null]);
    setSorted([]);
  };

  const onSizeChange = (size: number) => {
    setSize(size);
    setState(generateFrames(size));
    setCodeIndex(0);
    setStarted(false);
    setPaused(false);
    clearAllInterval();
    setSwapping([null, null]);
    setComparing([null, null]);
    setSorted([]);
  };

  const onSpeedChange = (
    speed: number,
    lastIterator: Generator<GeneratorFrame, GeneratorFrame, GeneratorFrame>
  ) => {
    clearAllInterval();
    setSpeed(speed);
    interval = setInterval(() => {
      onIntervalTick(lastIterator);
    }, 200 / speed);
    setPaused(false);
  };

  return (
    <div className="row">
      <div className="col s12 m12 l8 xl8">
        <h4>Bubble Sort</h4>
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
                onSpeedChange(Number(e.target.value), lastIterator.current);
              }}
              style={{ marginLeft: "8px" }}
            >
              <option value={1}>1x speed</option>
              <option value={1.5}>1.5x speed</option>
              <option value={2}>2x speed</option>
            </select>
          </div>
          <div className="col s12 m6 sort__control_buttons">
            <button
              className="waves-effect green darken-2 waves-light btn-small"
              onClick={() => onStart(state, speed)}
              disabled={started}
            >
              Start
            </button>
            <button
              className="waves-effect red darken-2 waves-light btn-small"
              onClick={onReset}
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
                onClick={() => onResume(lastIterator.current, speed)}
              >
                Resume
              </button>
            )}
          </div>
        </div>
        <Flipper
          flipKey={`board1-${state.join("")}`}
          spring={{ stiffness: 1000, damping: 100 }}
        >
          <div className="sort__board1-wrapper">
            {state.map((item, i) => (
              <Flipped key={item} flipId={item}>
                <div
                  className={classNames({
                    sort__default: true,
                    sort__comparing: comparing.includes(i),
                    sort__sorted: sorted.includes(i),
                    sort__swapping: swapping.includes(i)
                  })}
                  style={{
                    height: item,
                    width: `calc(100%/${size} - 4px)`,
                    marginLeft: "4px"
                  }}
                >
                  {item}
                </div>
              </Flipped>
            ))}
          </div>
        </Flipper>
      </div>
      <div className="col s12 m12 l4 xl4">
        <div className="sort__legend card purple lighten-4 hide-on-small-only">
          <h5 style={{ textAlign: "center" }}>Legend</h5>
          <div className="sort__legend_item">
            <div className="sort__default" />
            <p>Unsorted Node</p>
          </div>
          <div className="sort__legend_item">
            <div className="sort__comparing" />
            <p>Comparing Nodes</p>
          </div>
          <div className="sort__legend_item">
            <div className="sort__swapping" />
            <p>Swapping Nodes</p>
          </div>
          <div className="sort__legend_item">
            <div className="sort__sorted" />
            <p>Sorted Nodes</p>
          </div>
        </div>

        <div className="sort__code card">
          <h5>Code</h5>
          {Object.entries(code).map(([k, v]) => (
            <p
              style={{
                backgroundColor: codeIndex === Number(k) ? "black" : undefined,
                color: codeIndex === Number(k) ? "white" : undefined
              }}
            >
              {v}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
