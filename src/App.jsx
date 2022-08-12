import 'mapbox-gl/dist/mapbox-gl.css'
import './App.css'
import Homepage from './pages/Homepage'

import { Routes, Route, Navigate, BrowserRouter as Router } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
