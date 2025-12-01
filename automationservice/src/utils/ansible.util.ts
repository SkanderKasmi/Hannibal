// src/utils/ansible.util.ts
import { exec } from 'child_process';

export class AnsibleUtil {
  static runPlaybook(playbookPath: string, inventoryPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(
        `ansible-playbook -i ${inventoryPath} ${playbookPath}`,
        (error, stdout, stderr) => {
          if (error) return reject(stderr || error.message);
          resolve(stdout);
        },
      );
    });
  }
}
