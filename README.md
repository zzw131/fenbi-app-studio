# 粉笔教育 App — 界面与跳转结构素材库

> 粉笔教育（公务员考试备考）Android App 的界面截图、页面层级与点击跳转关系的结构化整理。
> 由 Android 模拟器逐屏采集并人工梳理，可作为 **UI 原型复刻、交互文档生成、自动化测试脚本编写** 的基础素材。

## 📦 仓库内容

| 目录 / 文件 | 说明 |
|---|---|
| `docs/app-structure.json` | **核心数据**：完整页面树、每个页面的元素、点击跳转关系、截图映射（机器可读，推荐 AI 优先读取） |
| `docs/界面截图索引与跳转说明.md` | 人类可读的截图索引与跳转速览 |
| `docs/AI-STUDIO-BRIEF.md` | 给 AI / Gemini 的开发任务简报（导入后先读这个） |
| `screenshots/` | 17 张核心界面截图（1080×2400 全分辨率） |
| `mindmap/` | XMind 格式的界面跳转思维导图（60 节点） |
| `assets/fenbi.apk` | 官方 APK v6.19.6（211MB，通过 Git LFS 存储；AI 开发通常不需要反编译它） |

## 🚀 在 Google AI Studio 中使用

1. 打开 [Google AI Studio](https://aistudio.google.com/) → Build 模式
2. 输入框左下角 **`+`** → **Import from GitHub**
3. 选择本仓库 `zzw131/fenbi-app-studio` 或粘贴仓库 URL → **Import repository**
4. 导入完成后，Gemini 会读取全部文件。建议首条提示词：

   > 请先阅读 `docs/AI-STUDIO-BRIEF.md` 和 `docs/app-structure.json`，理解这个 App 的界面结构和跳转关系，然后告诉我你能基于它做哪些开发。

## 📱 App 基本信息

- 应用：粉笔教育（公务员/事业单位/教师等备考）
- 包名：`com.fenbi.android.servant`
- 版本：6.19.6 (arm64)
- 官方下载：https://fb.fbstatic.cn/apps/download/gwy-online-arm64-6.19.6.apk

## 🗺️ 整体跳转逻辑

```
启动 → 用户协议 → 登录选择 →(随便逛逛→滑块验证)→ 目标考试选择
   → 考试类型 → 笔试/面试 → 地区 → 国考类别 → 新人福利
   → 主界面 ┬─ 练习 → 科目 → 答题页 → 答题卡 → 交卷
           ├─ 课程 → 分类 → 课程详情
           ├─ 选岗 → 考试类型弹窗 → 完善信息 / 职位列表
           ├─ 发现 → 推荐/圈子/干货/经验/关注
           └─ 我  → 登录/会员/订单/消息/客服
```

## ⚠️ 采集范围说明

已覆盖 17 个核心界面（启动登录、向导、5 个主 Tab、答题流程、选岗助手二级页）。
短信/密码登录子页、课程详情、职位详情、搜索页等更深层页面未逐一采集，已在 JSON 中标注为「未采集」。
