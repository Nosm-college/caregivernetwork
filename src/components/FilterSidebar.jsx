import { JOB_CATEGORIES, UK_LOCATIONS, CONTRACT_TYPES, SALARY_RANGES } from '../data/categories';
import { Filter, X } from 'lucide-react';

export default function FilterSidebar({ filters, setFilters, onReset }) {
  const handleChange = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val === prev[key] ? '' : val }));
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <span><Filter size={16} /> Refine Results</span>
        {hasFilters && (
          <button className="reset-btn" onClick={onReset}>
            <X size={14} /> Clear all
          </button>
        )}
      </div>

      <FilterSection title="Job Category">
        <select
          value={filters.category || ''}
          onChange={e => setFilters(p => ({ ...p, category: e.target.value }))}
        >
          <option value="">All Categories</option>
          {JOB_CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title="Location">
        <select
          value={filters.location || ''}
          onChange={e => setFilters(p => ({ ...p, location: e.target.value }))}
        >
          <option value="">All Locations</option>
          {UK_LOCATIONS.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title="Contract Type">
        {CONTRACT_TYPES.map(ct => (
          <label key={ct} className="check-label">
            <input
              type="checkbox"
              checked={filters.contractType === ct}
              onChange={() => handleChange('contractType', ct)}
            />
            {ct}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Salary Range">
        {SALARY_RANGES.map(sr => (
          <label key={sr} className="check-label">
            <input
              type="checkbox"
              checked={filters.salaryRange === sr}
              onChange={() => handleChange('salaryRange', sr)}
            />
            {sr}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Vacancy Status">
        <label className="check-label">
          <input
            type="checkbox"
            checked={filters.vacantOnly === true}
            onChange={() => setFilters(p => ({ ...p, vacantOnly: !p.vacantOnly }))}
          />
          Show active vacancies only
        </label>
      </FilterSection>
    </aside>
  );
}

function FilterSection({ title, children }) {
  return (
    <div className="filter-section">
      <h4 className="filter-section-title">{title}</h4>
      {children}
    </div>
  );
}
