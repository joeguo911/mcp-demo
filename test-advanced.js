#!/usr/bin/env node

const { spawn } = require("child_process");

// 启动MCP服务器
const server = spawn("npx", ["tsx", "demo.ts"], {
  stdio: ["pipe", "pipe", "inherit"],
});

let msgId = 1;

// 发送JSON-RPC消息的辅助函数
function sendMessage(method, params = {}) {
  const message = {
    jsonrpc: "2.0",
    id: msgId++,
    method: method,
    params: params,
  };

  console.log("发送:", JSON.stringify(message, null, 2));
  server.stdin.write(JSON.stringify(message) + "\n");
}

// 接收响应
server.stdout.on("data", (data) => {
  const messages = data.toString().trim().split("\n");
  messages.forEach((msg) => {
    if (msg.trim()) {
      try {
        const response = JSON.parse(msg);
        console.log("接收:", JSON.stringify(response, null, 2));
      } catch (e) {
        console.log("原始响应:", msg);
      }
    }
  });
});

// 错误处理
server.on("error", (err) => {
  console.error("服务器错误:", err);
});

server.on("close", (code) => {
  console.log("服务器关闭，退出码:", code);
});

// 测试序列
setTimeout(() => {
  console.log("\n=== 1. 初始化连接 ===");
  sendMessage("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: { tools: {} },
    clientInfo: { name: "test-client", version: "1.0.0" },
  });
}, 100);

setTimeout(() => {
  console.log("\n=== 2. 列出工具 ===");
  sendMessage("tools/list");
}, 1000);

setTimeout(() => {
  console.log("\n=== 3. 测试加法工具 ===");
  sendMessage("tools/call", {
    name: "add",
    arguments: { a: 10, b: 20 },
  });
}, 2000);

setTimeout(() => {
  console.log("\n=== 4. 测试问候工具 (英文) ===");
  sendMessage("tools/call", {
    name: "greet",
    arguments: { name: "Alice", language: "en" },
  });
}, 3000);

setTimeout(() => {
  console.log("\n=== 5. 测试问候工具 (中文) ===");
  sendMessage("tools/call", {
    name: "greet",
    arguments: { name: "小明", language: "zh" },
  });
}, 4000);

setTimeout(() => {
  console.log("\n=== 6. 测试计算工具 (乘法) ===");
  sendMessage("tools/call", {
    name: "calculate",
    arguments: { operation: "multiply", x: 7, y: 8 },
  });
}, 5000);

setTimeout(() => {
  console.log("\n=== 7. 测试计算工具 (除法) ===");
  sendMessage("tools/call", {
    name: "calculate",
    arguments: { operation: "divide", x: 15, y: 3 },
  });
}, 6000);

setTimeout(() => {
  console.log("\n=== 8. 测试除零错误 ===");
  sendMessage("tools/call", {
    name: "calculate",
    arguments: { operation: "divide", x: 10, y: 0 },
  });
}, 7000);

// 8秒后关闭
setTimeout(() => {
  console.log("\n=== 测试完成，关闭服务器 ===");
  server.kill();
}, 8000);
