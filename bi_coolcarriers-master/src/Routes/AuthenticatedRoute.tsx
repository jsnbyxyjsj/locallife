import { Routes, Route, Navigate } from "react-router-dom";

// === Containers ===
import GeneralDashboard from "../containers/GeneralDashboard";
import Dashboard from "../containers/Dashboard";
import DataSources from "../containers/DataSources";
import Test from "../containers/Test";

// === Components ===
import NavBar from "../components/NavBar";
import MenuBar from "../components/MenuBar";

export default function AuthenticatedRoute() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <NavBar />
            <MenuBar />
            <Dashboard />
          </>
        }
      />
      <Route
        path="/dataSources"
        element={
          <>
            <NavBar />
            <MenuBar />
            <DataSources />
          </>
        }
      />
      <Route
        path="/dashboard"
        element={
          <>
            <NavBar />
            <MenuBar />
            <GeneralDashboard />
          </>
        }
      />
      <Route path="/test" element={<Test />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
