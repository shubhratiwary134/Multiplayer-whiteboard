import React, { Suspense, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";

const InitialPage = React.lazy(() => import("./components/InitialPage"));
const Room = React.lazy(() => import("./components/Room"));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<InitialPage />} />
          <Route path="/room/:roomID" element={<Room />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
