import React, { useState } from 'react';
  import { useSocket } from '../socket/socket';

  const FileUploader = () => {
    const { currentRoom, isConnected, socket } = useSocket();
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
      setError('');
      console.log('Selected file:', e.target.files[0]?.name);
    };

    const handleUpload = async () => {
      if (!file) {
        setError('No file selected');
        console.log('No file selected');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        console.log('Uploading file to /api/upload');
        const res = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formData,
        });
        console.log('Upload response:', res.status, res.statusText);
        const data = await res.json();
        if (data.filename) {
          console.log('Emitting send_file:', { filename: data.filename, room: currentRoom });
          socket.emit('send_file', { filename: data.filename, room: currentRoom });
          setFile(null);
          setError('');
        } else {
          setError(data.error || 'File upload failed');
          console.error('Upload failed:', data);
        }
      } catch (err) {
        setError('Error uploading file');
        console.error('File upload error:', err);
      }
    };

    return (
      <div className="p-4 border-t bg-gray-50">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-2 p-2 border rounded-md"
          disabled={!isConnected}
        />
        <button
          onClick={handleUpload}
          disabled={!file || !isConnected}
          className="p-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-600 transition"
        >
          Upload Image
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    );
  };

  export default FileUploader;