function formatLabel(label) {
  return label.replaceAll('_', ' ')
}

function ResultCard({ result }) {
  const isRejected = result.status === 'rejected'

  return (
    <div className={`result-card ${isRejected ? 'result-card--rejected' : 'result-card--ok'}`}>
      {result.localPreviewUrl && (
        <img src={result.localPreviewUrl} alt="Uploaded leaf" className="result-image" />
      )}

      {isRejected ? (
        <p className="result-message">{result.message}</p>
      ) : (
        <>
          <h2 className="result-prediction">{formatLabel(result.prediction)}</h2>
          <p className="result-confidence">{(result.confidence * 100).toFixed(1)}% confidence</p>
        </>
      )}
    </div>
  )
}

export default ResultCard
