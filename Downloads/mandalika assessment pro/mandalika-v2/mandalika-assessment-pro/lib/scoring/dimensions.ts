import { DimensionKey, DimensionMeta, Layer } from './types';

const layerColors: Record<Layer, string> = {
  1: '#2D5A1B',
  2: '#1D4D8A',
  3: '#7A4E10',
  4: '#5A4A8A',
};

export const DIMENSIONS: DimensionMeta[] = [
  { key: 'integritas', label: 'Integritas', layer: 1, color: layerColors[1] },
  { key: 'ownership', label: 'Ownership', layer: 1, color: layerColors[1] },
  { key: 'standarPribadi', label: 'Standar Pribadi', layer: 1, color: layerColors[1] },
  { key: 'emotionallyControlled', label: 'Emotionally Controlled', layer: 1, color: layerColors[1] },

  { key: 'caraBerpikir', label: 'Cara Berpikir', layer: 2, color: layerColors[2] },
  { key: 'responsFeedback', label: 'Respons Feedback', layer: 2, color: layerColors[2] },
  { key: 'growthMindset', label: 'Growth Mindset', layer: 2, color: layerColors[2] },
  { key: 'conscientious', label: 'Conscientious', layer: 2, color: layerColors[2] },

  { key: 'dampakTim', label: 'Dampak Tim', layer: 3, color: layerColors[3] },
  { key: 'resiliensi', label: 'Resiliensi', layer: 3, color: layerColors[3] },
  { key: 'communicationClarity', label: 'Communication Clarity', layer: 3, color: layerColors[3] },

  { key: 'decisive', label: 'Decisive', layer: 4, color: layerColors[4] },
  { key: 'innovative', label: 'Innovative', layer: 4, color: layerColors[4] },
];

export const dimensionMap: Record<DimensionKey, DimensionMeta> = DIMENSIONS.reduce(
  (acc, dim) => ({ ...acc, [dim.key]: dim }),
  {} as Record<DimensionKey, DimensionMeta>,
);

export function getDimensionsByLayer(layer: Layer) {
  return DIMENSIONS.filter((d) => d.layer === layer);
}
