import emailDB from "@/lib/db/email";
import extract from "./extract";
import sendWebhook from '@/lib/webhook/webhook'
import sendTelegramMessage from '@/lib/telegram/telegram'
import PostalMime from "postal-mime";
import * as cheerio from 'cheerio';
import type { Email, NewEmail } from "@/types";


function replaceTemplateAdvanced(template: string, email: Email): string {
    return template.replace(/{(\w+)}/g, (match, key) => {
        const value = email[key as keyof Email];
        if (value === null || value === undefined) {
            return '';
        }
        return JSON.stringify(String(value)).slice(1, -1);
    });
}

export default async function storeEmail(
    message: ForwardableEmailMessage,
    env: CloudflareEnv
): Promise<void> {
    try {
        const reader = message.raw.getReader();
        let content = "";
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            content += new TextDecoder().decode(value);
        }

        const email = await PostalMime.parse(content);

        const $ = cheerio.load(email.html || "")
        $('script').remove();
        $('style').remove();
        $('a').each(function () {
            const $elem = $(this);
            const href = $elem.attr('href');
            const text = $elem.text().trim();

            if (href && text) {
                $elem.replaceWith(`[${text}](${href})`);
            } else if (href) {
                $elem.replaceWith(href);
            }
        });
        const emailText = $('body').text().replace(/\s+/g, ' ').trim();

        const allContent = [email.subject || '', email.text || '', emailText].filter(Boolean).join('\n');

        const result = await extract(allContent, env);

        console.log(result.type, result.result, result.result_text);

        const emailFromAddress = email.from?.address || message.from || null;
        const emailFromName = email.from?.name || (emailFromAddress ? emailFromAddress.split("@")[0] : null);
        const emailData: NewEmail = {
            messageId: email.messageId || null,
            fromAddress: emailFromAddress,
            fromName: emailFromName,
            toAddress: email.deliveredTo || message.to,
            recipient: JSON.stringify(email.to),
            title: email.subject || null,
            bodyText: email.text || "",
            bodyHtml: email.html || "",
            sentAt: email.date || null,
            receivedAt: new Date().toISOString(),
            emailType: result.type,
            emailResult: result.result || "",
            emailResultText: result.result_text || "",
            emailError: null,
            readStatus: 0,
        };

        const res = await emailDB.create(env, emailData);

        if (env.WEBHOOK_URL && env.WEBHOOK_TEMPLATE && env.WEBHOOK_TYPE.split(',').includes(emailData.emailType)) {
            await sendWebhook(replaceTemplateAdvanced(env.WEBHOOK_TEMPLATE, res), env.WEBHOOK_URL);
        }

        // 发送到Telegram Bot
        if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID && env.TELEGRAM_TEMPLATE && env.TELEGRAM_TYPE && env.TELEGRAM_TYPE.split(',').includes(emailData.emailType)) {
            await sendTelegramMessage(
                replaceTemplateAdvanced(env.TELEGRAM_TEMPLATE, res),
                env.TELEGRAM_BOT_TOKEN,
                env.TELEGRAM_CHAT_ID
            );
        }
        console.log("Email stored successfully:", {
            id: res.id,
            messageId: emailData.messageId,
            from: emailData.fromAddress,
            to: emailData.toAddress,
            emailType: emailData.emailType,
        });
    } catch (e) {
        console.error("Failed to store email:", e);
        throw e;
    }
}
