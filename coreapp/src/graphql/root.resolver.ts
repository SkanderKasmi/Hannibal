// src/graphql/root.resolver.ts
import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class RootResolver {
  @Query(() => String, { description: 'Simple health check for GraphQL' })
  coreHello(): string {
    return 'Core Gateway GraphQL is alive';
  }
}
