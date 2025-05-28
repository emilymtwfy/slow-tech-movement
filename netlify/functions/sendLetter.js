const { Resend } = require('resend');

const resend = new Resend(process.env.VITE_RESEND_API_KEY);

exports.handler = async (event) => {
  try {
    const { imageUrl, recipientEmail, message } = JSON.parse(event.body);

    console.log("Email send request received:", {
      imageUrl,
      recipientEmail,
      message,
    });

    const result = await resend.emails.send({
      from: 'HandwrittenLetters@slowtechmovement.com',
      to: recipientEmail,
      subject: 'You have received a handwritten letter',
      html: `
       <!--<h2>/Optional Message</h2>*/-->
        <p>${message}</p>
        <img src="${imageUrl}" alt="Handwritten Letter" style="max-width:100%;" />
      `,
    });

    console.log("Resend response:", result);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
