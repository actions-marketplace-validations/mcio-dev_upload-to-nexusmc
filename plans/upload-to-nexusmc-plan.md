# GitHub Actions 工作流：上传文件到 NexusMC 更新资源

## 1. 概述

此项目是一个可复用的 **GitHub Action**（JavaScript/TypeScript），可通过 `uses:` 在其他仓库的工作流中引用。

### 功能特性
- 上传资源文件到 NexusMC（本地文件）
- 更新现有资源的版本信息

### 使用方式
```yaml
- uses: your-username/upload-to-nexusmc@v1
  with:
    api_token: ${{ secrets.NEXUSMC_API_TOKEN }}
    resource_id: ${{ secrets.NEXUSMC_RESOURCE_ID }}
    file_path: dist/my-plugin.jar
    version: 1.2.0
```

## 2. 输入参数（Inputs）

### 2.1 必需参数
| 参数 | 类型 | 说明 |
|------|------|------|
| `api_token` | string | NexusMC 个人 API Token |
| `resource_id` | string | NexusMC 资源 ID |
| `file_path` | string | 要上传的文件路径 |

### 2.2 版本信息参数
| 参数 | 类型 | 说明 |
|------|------|------|
| `version` | string | 资源版本号，最长 50 字符 |
| `version_title` | string | 新版本标题 |
| `changelog` | string | 更新日志 |
| `publish_version` | boolean | 是否发布新版本（默认：true） |
| `mc_versions` | string | 支持的 Minecraft 版本（JSON 数组，如 ["1.20.1"]） |

### 2.3 标签参数
| 参数 | 类型 | 说明 |
|------|------|------|
| `tags` | string | 自定义标签（JSON 数组） |
| `official_tags` | string | 官方标签（JSON 数组） |

### 2.4 封面图参数
| 参数 | 类型 | 说明 |
|------|------|------|
| `cover_image_path` | string | 封面图文件路径（可选） |

### 2.5 关联内容参数
| 参数 | 类型 | 说明 |
|------|------|------|
| `tutorial_post_ids` | string | 关联教程帖 ID（JSON 数组） |
| `documentation_post_refs` | string | 文档引用（JSON 数组） |
| `documentation_url` | string | 外部文档地址 |
| `dependencies` | string | 依赖资源列表（JSON 数组） |

### 2.6 草稿参数
| 参数 | 类型 | 说明 |
|------|------|------|
| `is_draft` | boolean | 是否保存为草稿（默认：false） |

## 3. 工作流程

```mermaid
graph TD
    A[开始] --> B[获取输入参数]
    B --> C[验证必填参数<br/>api_token/resource_id/file_path]
    C --> D{验证通过?}
    D -->|否| E[输出错误并退出]
    D -->|是| F[上传资源文件]
    F --> G{上传成功?}
    G -->|否| H[输出错误并退出]
    G -->|是| I{有cover_image_path?}
    I -->|是| J[上传封面图]
    I -->|否| K[构建更新请求]
    J --> K
    K --> L[调用更新资源 API<br/>PATCH /api/resources/{id}]
    L --> M{更新成功?}
    M -->|否| N[输出错误并退出]
    M -->|是| O[输出成功信息]
    E --> P[结束]
    H --> P
    N --> P
    O --> P
```

## 4. API 调用详情

### 4.1 上传资源文件
- **端点**：`POST https://www.nexusmc.cn/api/upload`
- **认证**：`Authorization: Bearer ${{ inputs.api_token }}`
- **Content-Type**：`multipart/form-data`
- **字段**：`file`（二进制文件）

### 4.2 上传封面图（可选）
- **端点**：`POST https://www.nexusmc.cn/api/upload/image`
- **认证**：`Authorization: Bearer ${{ inputs.api_token }}`

### 4.3 更新资源
- **端点**：`PATCH https://www.nexusmc.cn/api/resources/{resource_id}`
- **认证**：`Authorization: Bearer ${{ inputs.api_token }}`
- **Content-Type**：`application/json`

## 5. 文件结构

```
.
├── .github/
│   └── workflows/
│       └── test-action.yml        # 测试工作流
├── action.yml                     # Action 元数据定义
├── package.json                   # Node.js 依赖
├── tsconfig.json                  # TypeScript 配置
├── src/
│   ├── index.ts                  # 入口点
│   ├── api.ts                    # API 调用逻辑
│   ├── types.ts                  # 类型定义
│   └── utils.ts                  # 工具函数
├── dist/
│   └── index.js                  # 编译后的代码
├── .gitignore
├── README.md                      # 使用说明
└── LICENSE
```

## 6. 响应代码处理

| 状态码 | 含义 | 处理方式 |
|--------|------|----------|
| 200 | 成功 | 正常结束 |
| 400 | 请求参数错误 | 输出错误详情，退出码 1 |
| 401 | 未授权 | 检查 API Token，退出码 1 |
| 403 | 权限不足 | 检查 Token scope，退出码 1 |
| 404 | 资源不存在 | 检查资源 ID，退出码 1 |
| 500 | 服务器错误 | 输出错误信息，退出码 1 |

## 7. 依赖包

```json
{
  "@actions/core": "^1.10.0",
  "@actions/github": "^5.1.1",
  "typescript": "^5.0.0"
}
```

## 8. 使用示例

### 基本用法
```yaml
- uses: your-username/upload-to-nexusmc@v1
  with:
    api_token: ${{ secrets.NEXUSMC_API_TOKEN }}
    resource_id: ${{ secrets.NEXUSMC_RESOURCE_ID }}
    file_path: dist/my-plugin.jar
    version: 1.2.0
```

### 完整参数示例
```yaml
- uses: your-username/upload-to-nexusmc@v1
  with:
    api_token: ${{ secrets.NEXUSMC_API_TOKEN }}
    resource_id: ${{ secrets.NEXUSMC_RESOURCE_ID }}
    file_path: dist/my-plugin.jar
    cover_image_path: dist/cover.png
    version: 1.2.0
    version_title: "支持 Minecraft 1.21"
    changelog: |
      - 修复了XXX问题
      - 优化了性能
    mc_versions: '["1.20.1", "1.21"]'
    tags: '["自动同步", "功能增强"]'
    official_tags: '["兼容"]'
    documentation_url: https://docs.example.com
    is_draft: false
```

### 仅更新版本信息（不上传新文件）
```yaml
- uses: your-username/upload-to-nexusmc@v1
  with:
    api_token: ${{ secrets.NEXUSMC_API_TOKEN }}
    resource_id: ${{ secrets.NEXUSMC_RESOURCE_ID }}
    version: 1.2.0
    changelog: "更新日志内容"
```
