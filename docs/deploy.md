## 部署

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
| `JWT_MIN_TTL`           |  ❌  | JWT 最小 TTL,默认300s                                 |
| `JWT_MAX_TTL`           |  ❌  | JWT 最大 TTL,默认6000s                                |

![](images/github_2.png)



**运行工作流**
1. 然后在Action页面手动运行工作流
2. 后期更新手动点击Sync Upstream按钮即可


**支持的模型**

详情参考 [Cloudflare Workers AI 支持的模型](https://developers.cloudflare.com/workers-ai/features/json-mode/#supported-models)