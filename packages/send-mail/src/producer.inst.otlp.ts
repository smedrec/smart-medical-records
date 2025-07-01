import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { NodeSDK } from '@opentelemetry/sdk-node'

const sdk = new NodeSDK({
	serviceName: 'send-mail-producer',
	traceExporter: new OTLPTraceExporter({
		url: 'http://joseantcordeiro.hopto.org:4318/v1/traces',
	}),
	metricReader: new PeriodicExportingMetricReader({
		exporter: new OTLPMetricExporter({
			url: 'http://joseantcordeiro.hopto.org:4318/v1/metrics',
		}),
	}),
})

sdk.start()
