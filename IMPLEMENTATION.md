# 后台自动刷新邮件功能实现

## 概述

本次实现为 Alle 应用添加了基于 React Query 的后台自动刷新邮件功能。通过使用 TanStack Query (React Query v5)，应用现在可以每 30 秒自动在后台获取最新的邮件，无需用户手动点击刷新按钮。

## 实现的功能

### 1. 自动刷新邮件
- ✅ 每 30 秒自动后台刷新邮件列表
- ✅ 支持后台刷新（即使用户切换到其他标签页也会继续刷新）
- ✅ 智能错误重试（普通错误重试 3 次，认证错误不重试）
- ✅ 无缝的用户体验（刷新时显示加载状态但不阻塞界面）

### 2. 优化的代码架构
遵循 KISS、YAGNI、DRY、SOLID 原则重构代码：

#### 新增文件

**API 客户端层** (`src/lib/api/email.ts`)
- 封装了所有邮件相关的 API 调用
- 统一的错误处理
- 遵循 DRY 原则，消除重复的 fetch 代码

**自定义 Hooks**
- `src/hooks/useAuth.ts` - 认证状态管理（单一职责原则）
- `src/hooks/useEmails.ts` - 邮件数据获取和管理（单一职责原则）

**配置常量** (`src/const/config.ts`)
- 集中管理配置常量
- AUTO_REFRESH_INTERVAL: 30 秒刷新间隔
- QUERY_KEYS: React Query 的查询键

#### 重构的文件

**`src/pages/index.tsx`**
- 从 158 行减少到 43 行（减少 73% 的代码量）
- 移除所有复杂的状态管理逻辑
- 使用自定义 hooks 实现关注点分离

**`src/provider/Query.tsx`**
- 配置了 React Query 的全局选项
- staleTime: 1 分钟
- gcTime: 5 分钟
- 自动重试 3 次

**`next.config.ts`**
- 修复了构建时的端口占用问题
- 将 initOpenNextCloudflareForDev() 仅在开发模式下调用

## 技术细节

### 自动刷新配置

```typescript
const query = useQuery<Email[]>({
  queryKey: [QUERY_KEYS.emails, token],
  queryFn: () => fetchEmails({ token }),
  enabled: enabled && !!token,
  refetchInterval: AUTO_REFRESH_INTERVAL, // 30秒
  refetchIntervalInBackground: true,      // 后台也刷新
  retry: (failureCount, error) => {
    if (error.message === "Unauthorized") return false;
    return failureCount < 3;
  },
});
```

### 架构优势

1. **更简洁的代码 (KISS)**
   - 减少了 73% 的页面代码
   - 逻辑清晰，易于理解

2. **避免过度设计 (YAGNI)**
   - 只实现了当前需要的自动刷新功能
   - 没有添加不必要的配置选项

3. **消除重复 (DRY)**
   - API 调用逻辑集中在 `src/lib/api/email.ts`
   - 状态管理逻辑封装在自定义 hooks 中

4. **遵循 SOLID 原则**
   - **单一职责**: 每个 hook 和模块只负责一个明确的功能
   - **开放封闭**: 易于扩展（如添加其他查询），无需修改现有代码
   - **依赖倒置**: 组件依赖于 hooks 抽象，而非具体实现

## 用户体验提升

1. **无需手动刷新**: 邮件会自动在后台更新
2. **智能加载状态**: 初次加载显示骨架屏，后续刷新显示微妙的加载指示
3. **自动错误恢复**: 网络错误会自动重试
4. **会话管理**: Token 过期时自动登出

## 测试结果

✅ `npm run lint` - 通过  
✅ `npm run build` - 通过

## 配置说明

如需修改自动刷新间隔，请编辑 `src/const/config.ts`:

```typescript
export const AUTO_REFRESH_INTERVAL = 1000 * 30; // 30秒，可修改为其他值
```

## 向后兼容性

- ✅ 完全向后兼容现有功能
- ✅ 保持所有现有 API 接口不变
- ✅ 用户界面无变化
