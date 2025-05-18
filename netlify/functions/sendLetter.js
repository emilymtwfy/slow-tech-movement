const Resend = require('resend');
const resend = new Resend(process.env.VITE_RESEND_API_KEY);

exports.handler = async (event) => {
  const { imageUrl, recipientEmail, message } = JSON.parse(event.body);

  try {
    await resend.emails.send({
      from: 'letters@yourdomain.com',
      to: recipientEmail,
      subject: 'You have received a handwritten letter',
      html: `
        <h2>This letter was sent with care.</h2>
        <p>${message}</p>
        <img src="${imageUrl}" alt="Handwritten Letter" style="max-width:100%;" />
      `,
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
};
