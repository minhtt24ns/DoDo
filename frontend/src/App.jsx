import { Toaster, toast } from "sonner";
import { BrowserRouter, Router, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";


function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route
            path="/signin"
            element={<SignInPage/>}
          />
          <Route
            path="/signup"
            element={<SignUpPage/>}
          />
          {/* protected routes */}
          <Route element={<ProtectedRoute/>}>
            <Route path="/" element={<HomePage />} />
          </Route>
          {/* not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;