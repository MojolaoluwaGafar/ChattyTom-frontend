import './App.css'
import { BrowserRouter as Router } from "react-router";
import AppRoutes from "./Routes/AppRoutes"

function App() {


  return (
    <>
    <Router>
      <AppRoutes />
    </Router>
    </>
  )
}

export default App
