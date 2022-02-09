import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import AdminHome from './Pages/Admin/AdminHome/AdminHome';
import AddFood from './Pages/Admin/AddFood/AddFood';
import Addstudent from './Pages/Admin/Addstudent/Addstudent';

function App() {
  return (
    <div style={{width: '100%'}}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AdminHome/>}>
                    <Route path="/" element={<AddFood/>}/>
                    <Route path="/Addstudent" element={<Addstudent/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
