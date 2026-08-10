# taplink-cloud-demo

独立前端 Checkout Demo（纯静态文件版），用于联调 SUNBAY Cloud 模式接口。

## 功能

- 参数配置：环境、Base URL、API Key、App ID、Merchant ID、Terminal SN、币种、通知地址
- 模拟商品：商品数量调整、税费/小费/附加费配置、自动金额组装
- 接口调试：内置 15 个常用对外接口（半集成交易/结算/查询 + 线上 checkout/direct-payment/refund）
- 请求/响应：请求体可编辑，支持 Mock 与 Real 两种调用模式
- 终端事件：Cloud 模式终端事件订阅状态加载与事件流展示（Mock 序列 + Real SSE）
- 文档导航：对接 llms 索引中的其他公开接口入口

## 快速使用

1. 直接双击 `index.html` 在浏览器打开。
2. 或在目录下启动静态服务：

```bash
cd /Users/sm4306/StudioProjects/taplink-cloud-demo
python3 -m http.server 5173
```

然后访问 `http://localhost:5173`。

## 文件结构

- `index.html`：页面结构
- `style.css`：UI 样式
- `main.js`：Demo 业务逻辑

## Real 模式注意事项

- 浏览器直连真实 API 可能受 CORS 限制。
- 如需稳定联调，建议在后端代理转发后再从前端调用。
- `onSuccess` 仅代表请求受理，不代表交易最终批准，需结合 Query 接口或事件流判断终态。
