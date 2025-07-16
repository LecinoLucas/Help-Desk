import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/App.css'  // importa o CSS global com Tailwind e seus estilos

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
