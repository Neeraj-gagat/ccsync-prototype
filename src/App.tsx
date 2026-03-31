import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import { Home } from './pages/Home'
import { Calendar } from './pages/Calendar'
import { Graph } from './pages/Graph'
import { Setting } from './pages/Setting'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/board" element={<Home/>}/>
      <Route path="/calendar" element={<Calendar/>}/>
      <Route path="/graph" element={<Graph/>}/>
      <Route path="/settings" element={<Setting/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
