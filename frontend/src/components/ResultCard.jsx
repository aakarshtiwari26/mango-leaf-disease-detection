import { getDiseaseInfo, severityMeta } from '../data/diseaseInfo.js'

function formatLabel(label) {
  return label.replaceAll('_', ' ')
}

function ResultCard({ result }) {
  const isRejected = result.status === 'rejected'
  const info = !isRejected ? getDiseaseInfo(result.prediction) : null
  const severity = info ? severityMeta[info.severity] : null
  const confidencePct = !isRejected ? Math.round(result.confidence * 100) : null

  return (
    <div className={`result-card ${isRejected ? 'result-card--rejected' : 'result-card--ok'}`}>
      {result.localPreviewUrl && (
        <img src={result.localPreviewUrl} alt="Uploaded leaf" className="result-image" />
      )}

      {isRejected ? (
        <div className="result-rejected">
          <span className="result-rejected-icon" aria-hidden="true">⚠️</span>
          <p className="result-message">{result.message}</p>
        </div>
      ) : (
        <>
          <div className="result-heading">
            {info && <span className="result-icon" aria-hidden="true">{info.icon}</span>}
            <h2 className="result-prediction">{formatLabel(result.prediction)}</h2>
          </div>

          {severity && (
            <span className="severity-badge" style={{ '--badge-color': severity.color }}>
              {severity.label}
            </span>
          )}

          <div className="confidence-block">
            <div className="confidence-label">
              <span>Confidence</span>
              <span>{confidencePct}%</span>
            </div>
            <div className="confidence-bar-track">
              <div
                className="confidence-bar-fill"
                style={{ width: `${confidencePct}%`, '--badge-color': severity?.color }}
              />
            </div>
          </div>

          {info && (
            <div className="disease-info">
              <p className="disease-summary">{info.summary}</p>
              {info.tips.length > 0 && (
                <>
                  <h3 className="disease-tips-heading">Recommended care</h3>
                  <ul className="disease-tips">
                    {info.tips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ResultCard
