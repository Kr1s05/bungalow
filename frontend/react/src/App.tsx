import { Route, Routes } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import AddPage from "./pages/AddPage";
import EditPage from "./pages/EditPage";

function App() {
  return (
    <Routes>
      <Route path="/" Component={SiteLayout}>
        <Route path="/" Component={HomePage} />
        <Route path="/search" Component={SearchPage} />
        <Route path="/add" Component={AddPage} />
        <Route path="/edit/:id" Component={EditPage} />
      </Route>
    </Routes>
  );
}

export default App;
