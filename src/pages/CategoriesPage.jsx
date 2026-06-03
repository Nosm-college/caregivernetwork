import { Link } from 'react-router-dom';
import { JOB_CATEGORIES } from '../data/categories';
import { Briefcase } from 'lucide-react';

export default function CategoriesPage() {
  const grouped = JOB_CATEGORIES.reduce((acc, cat) => {
    const letter = cat[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(cat);
    return acc;
  }, {});

  return (
    <div className="categories-page">
      <div className="categories-hero">
        <h1>Browse by Category</h1>
        <p>All {JOB_CATEGORIES.length} healthcare & care job categories in the UK</p>
      </div>
      <div className="categories-inner">
        {Object.entries(grouped).sort(([a],[b]) => a.localeCompare(b)).map(([letter, cats]) => (
          <div key={letter} className="cat-group">
            <h2 className="cat-letter">{letter}</h2>
            <div className="cat-grid">
              {cats.map(cat => (
                <Link key={cat} to={`/?category=${encodeURIComponent(cat)}`} className="cat-item">
                  <Briefcase size={16} />
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
