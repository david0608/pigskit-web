import ReactDOM from 'react-dom';
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

function ForceLink() {
    const [trigger, setTrigger] = useState(false)

    return (<>
        <button onClick={() => setTrigger(true)}>Home</button>
        {trigger ? <Redirect to="/test"/> : null}
    </>)
}

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              {/* <Link to="/test/">Home</Link> */}
              {/* <button onClick={() => location.href = `/test`}>Home</button> */}
              <ForceLink/>
            </li>
            <li>
              <Link to="/test/about">About</Link>
            </li>
            <li>
              <Link to="/test/users">Users</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/test/about">
            <About />
          </Route>
          <Route path="/test/users">
            <Users />
          </Route>
          <Route path="/test/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);