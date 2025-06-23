# MCP Demo Server

一个基于 Model Context Protocol (MCP) 的演示服务器，展示如何构建可与 AI 助手集成的自定义工具集。

## 🚀 项目简介

Model Context Protocol (MCP) 是一个标准化协议，用于 AI 助手与外部工具和数据源的安全连接。本项目实现了一个功能完整的 MCP 服务器，提供数学计算和多语言问候功能，可无缝集成到支持 MCP 的 AI 客户端中（如 Claude Desktop、Cursor 等）。

## ✨ 功能特性

### 🔧 内置工具

- **🧮 add** - 两数相加计算器
- **👋 greet** - 多语言智能问候生成器（支持英语、中文、西班牙语、法语）
- **📊 calculate** - 高级数学运算工具（加减乘除，含错误处理）

### 🏗️ 技术特点

- ✅ 基于最新 MCP SDK 构建
- ✅ TypeScript 类型安全
- ✅ JSON Schema 参数验证
- ✅ 完整错误处理机制
- ✅ stdio 通信协议
- ✅ 生产就绪的代码结构

## 📦 安装配置

### 环境要求

- Node.js 18+
- npm 或 yarn
- TypeScript 支持

### 快速开始

```bash
# 克隆项目
git clone <repository-url>
cd mcp-demo-server/demo

# 安装依赖
npm install

# 启动服务器
npm start
```

### 项目结构

demo/
├── demo.ts # MCP 服务器主文件
├── package.json # 项目配置
├── test-advanced.js # 高级功能测试脚本
└── README.md # 项目文档

## 🔧 使用方法

### 在 Cursor 中配置

1. 打开 Cursor 配置文件：`~/.config/cursor/claude_desktop_config.json`

2. 添加 MCP 服务器配置：

```json
{
  "mcpServers": {
    "demo-server": {
      "command": "npx",
      "args": ["tsx", "/path/to/your/demo/demo.ts"],
      "cwd": "/path/to/your/demo"
    }
  }
}
```

3. 重启 Cursor

### 在 Claude Desktop 中配置

```json
{
  "mcpServers": {
    "demo-server": {
      "command": "npm",
      "args": ["start"],
      "cwd": "/path/to/your/demo"
    }
  }
}
```

**示例使用：**

### 💡 如何触发 MCP 工具调用

#### 明确要求使用工具

使用 MCP 工具计算 100 + 200\
调用你的数学工具计算这个\
用外部计算器算一下

#### 复杂一些的任务

计算 π × 2.5 的平方根\
用多种语言问候客户\
批量计算这些数字

#### 明确的工具名称

用 add 工具计算\
使用 calculate 功能\
调用 greet 工具
