import * as React from "react";
import { Link } from "react-router-dom";
import "./home.scss";

export default function Home() {
  return (
    <div className="section home__root">
      <div className="row">
        <div className="col s12 m6 l4">
          <Link to="/bubblesort">
            <div className="card hoverable pointer home__card">
              <h2>Bubble Sort</h2>
            </div>
          </Link>
        </div>

        {/* <div className="col s12 m6 l4">
          <Link to="/bubblesort">
            <div className="card hoverable pointer home__card">
              <h2>Insertion Sort</h2>
            </div>
          </Link>
        </div>

        <div className="col s12 m6 l4">
          <Link to="/bubblesort">
            <div className="card hoverable pointer home__card">
              <h2>Merge Sort</h2>
            </div>
          </Link>
        </div> */}
      </div>
    </div>
  );
}
