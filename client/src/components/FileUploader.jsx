import React, { useState } from 'react';
import { useSocket } from '../socket/socket';

const FileUploader = () => {
  const { currentRoom, isConnected } = useSocket();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.filename) {
        socket.emit('send_file', { filename: data.filename, room: currentRoom });
        setFile(null);
      } else {
        setError(data.error || 'File upload failed');
      }
    } catch (err) {
      setError('Error uploading file');
      console.error('File upload error:', err);
    }
  };

  return (
    <div className="p-4 border-t">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-2"
        disabled={!isConnected}
      />
      <button
        onClick={handleUpload}
        disabled={!file || !isConnected}
        className="p-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
      >
        Upload Image
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default FileUploader;