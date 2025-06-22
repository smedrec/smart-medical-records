import { PinoLogger } from '@mastra/loggers'
import pino from 'pino'

import type { Options } from 'pino-opentelemetry-transport'

const log = new PinoLogger({ name: 'Audit', level: 'info' })

const transport = pino.transport({
	target: 'pino-opentelemetry-transport',
	options: {
		logRecordProcessorOptions: [
			{ recordProcessorType: 'batch', exporterOptions: { protocol: 'http' } },
			{
				recordProcessorType: 'batch',
				exporterOptions: {
					protocol: 'grpc',
					grpcExporterOptions: {
						//headers: { foo: 'some custom header' }
					},
				},
			},
			{
				recordProcessorType: 'simple',
				exporterOptions: { protocol: 'console' },
			},
		],
		loggerName: 'smedrec-audit-dev',
		serviceVersion: '1.0.0',
	},
})

const logger = pino(transport)

export type AuditEventStatus = 'attempt' | 'success' | 'failure'

export interface AuditLogEvent {
	timestamp: string
	principalId?: string
	action: string // e.g., fhirPatientRead, cerbosAuthCheck
	targetResourceType?: string // e.g., Patient, Practitioner, CerbosResource
	targetResourceId?: string
	status: AuditEventStatus
	outcomeDescription?: string // e.g., "Successfully read Patient resource", "Authorization denied by Cerbos", "FHIR API error"
	// Additional context specific to the event
	[key: string]: any
}

/**
 * Logs an audit event to the console.
 * In a real application, this would likely send logs to a dedicated audit service or secure log storage.
 * @param eventDetails Partial details of the event. Timestamp is added automatically.
 */
export function logAuditEvent(
	eventDetails: Omit<AuditLogEvent, 'timestamp'> & {
		action: string
		status: AuditEventStatus
	}
): void {
	const event: AuditLogEvent = {
		timestamp: new Date().toISOString(),
		...eventDetails,
	}

	// For now, logging as JSON string to console.
	// In a worker environment, console.log/info often go to the Cloudflare dashboard or configured log destinations.
	// FIXME - This do not work
	if (event.status === 'failure') {
		logger.error(event)
	} else {
		logger.info(event)
	}
	log.info(JSON.stringify(event))
}

// Example Usage (for illustration, not part of the actual file logic):
/*
logAuditEvent({
  principalId: 'user-123',
  action: 'fhirPatientReadAttempt',
  targetResourceType: 'Patient',
  targetResourceId: 'pat-456',
  status: 'attempt',
});

logAuditEvent({
  principalId: 'user-123',
  action: 'fhirPatientReadSuccess',
  targetResourceType: 'Patient',
  targetResourceId: 'pat-456',
  status: 'success',
  outcomeDescription: 'Successfully read Patient resource',
  dataSize: 1024 // Example of additional context
});

logAuditEvent({
  principalId: 'user-123',
  action: 'fhirPatientReadFailure',
  targetResourceType: 'Patient',
  targetResourceId: 'pat-456',
  status: 'failure',
  outcomeDescription: 'FHIR server returned 404',
  errorCode: 404
});
*/
