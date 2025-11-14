## 部署

> [!WARNING]  
> 此项目需要至少一个托管在Cloudflare的域名

**获取 Cloudflare API 令牌**

访问 [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)

![](images/api_create_1.png)
![](images/api_create_2.png)
![](images/api_create_3.png)
![](images/api_create_4.png)

保存令牌并复制到 GitHub Secrets 中的 `CLOUDFLARE_API_TOKEN`

**获取 Cloudflare 账户 ID**
1. 账户 ID 可以在 Cloudflare 仪表盘的账户设置中找到。
2. 复制到 GitHub Secrets 中的 `CLOUDFLARE_ACCOUNT_ID`

**获取 D1 数据库 ID**
访问 [D1 数据库](https://dash.cloudflare.com/?to=/:account/workers/d1) 页面
![](images/worker_d1_1.png)
![](images/worker_d1_2.png)
![](images/worker_d1_3.png)

复制到 GitHub Secrets 中的 `D1_DATABASE_ID`

**配置 Github 仓库**

1. Fork 仓库 [bestruirui/Alle](https://github.com/bestruirui/Alle/fork)
2. 进入您的 GitHub 仓库设置
3. 转到 Settings → Secrets and variables → Actions → New Repository secrets
4. 添加以下 Secrets：

| Secret 名称             | 必需 | 用途                                                  |
| ----------------------- | :--: | ----------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  |  ✅  | Cloudflare API 令牌（需要 Workers 和相关资源权限）     |
| `CLOUDFLARE_ACCOUNT_ID` |  ✅  | Cloudflare 账户 ID                                    |
| `D1_DATABASE_ID`        |  ✅  | 您的 D1 数据库的 ID                                   |
| `USERNAME`              |  ✅  | 您的邮箱用户名                                        |
| `PASSWORD`              |  ✅  | 您的邮箱密码                                          |
| `OPENAI_API_KEY`        |  ❌  | OpenAI API 密钥,默认使用Worker AI                     |
| `OPENAI_BASE_URL`       |  ❌  | OpenAI API 基础 URL,默认使用Worker AI                 |

![](images/github_1.png)
5. 添加以下 Variables

| Variables              | 必需 | 用途                                                    |
| ----------------------- | :--: | ----------------------------------------------------- |
| `ENABLE_AI_EXTRACT`     |  ❌  | 是否启用 AI 识别,默认不启用                           |
| `EXTRACT_MODEL`         |  ❌  | AI 识别模型,模型需要支持JSON Mode                     |
| `ENABLE_AUTO_DEL`       |  ❌  | 是否启用自动删除过期邮件,默认不启用                    |
| `AUTO_DEL_TYPE`         |  ❌  | 自动删除过期邮件类型,多个类型用逗号分隔                |
| `AUTO_DEL_CRON`         |  ❌  | 自动删除过期邮件定时任务,默认不启用                    |
| `AUTO_DEL_TIME`         |  ❌  | 自动删除过期邮件时间,单位秒                            |
| `JWT_MIN_TTL`           |  ❌  | JWT 最小 TTL,默认300s                                 |
| `JWT_MAX_TTL`           |  ❌  | JWT 最大 TTL,默认6000s                                |
| `TELEGRAM_TEMPLATE`     |  ❌  | Telegram 消息模板                                     |
| `TELEGRAM_TYPE`         |  ❌  | Telegram 发送的邮件类型                               |

![](images/github_2.png)

6. 如需使用Telegram Bot通知，还需添加以下 Secrets：

| Secret 名称             | 必需 | 用途                                                  |
| ----------------------- | :--: | ----------------------------------------------------- |
| `TELEGRAM_BOT_TOKEN`    |  ❌  | Telegram Bot Token                                    |
| `TELEGRAM_CHAT_ID`      |  ❌  | Telegram Chat ID                                      |



**运行工作流**
1. 然后在Action页面手动运行工作流
2. 后期更新手动点击Sync Upstream按钮即可

**启用邮件转发**

1.访问[邮件转发](http://dash.cloudflare.com/?to=/:account/:zone/email/routing/routes)页面

2.设置邮件转发到alle

![](images/forward_1.png)

域名为 `example.com`, 则转发地址为 `任意值@example.com`

例如 `temp@example.com`,`alle@example.com`,`any@example.com` 这些地址收到的邮件都会显示在Alle中


## 邮件类型

| 类型 | 描述 |
| ---  | --- |
| auth_code | 授权码 |
| auth_link | 授权链接 |
| service_link | 服务链接,例如Github的pr请求通知 |
| subscription_link | 广告链接的退订链接 |
| other_link | 其他链接 |
| none | 无 |

## AI 识别


`ENABLE_AI_EXTRACT`填写true

- 直接使用 Woreker AI

这里挑一个模型 [Cloudflare Workers AI 支持的模型](https://developers.cloudflare.com/workers-ai/features/json-mode/#supported-models) 填写 `EXTRACT_MODEL`

- 自定义模型

需要支持JSON MODE,填写`OPENAI_API_KEY`,`OPENAI_BASE_URL`,`EXTRACT_MODEL`

## 自动删除过期邮件

`ENABLE_AUTO_DEL`填写true

`AUTO_DEL_TYPE` 支持的邮件类型

多种类型使用英文逗号分隔,示例
```
AUTO_DEL_TYPE=auth_code,auth_link,service_link,subscription_link,other_link
```

`AUTO_DEL_TIME` 自动删除过期邮件时间,单位秒

`AUTO_DEL_CRON` 自动删除过期邮件定时任务

## WebHook 通知

`WEBHOOK_URL` WebHook URL

`WEBHOOK_TYPE` WebHook 发送的邮件类型

多种类型使用英文逗号分隔,示例

```
WEBHOOK_TYPE=auth_code,auth_link,service_link,subscription_link,other_link

```
`WEBHOOK_TEMPLATE` WebHook 模板

模板支持的变量

| 变量 | 描述 |
| --- | --- |
| messageId | 邮件ID |
| fromAddress | 发件人地址 |
| fromName | 发件人名称 |
| toAddress | 收件人地址 |
| recipient | 收件人 |
| title | 邮件标题 |
| bodyText | 邮件文本内容 |
| bodyHtml | 邮件HTML内容 |
| sentAt | 发送时间 |
| receivedAt | 接收时间 |
| emailType | 邮件类型 |
| emailResult | 邮件结果 |
| emailResultText | 邮件结果文本 |
| emailError | 邮件错误 |

注意 WebHook 模板 需要转义,下方是一个示例
```
{\"text\":{\"content\":\"{{fromName}}  {{emailResult}}\"},\"msgtype\":\"text\",}
```

## Telegram Bot 通知

`TELEGRAM_BOT_TOKEN` Telegram Bot Token

`TELEGRAM_CHAT_ID` Telegram Chat ID

`TELEGRAM_TYPE` Telegram 发送的邮件类型

多种类型使用英文逗号分隔,示例

```
TELEGRAM_TYPE=auth_code,auth_link,service_link,subscription_link,other_link
```

`TELEGRAM_TEMPLATE` Telegram 消息模板

模板支持的变量与WebHook相同，支持HTML格式，示例：
```
<b>新邮件通知</b>
发件人: {fromName}
标题: {title}
类型: {emailType}
结果: {emailResult}
```