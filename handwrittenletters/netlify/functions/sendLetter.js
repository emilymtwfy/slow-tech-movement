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

    // Log image URL to verify
    console.log("Image URL being sent in email:", imageUrl);

    const result = await resend.emails.send({
      from: 'HandwrittenLetters@slowtechmovement.com',
      to: recipientEmail,
      subject: 'You have received a handwritten letter',
      html: `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #000000; padding: 40px 0;">
  <tr>
    <td align="center">
      <!-- Outer letter "paper" -->
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #1a1a1a; border: 10px solid #e2d3b3; border-radius: 8px; font-family: 'Georgia', serif; color: #ffffff;">
        <tr>
          <td style="padding: 30px;">
            <h2 style="margin-top: 0; font-size: 24px; color: #f4e9d8;">You've received a handwritten letter</h2>
            ${message ? `<p style="font-size: 16px; line-height: 1.5; color: #dddddd;">${message}</p>` : ''}
            <p style="margin-top: 20px; text-align: center;">
              <img src="${imageUrl}" alt="Handwritten Letter" style="max-width: 100%; border: 4px solid #e2d3b3; border-radius: 4px;" />
            </p>
            <p style="margin-top: 30px; font-size: 14px; color: #888888;">Sent with care via <em>Slow Tech Movement</em></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
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
