import { X, Plus, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export function KeywordManager({ keywords = [], onUpdate }) {
  const [newKeyword, setNewKeyword] = useState('');
  const [error, setError] = useState('');

  const handleAddKeyword = (e) => {
    e.preventDefault();
    setError('');

    if (!newKeyword.trim()) {
      setError('Please enter a keyword');
      return;
    }

    const keyword = newKeyword.trim().toLowerCase();
    
    if (keywords.includes(keyword)) {
      setError('This keyword already exists');
      return;
    }

    if (keyword.length < 2) {
      setError('Keyword must be at least 2 characters');
      return;
    }

    const updated = [...keywords, keyword];
    onUpdate(updated);
    setNewKeyword('');
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    const updated = keywords.filter(k => k !== keywordToRemove);
    onUpdate(updated);
  };

  return (
    <div className="keyword-manager">
      <div className="keyword-manager-header">
        <div className="keyword-manager-title">
          <AlertTriangle size={20} />
          <h3>Blocked Keywords</h3>
        </div>
        <p className="keyword-manager-description">
          Add keywords to monitor. If employee visits any site containing these keywords during work hours, they'll be marked as inactive.
        </p>
      </div>

      {error && (
        <div className="keyword-error">{error}</div>
      )}

      <form onSubmit={handleAddKeyword} className="keyword-add-form">
        <input
          type="text"
          value={newKeyword}
          onChange={(e) => {
            setNewKeyword(e.target.value);
            setError('');
          }}
          placeholder="e.g., movies, games, social media"
          className="keyword-input"
        />
        <button type="submit" className="keyword-add-button">
          <Plus size={18} />
          Add Keyword
        </button>
      </form>

      {keywords.length > 0 ? (
        <div className="keywords-list">
          {keywords.map((keyword, index) => (
            <div key={index} className="keyword-item">
              <span className="keyword-text">{keyword}</span>
              <button
                className="keyword-remove-button"
                onClick={() => handleRemoveKeyword(keyword)}
                aria-label={`Remove ${keyword}`}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="keywords-empty">
          No blocked keywords. Add keywords to monitor employee browsing.
        </div>
      )}
    </div>
  );
}


