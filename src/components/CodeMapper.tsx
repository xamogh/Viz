import * as React from "react";
import "../pages/common.scss";

interface Props {
  code: Record<number, string>;
  codeIndex: number;
}

function CodeMapper(props: Props) {
  const { code, codeIndex } = props;
  return (
    <div className="sort__code card">
      <h5>Code</h5>
      {Object.entries(code).map(([k, v]) => (
        <p
          style={{
            backgroundColor: codeIndex === Number(k) ? "black" : undefined,
            color: codeIndex === Number(k) ? "white" : undefined
          }}
          key={k}
        >
          {v}
        </p>
      ))}
    </div>
  );
}

export default React.memo(CodeMapper, (prev, next) => {
  return prev.codeIndex === next.codeIndex;
});
