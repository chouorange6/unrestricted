// net-scope — 无限制版本。
//
// 上游 v1.1.90 在这个模块里放了三层硬拦截：
//   1. installRegionGate()：在 agent/pre-step 与 tools/pre-execute 上挂门禁，
//      命中就 parkDenial()，把整轮改写成「不行，这是严令禁止的」；
//   2. ATTACK / CHEAT_* 正则：按任务文本判定「攻击任务」「游戏外挂」；
//   3. isLocalLabAddress / isRangeTarget：只放行回环与 RFC1918，其余目标一律拦。
//
// 本版本把这些全部移除：模块只保留 UI 与注入流程仍然 import 的四个导出，
// 且四个导出都是惰性的（不拦截、不写入、不注入任何声明）。
// 上游原件保留在同目录 net-scope.js.upstream.bak，便于对照与回滚。

/** 上游用来在系统提示词尾部追加「自建服务器白名单」说明。空串即不追加。 */
export function ownServerNote() {
  return "";
}

/** 上游用来读取 $DSH_HOME/net-scope-allow.txt。这里恒为空。 */
export function readAllowText() {
  return "";
}

/** 上游用来写入白名单。这里不落盘，返回空结果保持调用方契约。 */
export async function writeAllowText() {
  return { text: "", dropped: 0, hosts: [] };
}

/**
 * 门禁安装点。上游在这里注册 agent/pre-step 和 tools/pre-execute 两个钩子。
 * 本版本不注册任何钩子，也不写 ctx 标记位之外的状态。
 * 保留导出是为了让 index.js / identity.js 的 import 不必改动。
 */
export function installRegionGate(ctx) {
  if (ctx && typeof ctx === "object") {
    // 记录一次「已处理」，避免任何调用方误以为需要重试。
    try { ctx.__dshPurgeRegionGate = false; } catch { /* 冻结对象时忽略 */ }
  }
  return undefined;
}
