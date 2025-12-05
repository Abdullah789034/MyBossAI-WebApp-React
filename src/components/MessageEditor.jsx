import { MessageSquare, X, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

export function MessageEditor({ settings, isOpen, onClose, loadMessages, updateMessages }) {
  const [messages, setMessages] = useState({
    gentle: { warning: [], critical: [], info: [], motivation: [] },
    moderate: { warning: [], critical: [], info: [], motivation: [] },
    harsh: { warning: [], critical: [], info: [], motivation: [] },
  });
  const [selectedType, setSelectedType] = useState('warning');
  const [selectedIntensity, setSelectedIntensity] = useState(settings.bossIntensity);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (loadMessages) {
        loadMessagesData();
      } else {
        // Load default messages structure
        setMessages({
          gentle: {
            warning: ["Hey, I noticed you haven't been active for a while. Everything okay?"],
            critical: ["You've been inactive during work hours. Please get back on track."],
            info: ["New task assigned! Check your dashboard."],
            motivation: ["You're doing great! Keep up the good work!"],
          },
          moderate: {
            warning: ["You're slacking off. Get back to work now."],
            critical: ["This is your final warning. You're not meeting expectations."],
            info: ["New task assigned. Complete it by the deadline."],
            motivation: ["Good work, but don't get complacent."],
          },
          harsh: {
            warning: ["What the hell are you doing? Get back to work NOW!"],
            critical: ["This is absolutely unacceptable! You're fired if this continues!"],
            info: ["New task. Complete it or else."],
            motivation: ["Finally, some actual work. Don't mess it up."],
          },
        });
      }
    }
  }, [isOpen, selectedIntensity]);

  const loadMessagesData = async () => {
    if (!loadMessages) return;
    
    setLoading(true);
    try {
      const data = await loadMessages();
      // Merge with defaults if API returns empty structure
      if (data) {
        const merged = {
          gentle: {
            warning: data.gentle?.warning?.length > 0 ? data.gentle.warning : ["Hey, I noticed you haven't been active for a while. Everything okay?"],
            critical: data.gentle?.critical?.length > 0 ? data.gentle.critical : ["You've been inactive during work hours. Please get back on track."],
            info: data.gentle?.info?.length > 0 ? data.gentle.info : ["New task assigned! Check your dashboard."],
            motivation: data.gentle?.motivation?.length > 0 ? data.gentle.motivation : ["You're doing great! Keep up the good work!"],
          },
          moderate: {
            warning: data.moderate?.warning?.length > 0 ? data.moderate.warning : ["You're slacking off. Get back to work now."],
            critical: data.moderate?.critical?.length > 0 ? data.moderate.critical : ["This is your final warning. You're not meeting expectations."],
            info: data.moderate?.info?.length > 0 ? data.moderate.info : ["New task assigned. Complete it by the deadline."],
            motivation: data.moderate?.motivation?.length > 0 ? data.moderate.motivation : ["Good work, but don't get complacent."],
          },
          harsh: {
            warning: data.harsh?.warning?.length > 0 ? data.harsh.warning : ["What the hell are you doing? Get back to work NOW!"],
            critical: data.harsh?.critical?.length > 0 ? data.harsh.critical : ["This is absolutely unacceptable! You're fired if this continues!"],
            info: data.harsh?.info?.length > 0 ? data.harsh.info : ["New task. Complete it or else."],
            motivation: data.harsh?.motivation?.length > 0 ? data.harsh.motivation : ["Finally, some actual work. Don't mess it up."],
          },
        };
        setMessages(merged);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      // Use defaults on error
    } finally {
      setLoading(false);
    }
  };

  const handleMessageChange = (index, value) => {
    const newMessages = { ...messages };
    if (!newMessages[selectedIntensity]) {
      newMessages[selectedIntensity] = { warning: [], critical: [], info: [], motivation: [] };
    }
    if (!newMessages[selectedIntensity][selectedType]) {
      newMessages[selectedIntensity][selectedType] = [];
    }
    newMessages[selectedIntensity][selectedType] = [...newMessages[selectedIntensity][selectedType]];
    newMessages[selectedIntensity][selectedType][index] = value;
    setMessages(newMessages);
  };

  const addMessage = () => {
    const newMessages = { ...messages };
    if (!newMessages[selectedIntensity]) {
      newMessages[selectedIntensity] = { warning: [], critical: [], info: [], motivation: [] };
    }
    if (!newMessages[selectedIntensity][selectedType]) {
      newMessages[selectedIntensity][selectedType] = [];
    }
    newMessages[selectedIntensity][selectedType] = [...newMessages[selectedIntensity][selectedType], ''];
    setMessages(newMessages);
  };

  const removeMessage = (index) => {
    const newMessages = { ...messages };
    if (newMessages[selectedIntensity] && newMessages[selectedIntensity][selectedType]) {
      newMessages[selectedIntensity][selectedType] = newMessages[selectedIntensity][selectedType].filter((_, i) => i !== index);
      setMessages(newMessages);
    }
  };

  const handleSave = async () => {
    if (!updateMessages) return;
    
    try {
      const messagesToSave = messages[selectedIntensity]?.[selectedType] || [];
      await updateMessages(selectedIntensity, selectedType, messagesToSave);
      alert('Messages saved successfully!');
    } catch (error) {
      alert('Failed to save messages. Please try again.');
      console.error('Save error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="message-editor-modal">
      <div className="message-editor-content">
        <div className="message-editor-header">
          <h2>Edit Messages</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="message-editor-controls">
          <label>
            Intensity:
            <select
              value={selectedIntensity}
              onChange={(e) => setSelectedIntensity(e.target.value)}
            >
              <option value="gentle">Gentle</option>
              <option value="moderate">Moderate</option>
              <option value="harsh">Harsh</option>
            </select>
          </label>
          <label>
            Message Type:
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
              <option value="info">Info</option>
              <option value="motivation">Motivation</option>
            </select>
          </label>
        </div>

        <div className="message-list">
          <div className="message-list-header">
            <h3>{selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Messages ({selectedIntensity})</h3>
            <button className="add-message-button" onClick={addMessage}>
              <MessageSquare size={16} />
              Add Message
            </button>
          </div>
          {messages[selectedIntensity]?.[selectedType]?.length > 0 ? (
            messages[selectedIntensity][selectedType].map((message, index) => (
              <div key={index} className="message-item">
                <textarea
                  value={message}
                  onChange={(e) => handleMessageChange(index, e.target.value)}
                  placeholder="Enter message..."
                  rows="2"
                />
                <button
                  className="remove-message-button"
                  onClick={() => removeMessage(index)}
                  aria-label="Remove message"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No messages for this type. Click "Add Message" to create one.
            </div>
          )}
        </div>

        <div className="message-editor-actions">
          <button className="save-button" onClick={handleSave}>
            <Save size={18} />
            Save Messages
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

