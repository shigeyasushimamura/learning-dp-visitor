import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Before from "./pages/Before";
import AfterBasic from "./pages/AfterBasic";
import AfterWithHomework from "./pages/AfterWithHomework";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Before />} />
          <Route path="after" element={<AfterBasic />} />
          <Route path="after-homework" element={<AfterWithHomework />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
