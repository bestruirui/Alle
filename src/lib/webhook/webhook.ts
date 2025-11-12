export default async function sendWebhook(payload: string, url: string): Promise<void> {
    if (!url) {
        console.error('Webhook error: URL is required')
        return
    }

    const requestHeaders = {
        'Content-Type': 'application/json',
    }

    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)
        const response = await fetch(url, {
            method: 'POST',
            headers: requestHeaders,
            body: payload,
            signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            const errorMsg = `HTTP ${response.status}: ${response.statusText}`
            console.error('Webhook error:', errorMsg)
        }
    } catch (error) {
        console.error('Webhook error:', error)
    }
}