export default async function sendWebhook(url: string, method: 'GET' | 'POST' = 'POST', payload?: string): Promise<void> {
    if (!url) {
        console.error('Webhook error: URL is required')
        return
    }

    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const fetchOptions: RequestInit = {
            method,
            signal: controller.signal
        }

        if (method === 'POST' && payload) {
            fetchOptions.headers = { 'Content-Type': 'application/json' }
            fetchOptions.body = payload
        }

        const response = await fetch(url, fetchOptions)

        clearTimeout(timeoutId)

        if (!response.ok) {
            const errorMsg = `HTTP ${response.status}: ${response.statusText}`
            console.error('Webhook error:', errorMsg)
        }
    } catch (error) {
        console.error('Webhook error:', error)
    }
}
