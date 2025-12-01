// src/utils/terraform.util.ts
import { exec } from 'child_process';

export class TerraformUtil {
  static runTerraform(
    directory: string,
    action: 'apply' | 'plan' | 'destroy' = 'apply',
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(
        `cd ${directory} && terraform init -input=false && terraform ${action} -auto-approve`,
        (error, stdout, stderr) => {
          if (error) return reject(stderr || error.message);
          resolve(stdout);
        },
      );
    });
  }
}
