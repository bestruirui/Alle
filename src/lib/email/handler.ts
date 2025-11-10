import storeEmail from "./store";

export default async function emailHandler(
  message: ForwardableEmailMessage,
  env: CloudflareEnv,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ctx: ExecutionContext
): Promise<void> {
  const startTime = performance.now();
  try {
    await storeEmail(message, env);
    const duration = (performance.now() - startTime).toFixed(2);
    console.log(`Processing the email took: ${duration}ms`);
  } catch (error) {
    console.error("Failed to process email:", error);
  }
}
