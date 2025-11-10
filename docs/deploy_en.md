## Deployment

**Get Cloudflare API Token**

Visit [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)

![](images/api_create_1.png)
![](images/api_create_2.png)
![](images/api_create_3.png)
![](images/api_create_4.png)

Save the token and copy it to GitHub Secrets as `CLOUDFLARE_API_TOKEN`

**Get Cloudflare Account ID**
1. The Account ID can be found in the account settings of the Cloudflare dashboard.
2. Copy it to GitHub Secrets as `CLOUDFLARE_ACCOUNT_ID`

**Get D1 Database ID**
Visit the [D1 Database](https://dash.cloudflare.com/?to=/:account/workers/d1) page
![](images/worker_d1_1.png)
![](images/worker_d1_2.png)
![](images/worker_d1_3.png)

Copy it to GitHub Secrets as `D1_DATABASE_ID`

**Configure GitHub Repository**

1. Fork the repository [bestruirui/Alle](https://github.com/bestruirui/Alle/fork)
2. Go to your GitHub repository settings
3. Navigate to Settings → Secrets and variables → Actions → New Repository secrets
4. Add the following Secrets:

| Secret Name             | Required | Purpose                                                  |
| ----------------------- | :--: | ----------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  |  ✅  | Cloudflare API token (requires Workers and related resource permissions)     |
| `CLOUDFLARE_ACCOUNT_ID` |  ✅  | Cloudflare Account ID                                    |
| `D1_DATABASE_ID`        |  ✅  | ID of your D1 database                                   |
| `USERNAME`              |  ✅  | Your email username                                        |
| `PASSWORD`              |  ✅  | Your email password                                          |
| `OPENAI_API_KEY`        |  ❌  | OpenAI API key, defaults to using Worker AI                     |
| `OPENAI_BASE_URL`       |  ❌  | OpenAI API base URL, defaults to using Worker AI                 |

![](images/github_1.png)
5. Add the following Variables

| Variables              | Required | Purpose                                                    |
| ----------------------- | :--: | ----------------------------------------------------- |
| `ENABLE_AI_EXTRACT`     |  ❌  | Whether to enable AI recognition, disabled by default                           |
| `EXTRACT_MODEL`         |  ❌  | AI recognition model, model needs to support JSON Mode                     |
| `JWT_MIN_TTL`           |  ❌  | JWT minimum TTL, default 300s                                 |
| `JWT_MAX_TTL`           |  ❌  | JWT maximum TTL, default 6000s                                |

![](images/github_2.png)

**Run Workflow**
1. Then manually run the workflow on the Actions page
2. For later updates, simply click the Sync Upstream button


**Supported Models**

Please refer to [Cloudflare Workers AI Supported Models](https://developers.cloudflare.com/workers-ai/features/json-mode/#supported-models) for more information.