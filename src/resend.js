export const sendLetter = async ({ imageUrl, recipientEmail, message }) => {
  const response = await fetch('/.netlify/functions/sendLetter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl, recipientEmail, message }),
  });

  return response.json();
};