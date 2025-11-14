## Deployment

> [!WARNING]
> This project requires at least one domain hosted on Cloudflare

**Get Cloudflare API Token**

Visit [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)

![](images/api_create_1.png)
![](images/api_create_2.png)
![](images/api_create_3.png)
![](images/api_create_4.png)

Save the token and copy it to GitHub Secrets as `CLOUDFLARE_API_TOKEN`

**Get Cloudflare Account ID**
1. Account ID can be found in Cloudflare dashboard's account settings.
2. Copy it to GitHub Secrets as `CLOUDFLARE_ACCOUNT_ID`

**Get D1 Database ID**
Visit [D1 Databases](https://dash.cloudflare.com/?to=/:account/workers/d1) page
![](images/worker_d1_1.png)
![](images/worker_d1_2.png)
![](images/worker_d1_3.png)

Copy to GitHub Secrets as `D1_DATABASE_ID`

**Configure GitHub Repository**

1. Fork the repository [bestruirui/Alle](https://github.com/bestruirui/Alle/fork)
2. Go to your GitHub repository settings
3. Navigate to Settings → Secrets and variables → Actions → New Repository secrets
4. Add the following Secrets:

| Secret Name             | Required | Purpose                                                  |
| ----------------------- | :------: | ----------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  |    ✅    | Cloudflare API Token (requires Workers and related resources permissions)     |
| `CLOUDFLARE_ACCOUNT_ID` |    ✅    | Cloudflare Account ID                                    |
| `D1_DATABASE_ID`        |    ✅    | Your D1 database ID                                   |
| `USERNAME`              |    ✅    | Your email username                                        |
| `PASSWORD`              |    ✅    | Your email password                                          |
| `OPENAI_API_KEY`        |    ❌    | OpenAI API key, defaults to using Worker AI                     |
| `OPENAI_BASE_URL`       |    ❌    | OpenAI API base URL, defaults to using Worker AI                 |

![](images/github_1.png)
5. Add the following Variables

| Variables              | Required | Purpose                                                    |
| ----------------------- | :------: | ----------------------------------------------------- |
| `ENABLE_AI_EXTRACT`     |    ❌    | Whether to enable AI recognition, disabled by default                           |
| `EXTRACT_MODEL`         |    ❌    | AI recognition model, model needs to support JSON Mode                     |
| `ENABLE_AUTO_DEL`       |    ❌    | Whether to enable automatic deletion of expired emails, disabled by default                    |
| `AUTO_DEL_TYPE`         |    ❌    | Automatic deletion of expired email types, multiple types separated by commas                |
| `AUTO_DEL_CRON`         |    ❌    | Cron job for automatic deletion of expired emails, disabled by default                    |
| `AUTO_DEL_TIME`         |    ❌    | Time for automatic deletion of expired emails, in seconds                            |
| `JWT_MIN_TTL`           |    ❌    | JWT minimum TTL, defaults to 300s                                 |
| `JWT_MAX_TTL`           |    ❌    | JWT maximum TTL, defaults to 6000s                                |
| `TELEGRAM_TEMPLATE`     |    ❌    | Telegram message template                                          |
| `TELEGRAM_TYPE`         |    ❌    | Email types for Telegram delivery                                 |

![](images/github_2.png)

6. If you want to use Telegram Bot notifications, also add the following Secrets:

| Secret Name             | Required | Purpose                                                  |
| ----------------------- | :------: | ----------------------------------------------------- |
| `TELEGRAM_BOT_TOKEN`    |    ❌    | Telegram Bot Token                                    |
| `TELEGRAM_CHAT_ID`      |    ❌    | Telegram Chat ID                                      |

**Run Workflow**
1. Then manually run the workflow on the Actions page
2. For future updates, just click the Sync Upstream button

**Enable Email Forwarding**

1. Visit [Email Routing](http://dash.cloudflare.com/?to=/:account/:zone/email/routing/routes) page

2. Set up email forwarding to alle

![](images/forward_1.png)

For domain `example.com`, the forwarding address should be `any-value@example.com`

For example, `temp@example.com`, `alle@example.com`, `any@example.com` - emails received at these addresses will all be displayed in Alle



## Email Types

| Type | Description |
| ---  | --- |
| auth_code | Authorization code |
| auth_link | Authorization link |
| service_link | Service link, e.g. GitHub PR request notifications |
| subscription_link | Unsubscribe link for advertisements |
| other_link | Other links |
| none | None |

## AI Recognition


Set `ENABLE_AI_EXTRACT` to true

- Use Worker AI directly

Choose a model from [Cloudflare Workers AI supported models](https://developers.cloudflare.com/workers-ai/features/json-mode/#supported-models) and fill in `EXTRACT_MODEL`

- Custom model

Needs to support JSON MODE, fill in `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `EXTRACT_MODEL`

## Auto Delete Expired Emails

Set `ENABLE_AUTO_DEL` to true

`AUTO_DEL_TYPE` supported email types

Multiple types are separated by English commas, example
```
AUTO_DEL_TYPE=auth_code,auth_link,service_link,subscription_link,other_link
```

`AUTO_DEL_TIME` automatic deletion time for expired emails, in seconds

`AUTO_DEL_CRON` cron job for automatic deletion of expired emails

## WebHook Notification

`WEBHOOK_URL` WebHook URL

`WEBHOOK_TYPE` Email types for WebHook delivery

Multiple types are separated by English commas, example

```
WEBHOOK_TYPE=auth_code,auth_link,service_link,subscription_link,other_link

```
`WEBHOOK_TEMPLATE` WebHook template

Template supported variables

| Variable | Description |
| --- | --- |
| messageId | Email ID |
| fromAddress | Sender address |
| fromName | Sender name |
| toAddress | Recipient address |
| recipient | Recipient |
| title | Email title |
| bodyText | Email text content |
| bodyHtml | Email HTML content |
| sentAt | Send time |
| receivedAt | Receive time |
| emailType | Email type |
| emailResult | Email result |
| emailResultText | Email result text |
| emailError | Email error |

Note: WebHook template needs to be escaped, here's an example
```
{\"text\":{\"content\":\"{{fromName}}  {{emailResult}}\"},\"msgtype\":\"text\",}
```

## Telegram Bot Notification

`TELEGRAM_BOT_TOKEN` Telegram Bot Token

`TELEGRAM_CHAT_ID` Telegram Chat ID

`TELEGRAM_TYPE` Email types for Telegram delivery

Multiple types are separated by English commas, example

```
TELEGRAM_TYPE=auth_code,auth_link,service_link,subscription_link,other_link
```

`TELEGRAM_TEMPLATE` Telegram message template

Template supports the same variables as WebHook and supports HTML format, example:
```
<b>New Email Notification</b>
From: {fromName}
Subject: {title}
Type: {emailType}
Result: {emailResult}
```