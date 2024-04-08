import { Route, Routes } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/" Component={SiteLayout}>
        <Route path="/" Component={HomePage} />
      </Route>
    </Routes>
  );
}

export default App;
