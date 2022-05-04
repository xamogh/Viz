import * as React from "react";
import "../pages/common.scss";

function Legend() {
  return (
    <div className="sort__legend card purple lighten-4 hide-on-small-only">
      <div className="sort__legend_item">
        <div className="sort__default" />
        <p>Unsorted Nodes</p>
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
  );
}

export default React.memo(Legend, () => true);
