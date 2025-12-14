import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter, Route, Router, Routes } from 'react-router-dom';
import Routine from './routine.js'
import GetStarted from './get_started.js';
import AddExercise from './add_exercise.js';
import Login from './login.js';
import Signup from './signup.js';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <HashRouter>
        <Routes>
            <Route path="/routine" element={<Routine />} />
            <Route path="/" element={<GetStarted />} />
            <Route path="/add_exercise" element={<AddExercise />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
        </Routes>
    </HashRouter>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
