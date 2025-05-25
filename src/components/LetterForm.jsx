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
{/* EHR 5/24: removing this for now - doesn't seem necessary     {file && <p>Selected file: {file.name}</p>}*/}

      <input
        type="email"
        placeholder="Recipient Email"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        required
      />

<p style={{ marginBottom: '.5rem' }}>Choose a suggested message:</p>
<div className="message-options">
  {[
    "Handwritten letters are a mix of fast and slow technology. It takes longer to compose a handwritten letter, but it can be well worth the extra time and care it takes to write one. This handwritten letter was created and sent with care via the Slow Tech Movement.",
    "Sending a handwritten letter is a small act of presence in a busy world. I hope this message brings a pause, a smile, or a moment of connection.",
    "This letter comes from a place of thoughtfulness. May it reach you warmly, and may it remind you that intentional words still travel meaningfully through both paper and pixels."
  ].map((msg, index) => (
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
        placeholder="Handwritten letters are a mix of fast and slow technology. It takes longer to compose a handwritten letter, but it can be well worth the extra time and care it takes to write one. This handwritten letter was created and sent with care via the Slow Tech Movement."
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
