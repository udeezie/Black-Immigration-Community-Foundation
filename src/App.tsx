import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import './App.scss'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<main style={{ flex: 1, minHeight: '50vh', background: 'var(--color-bg)' }} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </>
  )
}
