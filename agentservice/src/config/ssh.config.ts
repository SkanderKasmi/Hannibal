// src/config/ssh.config.ts
export interface SshGlobalConfig {
  defaultPort: number;
  agentRemoteDir: string;
  hannibalDir: string;
}

export const sshConfig: SshGlobalConfig = {
  defaultPort: 22,
  hannibalDir: '/opt/Hannibal',
  agentRemoteDir: '/opt/Hannibal/agent',
};
