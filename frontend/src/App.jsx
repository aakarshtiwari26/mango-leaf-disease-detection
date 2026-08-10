import { useState } from 'react'
import UploadForm from './components/UploadForm.jsx'
import ResultCard from './components/ResultCard.jsx'
import HistoryList from './components/HistoryList.jsx'
import './App.css'

function App() {
  const [result, setResult] = useState(null)
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0)

  const handlePredicted = (prediction) => {
    setResult(prediction)
    setHistoryRefreshKey((key) => key + 1)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🥭 Mango Leaf Disease Detection</h1>
        <p>Upload a photo of a mango leaf to check for disease.</p>
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
    </div>
  )
}

export default App
