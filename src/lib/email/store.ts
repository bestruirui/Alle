import PostalMime from "postal-mime";
import sanitizeHtml from "sanitize-html";
import emailDB from "../db/email";
import type { NewEmail } from "@/types";
import extract from "./extract";

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

        let emailText = email.text || sanitizeHtml(email.html || "", { allowedTags: [] }) || "";
        emailText = emailText.split("\n").map((line: string) => line.trim()).filter((line: string) => line).join("\n");

        const result = await extract(emailText, env);

        console.log(result.type, result.code, result.link, result.error);

        const emailFromAddress = email.from?.address || message.from || null;
        const emailFromName = email.from?.name || (emailFromAddress ? emailFromAddress.split("@")[0] : null);
        const emailData: NewEmail = {
            messageId: email.messageId || null,
            fromAddress: emailFromAddress,
            fromName: emailFromName,
            senderAddress: email.sender?.address || email.from?.address || message.from || null,
            toAddress: message.to,
            recipient: JSON.stringify(email.to),
            subject: email.subject || null,
            bodyText: emailText,
            bodyHtml: email.html || "",
            sentAt: email.date || null,
            receivedAt: new Date().toISOString(),
            verificationType: result.type || "none",
            verificationCode: result.code || "",
            verificationLink: result.link || "",
            verificationUsed: false,
            extractResult: JSON.stringify(result),
        };

        const res = await emailDB.create(env, emailData);

        console.log("Email stored successfully:", {
            id: res.id,
            messageId: emailData.messageId,
            from: emailData.fromAddress,
            to: emailData.toAddress,
            verificationType: emailData.verificationType,
        });
    } catch (e) {
        console.error("Failed to store email:", e);
        throw e;
    }
}
