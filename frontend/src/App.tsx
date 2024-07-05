import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./page/Header/Header";
import Manager from "./page/Manager/Manager";
import Register from "./page/Register/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <Register />
            </>
          }
        />
        <Route
          path="/manager"
          element={
            <>
              <Header />
              <Manager />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
