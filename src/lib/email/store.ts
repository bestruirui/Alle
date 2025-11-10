import emailDB from "@/lib/db/email";
import extract from "./extract";
import PostalMime from "postal-mime";
import * as cheerio from 'cheerio';
import type { NewEmail } from "@/types";

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
            toAddress: message.to,
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
        };

        const res = await emailDB.create(env, emailData);

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
