import classNames from "classnames";
import * as React from "react";
import { Flipper, Flipped } from "react-flip-toolkit";
import CodeMapper from "../../components/CodeMapper";
import Controls from "../../components/Controls";
import Legend from "../../components/Legend";
import Navbar from "../../components/Navbar";
import "../common.scss";

const code = {
  0: "for i = 0 to nthLastUnsortedElement",
  1: "    if (i)th element > (i + 1)th element",
  2: "        swap(i, i + 1)"
};

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
    setSorted([]);
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

  const resetStates = () => {
    setStarted(false);
    setPaused(false);
    setSwapping([null, null]);
    setComparing([null, null]);
    setSorted([]);
  };

  const onReset = () => {
    resetStates();
    setCodeIndex(0);
    clearAllInterval();
    lastIterator.current = null;
    setState(generateFrames(size));
  };

  const onSizeChange = (size: number) => {
    setSize(size);
    setState(generateFrames(size));
    setCodeIndex(0);
    clearAllInterval();
    resetStates();
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
    <div>
      <Navbar />
      <div className="row">
        <div className="col s12 m12 l8 xl8">
          <Controls
            size={size}
            speed={speed}
            started={started}
            paused={paused}
            onSizeChange={(v) => onSizeChange(v)}
            onSpeedChange={(v) => onSpeedChange(v, lastIterator.current)}
            onStart={() => onStart(state, speed)}
            onPause={() => onPause()}
            onReset={() => onReset()}
            onResume={() => onResume(lastIterator.current, speed)}
          />
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
          <Legend />
          <CodeMapper code={code} codeIndex={codeIndex} />
        </div>
      </div>
    </div>
  );
}
