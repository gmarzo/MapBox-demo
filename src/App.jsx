import logo from './logo.svg'
import Button from '@material-ui/core/Button'
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
