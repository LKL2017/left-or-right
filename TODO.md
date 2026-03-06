# Left or Right - TODO

## P0 (MVP) - 已完成
- [x] 创建 index.html — Canvas 容器、基础样式、引入 JS 模块
- [x] 实现 input.js — 键盘/鼠标/触屏输入统一处理
- [x] 实现 track.js — 跑道渲染 + 滚动效果
- [x] 实现 player.js — 主角渲染 + 左右移动 + 积分显示
- [x] 实现 gate.js — 功能门生成、渲染、碰撞检测、运算执行
- [x] 实现 enemy.js — 敌人生成、渲染、碰撞检测、积分扣减
- [x] 实现 game.js — 游戏状态机 + 事件生成调度
- [x] 实现 main.js — 游戏循环 + 初始化 + 自适应缩放
- [x] Game Over 流程 — 结束画面 + 重新开始按钮

## Phaser 3 迁移 - 已完成
- [x] config.js — Phaser 配置 + 游戏常量
- [x] objects/Track.js — 跑道背景 Graphics 对象
- [x] objects/Player.js — 玩家对象（移动、渲染、飘字 Tween）
- [x] objects/Gate.js — 功能门对象（生成、碰撞、运算）
- [x] objects/Enemy.js — 敌人对象（全跑道宽度、强制碰撞）
- [x] scenes/MenuScene.js — 菜单场景
- [x] scenes/PlayScene.js — 游戏主场景（整合所有对象 + 事件调度）
- [x] scenes/GameOverScene.js — 结束场景
- [x] index.html — Phaser CDN 引入 + 新脚本结构
- [x] 删除旧 JS 文件（main.js, game.js, player.js, gate.js, enemy.js, track.js, input.js）

## P1 (后续迭代)
- [ ] 音效系统（碰撞、穿门、Game Over）
- [ ] 金币收集 + 商店系统
- [ ] 角色皮肤
- [ ] Boss 关卡
- [ ] 排行榜
- [ ] 成就系统
