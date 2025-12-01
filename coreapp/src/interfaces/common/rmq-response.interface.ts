// src/interfaces/common/rmq-response.interface.ts
export interface RmqResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
