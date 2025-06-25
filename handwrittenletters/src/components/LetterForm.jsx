import React, { useState, useRef } from 'react';
import { ReactSortable } from "react-sortablejs";
import './LetterForm.css';
import { storage, ref, uploadBytes, getDownloadURL } from '../firebase';
import { sendLetter } from '../resend';

const LetterForm = () => {
  const [files, setFiles] = useState([]);
  const [fileOrder, setFileOrder] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleReset = () => {
    setFiles([]);
    setFileOrder([]);
    setRecipient('');
    setMessage('');
    setStatus('');
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleFileChange = (e) => {
  const selectedFiles = Array.from(e.target.files);
  const newFiles = selectedFiles.map((file, index) => ({
    id: `${file.name}-${index}`, // unique ID for SortableJS
    file,
  }));
  setFiles(newFiles);
};


  const handleOrderChange = (index, newPosition) => {
    const newOrder = [...fileOrder];
    newOrder[index] = parseInt(newPosition, 10);
    setFileOrder(newOrder);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (files.length === 0) return;

  setLoading(true);
  setStatus('Uploading letter...');

  const uploadPromises = files.map((file, index) => {
    const fileName = `${Date.now()}_page-${index + 1}_${file.name}`;
    const storageRef = ref(storage, `letters/${fileName}`);
    return uploadBytes(storageRef, file).then(() => getDownloadURL(storageRef));
  });

  const imageUrls = await Promise.all(uploadPromises);

  setStatus('Sending email...');
  const res = await sendLetter({ imageUrls, recipientEmail: recipient, message });
  setStatus(res.success ? 'Sent!' : 'Failed to send');

  setLoading(false);
};


  return (
    <div className="letterform-container">
      <form onSubmit={handleSubmit} className="letter-form">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          required
          disabled={status === 'Uploading letter...' || status === 'Sending email...' || status === 'Sent!'}
        />


{files.length > 1 && (
  <div className="preview-pages">
    <p style={{ marginTop: '1rem' }}><strong>Reorder your pages:</strong></p>
    <ReactSortable
      list={files}
      setList={setFiles}
      animation={200}
      className="sortable-list"
    >
      {files.map(({ id, file }, i) => (
        <div key={id} className="page-preview-item">
          <img
            src={URL.createObjectURL(file)}
            alt={`Page ${i + 1}`}
            className="thumbnail-preview"
            style={{ maxWidth: '150px', marginBottom: '0.5rem' }}
          />
          <p>Page {i + 1}</p>
        </div>
      ))}
    </ReactSortable>
  </div>
)}


        <input
          type="email"
          placeholder="Recipient Email"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
          disabled={status === 'Uploading letter...' || status === 'Sending email...' || status === 'Sent!'}
        />

        <p style={{ marginBottom: '.5rem' }}>Choose a suggested message:</p>
        <div className="message-options">
          {["Handwritten letters are a mix of fast and slow technology. It takes longer to compose a handwritten letter, but it can be well worth the extra time and care it takes to write one. This handwritten letter was created and sent with care via the Slow Tech Movement.",
            "Sending a handwritten letter is a small act of presence in a busy world. I hope this message brings a pause, a smile, or a moment of connection.",
            "This letter comes from a place of thoughtfulness. May it reach you warmly, and may it remind you that intentional words still travel meaningfully through both paper and pixels."]
            .map((msg, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setMessage(msg)}
                className="suggested-message-button"
              >
                {msg}
              </button>
            ))}
        </div>

        <textarea
          placeholder="Handwritten letters are a mix of fast and slow technology..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={status === 'Uploading letter...' || status === 'Sending email...' || status === 'Sent!'}
        />

        <button type="submit" disabled={loading || status === 'Sent!'}>
          {loading
            ? (status.includes('Uploading') ? 'Uploading...' :
              status.includes('Sending') ? 'Sending...' : 'Sending...')
            : (status === 'Sent!' ? 'Sent!' : 'Send Letter')}
        </button>

        {status === 'Sent!' && (
          <button type="button" onClick={handleReset}>
            Send another letter
          </button>
        )}
      </form>
    </div>
  );
};

export default LetterForm;
