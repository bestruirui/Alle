# React Query 集成文档

## 概述

本项目已经成功集成 `@tanstack/react-query` 用于管理所有 API 请求，并实现了以下功能：

1. **统一的 API 请求管理**：使用 React Query 替代手动 fetch 调用
2. **后台自动刷新**：每 60 秒自动刷新邮件列表
3. **分页加载**：支持无限滚动，按需加载更多邮件
4. **乐观更新**：删除邮件时立即更新 UI，无需等待服务器响应

## 架构设计

### 1. API 客户端层 (`src/lib/api/`)

#### `client.ts`
- 提供统一的 `apiClient` 函数处理所有 HTTP 请求
- 自动附加认证 token
- 统一错误处理（401 自动清理 token）
- 类型安全的响应解析

#### `email.ts`
- 封装邮件相关的 API 调用
- `fetchEmailList(token, params)`: 获取邮件列表（支持分页参数）
- `deleteEmails(token, emailIds)`: 批量删除邮件

### 2. React Query Hooks (`src/hooks/`)

#### `useEmailList.ts`
- 使用 `useInfiniteQuery` 实现无限滚动
- **自动刷新配置**：
  - `refetchInterval: 60 * 1000` - 每 60 秒刷新一次
  - `refetchIntervalInBackground: true` - 后台标签页也会刷新
  - `staleTime: 30 * 1000` - 数据 30 秒内被视为新鲜
- **分页参数**：
  - `limit`: 每页加载数量（默认 20）
  - `offset`: 当前偏移量（自动计算）
- 自动管理 `hasNextPage` 和 `fetchNextPage`

#### `useDeleteEmail.ts`
- 使用 `useMutation` 处理删除操作
- **乐观更新**：删除后立即从缓存中移除邮件
- 自动 invalidate 查询以触发重新获取

### 3. Query Provider (`src/provider/Query.tsx`)

配置全局 QueryClient：
- `staleTime: 30s` - 数据新鲜时间
- `gcTime: 5min` - 垃圾回收时间
- `retry: 3` - 失败重试次数
- `refetchOnWindowFocus: false` - 不在窗口聚焦时刷新

在开发环境中启用 React Query DevTools。

## 使用示例

### 页面组件 (`src/pages/index.tsx`)

```typescript
const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } 
  = useEmailList({ token: authToken, limit: 20 });

const allEmails = useMemo(() => {
  return data?.pages.flatMap((page) => page.items) || [];
}, [data]);

// 刷新
const handleRefresh = () => refetch();

// 加载更多
const handleLoadMore = () => {
  if (hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }
};

// 删除
const handleDeleteEmail = (emailId: number) => {
  deleteMutation.mutate({ token: authToken, emailIds: [emailId] });
};
```

## 关键特性

### 1. 后台自动刷新
- 应用在前台时，每 60 秒自动刷新邮件列表
- 应用在后台标签页时也会刷新（`refetchIntervalInBackground: true`）
- 用户无需手动点击刷新按钮即可获取最新邮件

### 2. 无限滚动分页
- 使用 `useInfiniteQuery` 管理多页数据
- 点击"加载更多"按钮自动加载下一页
- 自动合并多页数据到单一数组
- `hasNextPage` 自动判断是否还有更多数据

### 3. 乐观更新
- 删除邮件时立即从 UI 中移除
- 不需要等待服务器响应
- 如果服务器请求失败，可以回滚（当前配置为 invalidate 重新获取）

### 4. 智能缓存
- 相同参数的请求会自动使用缓存
- 30 秒内的数据被视为新鲜，不会重复请求
- 5 分钟后自动清理未使用的缓存

## 配置说明

可以在 `src/provider/Query.tsx` 中调整以下参数：

```typescript
{
  staleTime: 1000 * 30,        // 数据新鲜时间（30秒）
  gcTime: 1000 * 60 * 5,       // 缓存清理时间（5分钟）
  retry: 3,                     // 失败重试次数
  refetchOnWindowFocus: false,  // 窗口聚焦时是否刷新
}
```

可以在 `src/hooks/useEmailList.ts` 中调整自动刷新频率：

```typescript
{
  refetchInterval: 60 * 1000,           // 刷新间隔（60秒）
  refetchIntervalInBackground: true,    // 后台标签页也刷新
}
```

## 调试工具

在开发环境中，React Query DevTools 会自动启用：
- 点击页面右下角的 React Query 图标打开
- 可以查看所有查询的状态、缓存数据、刷新时间等
- 可以手动触发 refetch、invalidate 等操作

## 遵循的设计原则

1. **KISS（Keep It Simple, Stupid）**
   - 使用 React Query 的标准 API，不做过度封装
   - 简单直观的 hook 接口

2. **DRY（Don't Repeat Yourself）**
   - 统一的 `apiClient` 处理所有请求
   - 可复用的 hooks 封装

3. **SOLID 原则**
   - 单一职责：每个 hook 只负责一个功能
   - 开闭原则：通过参数扩展功能，不修改核心代码
   - 依赖倒置：依赖于 React Query 抽象，不依赖具体实现

4. **YAGNI（You Aren't Gonna Need It）**
   - 只实现当前需要的功能
   - 避免过度设计和预留未来功能
