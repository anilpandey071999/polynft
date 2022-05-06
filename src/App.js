import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Install from "./components/install";
import Home from "./components/Home";
import Navbar from './components/NavBar';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  // return (
    if (window.ethereum) {
      return (
        <Router>
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
          </Routes>
        </Router>
      );
    } else {
      return <Install />;
    }
  // );
}

export default App;
