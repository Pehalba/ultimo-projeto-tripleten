import './App.css'
import { Route, Routes } from 'react-router-dom'
import Header from '../Header/Header'
import Main from '../Main/Main'
import About from '../About/About'
import Footer from '../Footer/Footer'
import DataPage from '../DataPage/DataPage'

function App() {
  return (
    <div className="page">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <div className="home">
              <Main />
              <About />
            </div>
          }
        />
        <Route path="/dados" element={<DataPage />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
