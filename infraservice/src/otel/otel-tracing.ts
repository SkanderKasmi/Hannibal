// src/otel/otel-tracing.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

let sdk: NodeSDK | null = null;

export async function setupTracing() {
  if (sdk) return; // already started

  // Only log OTEL internal errors
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

  const collectorUrl =
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
    'http://otel-collector:4318/v1/traces';

  const serviceName =
    process.env.OTEL_SERVICE_NAME || 'infra-service';

  const traceExporter = new OTLPTraceExporter({
    url: collectorUrl,
  });

  sdk = new NodeSDK({
    traceExporter,
    resource: resourceFromAttributes({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });

  await sdk.start();
  console.log(
    `[OTEL] tracing started for service "${serviceName}" to "${collectorUrl}"`,
  );

  process.on('SIGTERM', async () => {
    await sdk?.shutdown();
    process.exit(0);
  });
}
