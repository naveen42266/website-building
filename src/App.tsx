import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/home';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App