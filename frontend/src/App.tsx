import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./page/Header/Header";
import Manager from "./page/Manager/Manager";
import BookTickets from "./page/BookTckets/BookTickets";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <BookTickets />
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
