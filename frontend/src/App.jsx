import { useState } from 'react'
import UploadForm from './components/UploadForm.jsx'
import ResultCard from './components/ResultCard.jsx'
import HistoryList from './components/HistoryList.jsx'
import { useTheme } from './hooks/useTheme.js'
import './App.css'

function App() {
  const [result, setResult] = useState(null)
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0)
  const { theme, toggleTheme } = useTheme()

  const handlePredicted = (prediction) => {
    setResult(prediction)
    setHistoryRefreshKey((key) => key + 1)
  }

  return (
    <div className="app">
      <header className="app-header">
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <h1>🥭 Mango Leaf Disease Detection</h1>
        <p>Upload a photo of a mango leaf to check for disease in seconds.</p>
      </header>

      <main className="app-main">
        <section className="panel">
          <UploadForm onPredicted={handlePredicted} />
          {result && <ResultCard result={result} />}
        </section>

        <section className="panel">
          <HistoryList refreshKey={historyRefreshKey} />
        </section>
      </main>

      <footer className="app-footer">
        <p>Built to help mango growers spot leaf disease early.</p>
      </footer>
    </div>
  )
}

export default App
