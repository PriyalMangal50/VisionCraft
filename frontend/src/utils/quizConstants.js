// Standard quiz option values to ensure consistency between admin panel and frontend

// Face shapes (always use lowercase for values, Title Case for labels)
export const FACE_SHAPES = [
  { value: 'oval', label: 'Oval' },
  { value: 'round', label: 'Round' },
  { value: 'square', label: 'Square' },
  { value: 'heart', label: 'Heart' },
  { value: 'diamond', label: 'Diamond' }
];

// Frame shapes/styles (use exact same case for values and labels)
export const FRAME_SHAPES = [
  { value: 'Rectangle', label: 'Rectangle' },
  { value: 'Square', label: 'Square' },
  { value: 'Round', label: 'Round' },
  { value: 'Cat Eye', label: 'Cat Eye' },
  { value: 'Aviator', label: 'Aviator' }
];

// Usage options (lowercase for values, descriptive text for labels)
export const USAGE_OPTIONS = [
  { value: 'everyday', label: 'Everyday Wear' },
  { value: 'computer', label: 'Computer/Screen Time' },
  { value: 'reading', label: 'Reading' },
  { value: 'fashion', label: 'Fashion Statement' },
  { value: 'sports', label: 'Sports & Activities' }
];

// Feature options (standard key mapping between backend and frontend)
export const FEATURE_OPTIONS = [
  { key: 'blueLight', value: 'Blue Light', label: 'Blue Light Filtering' },
  { key: 'lightweight', value: 'Lightweight', label: 'Lightweight' },
  { key: 'polarized', value: 'Polarized', label: 'Polarized' },
  { key: 'transition', value: 'Transition', label: 'Transition Lenses' }
];

// For converting feature values to database keys
export const FEATURE_VALUE_TO_KEY = {
  'Blue Light': 'blueLight',
  'Lightweight': 'lightweight',
  'Polarized': 'polarized',
  'Transition': 'transition'
};

// For converting lens types to feature values (for quiz filtering)
export const LENS_TYPE_TO_FEATURE = {
  'Blue Light': 'blueLight',
  'Photochromic': 'transition',
  'Polarized': 'polarized'
};

// This helps standardize the mapping between admin panel and frontend
export const getFeatureKeyFromValue = (value) => {
  const feature = FEATURE_OPTIONS.find(opt => opt.value === value);
  return feature ? feature.key : null;
};

export const getFeatureValueFromKey = (key) => {
  const feature = FEATURE_OPTIONS.find(opt => opt.key === key);
  return feature ? feature.value : null;
};
