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
    <Routes>
      <Route
        path="/private"
        element={
          <AuthProvider
            authority="https://keycloak.julylab.org/realms/master"
            clientId="bungalo-frontend"
            redirectUri="https://bungalo.julylab.org/private"
            postLogoutRedirectUri="https://bungalo.julylab.org/"
            onSignIn={() => {
              navigate("/private/calendar");
            }}
          >
            <AxiosClientProvider>
              <SiteLayout />
            </AxiosClientProvider>
          </AuthProvider>
        }
      >
        <Route path="/private/calendar" Component={HomePage} />
        <Route path="/private/search" Component={SearchPage} />
        <Route path="/private/add" Component={AddPage} />
        <Route path="/private/edit/:id" Component={EditPage} />
      </Route>
    </Routes>
  );
}

export default App;
