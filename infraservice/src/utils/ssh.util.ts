// src/utils/ssh.util.ts
import { Logger } from '@nestjs/common';

const logger = new Logger('SshUtil');

export interface SshConnectionInfo {
  host: string;
  port: number;
  username: string;
  authType: 'PASSWORD' | 'KEY';
  password?: string;
  privateKey?: string;
}

export class SshUtil {
  static async runCommand(
    conn: SshConnectionInfo,
    command: string,
  ): Promise<{ stdout: string; stderr: string; code: number }> {
    logger.log(
      `Simulate SSH command on ${conn.username}@${conn.host}:${conn.port} -> ${command}`,
    );
    return { stdout: `Simulated: ${command}`, stderr: '', code: 0 };
  }

  static async uploadFile(
    conn: SshConnectionInfo,
    localPath: string,
    remotePath: string,
  ): Promise<void> {
    logger.log(
      `Simulate upload from ${localPath} to ${conn.username}@${conn.host}:${conn.port}:${remotePath}`,
    );
    // later: implement real SFTP / SCP here
  }
}
