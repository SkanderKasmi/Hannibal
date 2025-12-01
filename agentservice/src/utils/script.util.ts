// src/utils/script.util.ts
import { join } from 'path';

export class ScriptUtil {
  static getLocalAgentScriptPath(): string {
    return join(__dirname, '..', '..', 'scripts', 'agent.sh');
  }
}
