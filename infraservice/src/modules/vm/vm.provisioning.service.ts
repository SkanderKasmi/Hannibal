// src/modules/vm/vm.provisioning.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Vm } from '../../entities/vm.entity';
import { InfraAlertService } from '../../alert/infra-alert.service';
import { SshUtil, SshConnectionInfo } from '../../utils/ssh.util';
import { join } from 'path';

@Injectable()
export class VmProvisioningService {
  private readonly logger = new Logger(VmProvisioningService.name);

  constructor(private readonly alert: InfraAlertService) {}

  private buildConnection(vm: Vm): SshConnectionInfo {
    return {
      host: vm.ipAddress,
      port: vm.sshPort || 22,
      username: vm.username,
      authType: vm.authType,
      password: vm.password,
      // when you support private key, map it here:
      privateKey: undefined,
    };
  }

  /**
   * Deploy Hannibal folder with:
   *  - connectivity.sh
   *  - kafkaproducer.sh
   *  - log.sh
   *  - tasks.sh
   * into /opt/Hannibal on the VM.
   */
  async deployScripts(vm: Vm) {
    const conn = this.buildConnection(vm);
    const remoteDir = '/opt/Hannibal';

    this.logger.log(
      `Deploying Hannibal scripts to VM ${vm.name} (${vm.ipAddress})`,
    );

    try {
      // 1) Ensure directory exists
      await SshUtil.runCommand(conn, `mkdir -p ${remoteDir}`);

      // 2) Local base path inside container
      const localBase = join(
        __dirname,
        '..',
        '..',
        'scripts',
        'Hannibal',
      );

      // 3) Upload each script
      const files = [
        'connectivity.sh',
        'kafkaproducer.sh',
        'log.sh',
        'tasks.sh',
      ];

      for (const file of files) {
        const localPath = join(localBase, file);
        const remotePath = `${remoteDir}/${file}`;
        await SshUtil.uploadFile(conn, localPath, remotePath);
      }

      // 4) Make them executable
      await SshUtil.runCommand(conn, `chmod +x ${remoteDir}/*.sh`);

      this.logger.log(
        `Hannibal scripts deployed successfully on VM ${vm.name}`,
      );
    } catch (err: any) {
      this.logger.error(
        `Failed to deploy Hannibal scripts on VM ${vm.name}: ${err.message}`,
      );
      await this.alert.notifyProvisionFailure(vm.name, err.message);
      throw err;
    }
  }

  async executeCommand(vm: Vm, command: string): Promise<string> {
    const conn = this.buildConnection(vm);
    this.logger.log(
      `Simulate command "${command}" on VM ${vm.name} (${vm.ipAddress})`,
    );
    const res = await SshUtil.runCommand(conn, command);
    return res.stdout || res.stderr;
  }
}
