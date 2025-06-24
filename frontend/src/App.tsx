import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Form from './components/Form';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Form />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;