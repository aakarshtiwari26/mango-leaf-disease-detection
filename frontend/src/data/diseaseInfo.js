const diseaseInfo = {
  Healthy: {
    icon: '✅',
    severity: 'none',
    summary: 'This leaf looks healthy — no signs of disease detected.',
    tips: [
      'Keep up regular watering and fertilizing schedules.',
      'Inspect leaves periodically to catch problems early.',
    ],
  },
  Anthracnose: {
    icon: '🍂',
    severity: 'high',
    summary: 'A fungal infection (Colletotrichum gloeosporioides) causing dark, sunken lesions on leaves, flowers, and fruit.',
    tips: [
      'Prune and destroy infected leaves and twigs.',
      'Apply a copper-based fungicide during wet seasons.',
      'Avoid overhead irrigation to keep foliage dry.',
    ],
  },
  'Bacterial Canker': {
    icon: '🦠',
    severity: 'high',
    summary: 'A bacterial infection (Xanthomonas) that produces water-soaked lesions with a yellow halo on leaves and stems.',
    tips: [
      'Remove and dispose of infected plant material.',
      'Spray a copper-based bactericide.',
      'Avoid wounding trees, especially in humid weather.',
    ],
  },
  'Cutting Weevil': {
    icon: '🐛',
    severity: 'medium',
    summary: 'Larvae of the mango cutting weevil bore into shoots and leaf stalks, causing wilting and shoot dieback.',
    tips: [
      'Prune and destroy affected shoots promptly.',
      'Use a recommended insecticide during peak activity.',
      'Maintain field hygiene to reduce breeding sites.',
    ],
  },
  'Die Back': {
    icon: '🥀',
    severity: 'high',
    summary: 'A fungal disease (Botryodiplodia theobromae) where branches progressively dry out from the tip backward.',
    tips: [
      'Prune dead and dying wood well below the affected area.',
      'Apply a fungicidal paste to pruning cuts.',
      'Improve drainage and avoid water stress.',
    ],
  },
  'Gall Midge': {
    icon: '🪲',
    severity: 'medium',
    summary: 'Tiny insect larvae trigger abnormal growths (galls) on leaf tissue, distorting leaves and stunting growth.',
    tips: [
      'Remove and destroy galled leaves before larvae emerge.',
      'Apply a suitable insecticide at flushing stage.',
      'Encourage natural predators where possible.',
    ],
  },
  'Powdery Mildew': {
    icon: '🌫️',
    severity: 'medium',
    summary: 'A fungal disease (Oidium mangiferae) that coats leaves, flowers, and young fruit with a white powdery growth.',
    tips: [
      'Apply a sulfur-based or systemic fungicide.',
      'Improve air circulation by pruning dense canopy.',
      'Treat early — it spreads fast in humid, warm weather.',
    ],
  },
  'Sooty Mould': {
    icon: '⚫',
    severity: 'low',
    summary: 'A black fungal coating that grows on honeydew secreted by sap-sucking insects like aphids and scale.',
    tips: [
      'Control the underlying insect infestation first.',
      'Wash affected leaves with a mild soap solution.',
      'Improve airflow to reduce humidity buildup.',
    ],
  },
}

export const severityMeta = {
  none: { label: 'Healthy', color: '#2f9e44' },
  low: { label: 'Low severity', color: '#e8a33d' },
  medium: { label: 'Medium severity', color: '#e8702a' },
  high: { label: 'High severity', color: '#d1373f' },
}

export function getDiseaseInfo(label) {
  return diseaseInfo[label] ?? null
}

export default diseaseInfo
