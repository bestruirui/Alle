export interface TelegramMessage {
    chat_id: string;
    text: string;
    parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
}

export default async function sendTelegramMessage(
    message: string, 
    botToken: string, 
    chatId: string
): Promise<void> {
    if (!botToken || !chatId) {
        console.error('Telegram error: Bot token and chat ID are required');
        return;
    }

    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const payload: TelegramMessage = {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
    };

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Telegram API error:', response.status, errorText);
            return;
        }

        const result = await response.json() as { message_id?: number };
        console.log('Telegram message sent successfully:', result.message_id);
    } catch (error) {
        console.error('Telegram error:', error);
    }
}