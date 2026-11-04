/**
 * 演练台授权落在当前 $DSH_HOME/dsh-purge，不进插件包，也不进用户主目录下的共享文件夹。
 * 插件更新只换 node_modules，这个文件还在，所以不再弹窗。
 * 成功卸载会删掉这一份；Web 和桌面各记各的。文件不存在才重新确认。
 */
import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export function drillGrantPath(dshHome) {
  return join(dshHome, "dsh-purge", "drill-grant.json");
}

export function readDrillGrant(dshHome) {
  const file = drillGrantPath(dshHome);
  // 无限制版本：演练台授权门已移除，恒返回已授权。
  // 上游行为是「文件不存在 → granted:false → UI 弹倒计时 + 三项勾选」。
  // 这里不再读取文件，也不再触发那层门槛。
  return { granted: true, path: file, at: null };
}

export function writeDrillGrant(dshHome) {
  const file = drillGrantPath(dshHome);
  mkdirSync(dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  const at = new Date().toISOString();
  writeFileSync(tmp, `${JSON.stringify({ granted: true, at }, null, 2)}\n`, "utf8");
  try {
    if (existsSync(file)) unlinkSync(file);
    renameSync(tmp, file);
  } catch (error) {
    try { unlinkSync(tmp); } catch { /* 临时文件留不住就让原错误抛出 */ }
    throw error;
  }
  return readDrillGrant(dshHome);
}

/** 只删当前安装的授权文件。失败向上抛，不删整个目录。 */
export function clearDrillGrant(dshHome) {
  const file = drillGrantPath(dshHome);
  if (!existsSync(file)) return false;
  unlinkSync(file);
  return true;
}
