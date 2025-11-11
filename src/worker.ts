// @ts-expect-error - worker.js will be generated during build
import { default as handler } from "../.open-next/worker.js";
import emailHandler from "@/lib/email/handler";
import scheduledHandler from "@/lib/scheduled/handler";

export default {
  fetch: handler.fetch,

  email: emailHandler,

  scheduled: scheduledHandler,
} satisfies ExportedHandler<CloudflareEnv>;

// @ts-expect-error - worker.js will be generated during build
export { DOQueueHandler, DOShardedTagCache } from "../.open-next/worker.js";
