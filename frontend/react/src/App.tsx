import { Route, Routes, useNavigate } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import AddPage from "./pages/AddPage";
import EditPage from "./pages/EditPage";
import { AuthProvider } from "oidc-react";
import { AxiosClientProvider } from "./api/AxiosClientProvider";

function App() {
  const navigate = useNavigate();
  return (
    <AuthProvider
      authority="https://keycloak.julylab.org/realms/master"
      clientId="bungalo-frontend"
      redirectUri="http://localhost:5173"
      onSignIn={() => {
        navigate("/calendar");
      }}
    >
      <AxiosClientProvider>
        <Routes>
          <Route path="/" Component={SiteLayout}>
            <Route path="/calendar" Component={HomePage} />
            <Route path="/search" Component={SearchPage} />
            <Route path="/add" Component={AddPage} />
            <Route path="/edit/:id" Component={EditPage} />
          </Route>
        </Routes>
      </AxiosClientProvider>
    </AuthProvider>
  );
}

export default App;
