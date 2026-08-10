# taplink-cloud-demo

独立前端 Checkout Demo（纯静态文件版），用于联调 SUNBAY Cloud 模式接口。

## 功能

- 线上收银台：页面直接提供 `Sale` 与 `Auth` 主操作，商品、金额和回调进度清晰展示
- 抽屉式调试：环境、认证、商户参数、固定回调地址、请求参数、网关响应和事件日志均通过按钮抽屉查看
- 交易追踪：`terminalEventNotifyUrl` 的 `TRANSACTION_ENDED` 与 `notifyUrl` 的 `transactionStatus` 同时满足后，才确认交易最终结果
- 交易接口：内置半集成 Sale/Auth/撤销/退款/查单及其他线上接口

## 快速使用（仅前端静态）

1. 直接双击 `index.html` 在浏览器打开。
2. 或在目录下启动静态服务：

```bash
cd /Users/sm4306/StudioProjects/taplink-cloud-demo
python3 -m http.server 5173
```

然后访问 `http://localhost:5173`。

## 启动后端联调（推荐）

```bash
cd /Users/sm4306/StudioProjects/taplink-cloud-demo
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

uvicorn backend.app:app --host 0.0.0.0 --port 8000
```

然后访问 `http://localhost:8000`。

说明：
- 后端收到 `POST /webhook/sunbay` 后，会自动把通知转发到钉钉机器人。
- 钉钉 webhook 地址与密钥已在后端代码中固定写死，不需要额外环境变量配置。

## 文件结构

- `index.html`：页面结构
- `style.css`：UI 样式
- `main.js`：Demo 业务逻辑
- `backend/app.py`：后端代理、Webhook 接收、SSE、钉钉自动转发

## Real 模式注意事项

- 页面固定向请求写入以下两个回调地址，不允许在 UI 中覆盖：
  - `notifyUrl`: `http://47.77.239.198/webhook/sunbay`
  - `terminalEventNotifyUrl`: `http://47.77.239.198/terminal-events/sunbay`
- 网关接口 HTTP 成功只代表请求受理，不代表交易批准；HTTP 失败或网络异常也不直接判定交易失败。
- 交易弹窗实时展示终端事件；只有收到 `terminalEventNotifyUrl` 的 `TRANSACTION_ENDED`，并且收到 `notifyUrl` 回调中的 `transactionStatus`，才会显示最终成功/失败。
- 两个回调先后顺序不固定：先到的结果会暂存，第二个条件满足后才确认交易。
- 页面发起交易后会回放后端最近的 webhook 事件，避免 SSE 短暂断开导致页面漏掉回调。
- 浏览器直连真实 API 可能受 CORS 限制；如需稳定联调，建议通过后端代理转发。
