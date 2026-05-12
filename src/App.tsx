import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Research from "./pages/Research/Research";
// import Services from "./pages/Services/Services";
import Loader from "./components/Loader/Loader";
import "./App.scss";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <main
              style={{
                flex: 1,
                minHeight: "50vh",
                background: "var(--color-bg)",
              }}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/research" element={<Research />} />
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="/services" element={<Services />} /> */}
      </Routes>
      <Footer />
    </>
  );
}
