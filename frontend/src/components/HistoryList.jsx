import { useCallback, useEffect, useState } from 'react'
import apiClient from '../api/client.js'
import { getDiseaseInfo } from '../data/diseaseInfo.js'

function HistoryList({ refreshKey }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [manualRefresh, setManualRefresh] = useState(0)

  const loadHistory = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await apiClient.get('/history', { params: { page: 1, page_size: 10 } })
      setItems(Array.isArray(data?.items) ? data.items : [])
    } catch {
      setError('Could not load history.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    loadHistory().then(() => {
      if (cancelled) return
    })
    return () => {
      cancelled = true
    }
  }, [refreshKey, manualRefresh, loadHistory])

  const healthyCount = items.filter((i) => i.prediction === 'Healthy').length
  const diseasedCount = items.length - healthyCount

  return (
    <div className="history-list">
      <div className="history-header">
        <h2>Recent scans</h2>
        <button
          type="button"
          className="refresh-btn"
          onClick={() => setManualRefresh((n) => n + 1)}
          disabled={loading}
          aria-label="Refresh history"
        >
          ⟳
        </button>
      </div>

      {items.length > 0 && (
        <div className="history-stats">
          <div className="stat-pill stat-pill--total">
            <span className="stat-value">{items.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-pill stat-pill--healthy">
            <span className="stat-value">{healthyCount}</span>
            <span className="stat-label">Healthy</span>
          </div>
          <div className="stat-pill stat-pill--diseased">
            <span className="stat-value">{diseasedCount}</span>
            <span className="stat-label">Diseased</span>
          </div>
        </div>
      )}

      {loading && items.length === 0 && (
        <div className="history-skeleton">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton-item" />
          ))}
        </div>
      )}

      {error && <p className="error-text">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <div className="history-empty">
          <span className="history-empty-icon" aria-hidden="true">🍃</span>
          <p>No scans yet — upload a leaf to get started.</p>
        </div>
      )}

      {items.length > 0 && (
        <ul>
          {items.map((item) => {
            const info = getDiseaseInfo(item.prediction)
            const isHealthy = item.prediction === 'Healthy'
            return (
              <li key={item.id} className="history-item">
                <img src={item.image_url} alt={item.prediction} className="history-thumb" />
                <div className="history-item-body">
                  <p className="history-prediction">
                    {info?.icon && <span aria-hidden="true">{info.icon} </span>}
                    {item.prediction.replaceAll('_', ' ')}
                  </p>
                  <p className="history-meta">
                    {(item.confidence * 100).toFixed(1)}% · {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
                <span className={`history-status-dot ${isHealthy ? 'history-status-dot--healthy' : 'history-status-dot--warning'}`} />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default HistoryList
