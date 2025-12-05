import { Settings as SettingsIcon, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

export function Settings({ settings, onUpdate, mode }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleStartHourChange = (hour) => {
    onUpdate({
      activeHours: {
        ...settings.activeHours,
        start: hour,
      },
    });
  };

  const handleEndHourChange = (hour) => {
    onUpdate({
      activeHours: {
        ...settings.activeHours,
        end: hour,
      },
    });
  };

  return (
    <div className="settings">
      <button
        className="settings-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle settings"
      >
        <SettingsIcon size={20} />
      </button>

      {isOpen && (
        <div className="settings-modal">
          <div className="settings-content">
            <div className="settings-header">
              <h2>Settings</h2>
              <button
                className="close-button"
                onClick={() => setIsOpen(false)}
                aria-label="Close settings"
              >
                ×
              </button>
            </div>

            <div className="settings-section">
              <h3>Theme</h3>
              <button
                className={`theme-toggle ${settings.darkMode ? 'dark' : 'light'}`}
                onClick={() => onUpdate({ darkMode: !settings.darkMode })}
              >
                {settings.darkMode ? <Sun size={18} /> : <Moon size={18} />}
                <span>{settings.darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>

            <div className="settings-section">
              <h3>Active Hours</h3>
              <div className="time-input-group">
                <label>
                  Start Hour:
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={settings.activeHours.start}
                    onChange={(e) => handleStartHourChange(parseInt(e.target.value))}
                  />
                </label>
                <label>
                  End Hour:
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={settings.activeHours.end}
                    onChange={(e) => handleEndHourChange(parseInt(e.target.value))}
                  />
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h3>Boss Intensity</h3>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="intensity"
                    value="gentle"
                    checked={settings.bossIntensity === 'gentle'}
                    onChange={() => onUpdate({ bossIntensity: 'gentle' })}
                  />
                  Gentle
                </label>
                <label>
                  <input
                    type="radio"
                    name="intensity"
                    value="moderate"
                    checked={settings.bossIntensity === 'moderate'}
                    onChange={() => onUpdate({ bossIntensity: 'moderate' })}
                  />
                  Moderate
                </label>
                <label>
                  <input
                    type="radio"
                    name="intensity"
                    value="harsh"
                    checked={settings.bossIntensity === 'harsh'}
                    onChange={() => onUpdate({ bossIntensity: 'harsh' })}
                  />
                  Harsh
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h3>Notifications</h3>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => onUpdate({ notificationsEnabled: e.target.checked })}
                />
                Enable Notifications
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.hourlyCheckEnabled}
                  onChange={(e) => onUpdate({ hourlyCheckEnabled: e.target.checked })}
                />
                Enable Hourly Activity Checks
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

