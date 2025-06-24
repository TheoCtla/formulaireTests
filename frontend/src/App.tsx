import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Form from './components/Form';
import './App.css';

function App() {
    return (
        <Router>
            <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
                <h1>Formulaire d’enregistrement</h1>
                <Routes>
                    <Route path="/" element={<Form />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;