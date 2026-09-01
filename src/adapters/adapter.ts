import type { AuthorizationRequest, ChainConfiguration, ExecutionResult } from '../types/index.js';

export interface ChainAdapter {
  readonly configuration: ChainConfiguration;
  execute(request: AuthorizationRequest): Promise<ExecutionResult>;
}

export class UnimplementedChainAdapter implements ChainAdapter {
  constructor(readonly configuration: ChainConfiguration) {}

  execute(request: AuthorizationRequest): Promise<ExecutionResult> {
    void request;
    return Promise.reject(
      new Error(`${this.configuration.name} execution is not implemented; sponsorship remains disabled`),
    );
  }
}
