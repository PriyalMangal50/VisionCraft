export function generateSearchQuery({ brand = '', modelNo = '', color = '', size = '', category = '', name = '' }) {
  const terms = [brand, modelNo || name, color, size, category]
    .filter(Boolean)
    .map(s => s.toString().trim());
  const base = terms.join(' ');
  const viewHints = ' product image front side top angle box';
  return (base + viewHints).trim();
}

export default generateSearchQuery;
