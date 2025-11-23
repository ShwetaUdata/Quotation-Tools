import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Nav from './Components/Nav';
import Home from './Components/Home';
import Login from './Components/Login';
import Generated from './Components/Generated';
import Quotation from './Components/Quotation';
import Nav from './Components/Nav';

function App() {
  return (
    <BrowserRouter>
    <Nav/>
        <Routes>
          <Route path="/Home" element={<Home/>}/>
          <Route path="/" element={<Login />} />
          <Route path="/Generated" element={<Generated/>}/>
          <Route path="/Quotation" element={<Quotation/>}/>
        </Routes>
    </BrowserRouter>
  )
}
export default App