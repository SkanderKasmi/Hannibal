// src/interfaces/vm-metadata.interface.ts
export interface VmMetadata {
  id: string;
  name: string;
  hostname: string;
  ipAddress: string;
  sshPort: number;
  resourceGroupId: string;
  resourceGroupName: string;
  username: string;
  authType: 'PASSWORD' | 'KEY';
  password?: string;
  privateKey?: string;
  status: 'CREATING' | 'RUNNING' | 'STOPPED' | 'ERROR';
}
