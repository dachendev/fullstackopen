import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";

const App = () => {
  return (
    <Router>
      <div>
        <Link role="button" to="/">
          authors
        </Link>
        <Link role="button" to="/books">
          books
        </Link>
        <Link role="button" to="/add">
          add book
        </Link>
      </div>
      <Routes>
        <Route path="/add" element={<NewBook />} />
        <Route path="/books" element={<Books />} />
        <Route path="/" element={<Authors />} />
      </Routes>
    </Router>
  );
};

export default App;
