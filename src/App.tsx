import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProfessionalBackground from "./components/Background";
import { Navigation } from "./components/navigation";
import Simon from "@/pages/Simon";
import Home from "@/pages/Home";

function App() {
  return (
    <BrowserRouter>
      <ProfessionalBackground opacity={0.7}>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simon" element={<Simon />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ProfessionalBackground>
    </BrowserRouter>
  );
}

export default App;
