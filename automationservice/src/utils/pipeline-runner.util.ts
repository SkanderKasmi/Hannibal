// src/utils/pipeline-runner.util.ts
import { Task } from '../entities/task.entity';
import { AutomationLogger } from './logger.util';

export class PipelineRunnerUtil {
  static sortTasks(tasks: Task[]): Task[] {
    return tasks.slice().sort((a, b) => a.orderIndex - b.orderIndex);
  }

  static logStart(pipelineId: string) {
    AutomationLogger.log(`Starting pipeline ${pipelineId}`);
  }

  static logEnd(pipelineId: string) {
    AutomationLogger.log(`Finished pipeline ${pipelineId}`);
  }
}
