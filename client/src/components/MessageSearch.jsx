import React, { useState } from 'react';
import { useSocket } from '../socket/socket';

const MessageSearch = () => {
  const { messages } = useSocket();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      const results = messages.filter((msg) =>
        msg.message?.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="p-4 border-b">
      <input
        type="text"
        placeholder="Search messages..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-2 border rounded-md"
      />
      {searchResults.length > 0 && (
        <div className="mt-2 max-h-40 overflow-y-auto">
          {searchResults.map((msg) => (
            <div key={msg.id} className="p-2 bg-gray-100 rounded-md mb-2">
              <strong>{msg.sender}</strong>: {msg.message}
              <span className="text-xs text-gray-500 ml-2">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageSearch;