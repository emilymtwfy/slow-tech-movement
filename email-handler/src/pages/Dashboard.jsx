import { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function Dashboard() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [gift, setGift] = useState('');

  console.log("Current user:", auth.currentUser);
  console.log("Submitting message:", subject, body, gift);
console.log("Saving:", { subject, body, gift });


const handleSubmit = async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to save messages.");
    return;
  }

  try {
    await addDoc(collection(db, "users", user.uid, "messages"), {
      subject,
      body,
      gift,
      createdAt: serverTimestamp()
    });

    setSubject('');
    setBody('');
    setGift('');
    alert("Message saved!");
  } catch (err) {
    console.error("Error saving message:", err);
    alert("Something went wrong.");
  }
};


  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: 'auto' }}>
      <h1>Email Handler Dashboard</h1>

      {/* ✍️ Section 1: Create a new message */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Create New Autoresponder</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Subject line"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
          />
          <textarea
            placeholder="Message body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={5}
            style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
          />
          <input
            type="text"
            placeholder="Optional gift (link to poem, video, etc.)"
            value={gift}
            onChange={(e) => setGift(e.target.value)}
            style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
          />
          <button type="submit">Save Message</button>
        </form>
      </section>

      {/* 📚 Section 2: Message history (placeholder for now) */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>My Message Library</h2>
        <p>Coming soon: your saved messages will appear here.</p>
      </section>

      {/* 🧩 Section 3: Templates */}
      <section>
        <h2>Templates</h2>
        <p>Coming soon: choose from creative, poetic, or professional autoresponders to start from.</p>
      </section>
    </div>
  );
}

export default Dashboard;
