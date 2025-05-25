import React, { useState } from 'react';
import './LetterForm.css';
import { storage, ref, uploadBytes, getDownloadURL } from '../firebase';
import { sendLetter } from '../resend';

const LetterForm = () => {
  const [file, setFile] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setStatus('Uploading letter...');
    const fileRef = ref(storage, `letters/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);

    setStatus('Sending email...');
    const res = await sendLetter({ imageUrl: url, recipientEmail: recipient, message });
    setStatus(res.success ? 'Sent!' : 'Failed to send');
  };

  return (
  
  
  <div
    className="letterform-wrapper"
    style={{
      minHeight: '40vh',
      minWidth: '70vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center', // or 'center' if you prefer vertical centering
    }}
  >
    <form onSubmit={handleSubmit} className="letter-form">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />
      {file && <p>Selected file: {file.name}</p>}

      <input
        type="email"
        placeholder="Recipient Email"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        required
      />
      <textarea
        placeholder="Optional message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send Letter</button>
      <p>{status}</p>
    </form>
  </div>
);

};

export default LetterForm;
