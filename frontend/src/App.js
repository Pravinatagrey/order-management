import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Register from "./components/Register";
import Product from "./components/Products";
import Login from "./components/Login";
import { SnackbarProvider } from 'notistack';
import FoodMenuTabs from './components/FoodMenuTabs';
import Checkout from './components/Checkout';
import Thanks from './components/Thanks';
export const config = {
  endpoint: `${process.env.API_URL}` || `http://localhost:8082/api/v1`
};
function App() {
  return (
  <div className="App">
     
<SnackbarProvider maxSnack={3} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'right', }}>
    
       <Router>
        <Routes>     
          <Route  path="/login" element={<Login />} />      
          <Route  path="/register" element={<Register />} />
          <Route path="/" element={<Product />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/thanks" element={<Thanks />} />
        </Routes>
      </Router>
    
  </SnackbarProvider>
    </div>
   
  );
}
  // <Route path="/" element={<Product />} />
//   
 //         <Route path="/thanks" element={<Thanks />} />

export default App;
