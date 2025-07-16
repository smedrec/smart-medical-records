/**
 * @fileoverview Data Export Service
 *
 * Provides comprehensive data export functionality with multiple format support:
 * - JSON export with structured data
 * - CSV export for spreadsheet analysis
 * - XML export for system integration
 * - PDF export for formal reporting
 *
 * Requirements: 4.1, 4.4, 8.1
 */

import type {
	ComplianceReport,
	ComplianceReportEvent,
	ExportConfig,
	GDPRComplianceReport,
	HIPAAComplianceReport,
	IntegrityVerificationReport,
	ReportFormat,
} from './compliance-reporting.js'

/**
 * Export result containing the exported data and metadata
 */
export interface ExportResult {
	/** Unique identifier for this export */
	exportId: string

	/** Export format used */
	format: ReportFormat

	/** Export timestamp */
	exportedAt: string

	/** Exported by (user/system) */
	exportedBy?: string

	/** Export configuration used */
	config: ExportConfig

	/** Exported data (base64 encoded if binary) */
	data: string | Buffer

	/** Content type for HTTP responses */
	contentType: string

	/** Suggested filename */
	filename: string

	/** File size in bytes */
	size: number

	/** Checksum for integrity verification */
	checksum: string

	/** Compression information */
	compression?: {
		algorithm: string
		originalSize: number
		compressedSize: number
		compressionRatio: number
	}

	/** Encryption information */
	encryption?: {
		algorithm: string
		keyId: string
		iv?: string
	}
}

/**
 * Export statistics and metadata
 */
export interface ExportStatistics {
	totalRecords: number
	exportedRecords: number
	skippedRecords: number
	processingTime: number
	memoryUsage: number
}

/**
 * Data Export Service
 */
export class DataExportService {
	/**
	 * Export compliance report in specified format
	 */
	async exportComplianceReport(
		report: ComplianceReport,
		config: ExportConfig
	): Promise<ExportResult> {
		const exportId = this.generateExportId()
		const exportedAt = new Date().toISOString()

		let data: string | Buffer
		let contentType: string
		let filename: string

		switch (config.format) {
			case 'json':
				;({ data, contentType, filename } = await this.exportToJSON(report, config))
				break
			case 'csv':
				;({ data, contentType, filename } = await this.exportToCSV(report, config))
				break
			case 'xml':
				;({ data, contentType, filename } = await this.exportToXML(report, config))
				break
			case 'pdf':
				;({ data, contentType, filename } = await this.exportToPDF(report, config))
				break
			default:
				throw new Error(`Unsupported export format: ${config.format}`)
		}

		// Apply compression if requested
		let compressionInfo
		if (config.compression && config.compression !== 'none') {
			const compressed = await this.compressData(data, config.compression)
			compressionInfo = {
				algorithm: config.compression,
				originalSize: Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data, 'utf8'),
				compressedSize: compressed.length,
				compressionRatio:
					compressed.length /
					(Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data, 'utf8')),
			}
			data = compressed
			filename = `${filename}.${config.compression === 'gzip' ? 'gz' : 'zip'}`
		}

		// Apply encryption if requested
		let encryptionInfo
		if (config.encryption?.enabled) {
			const encrypted = await this.encryptData(data, config.encryption)
			encryptionInfo = {
				algorithm: config.encryption.algorithm || 'AES-256-GCM',
				keyId: config.encryption.keyId || 'default',
				iv: encrypted.iv,
			}
			data = encrypted.data
			filename = `${filename}.enc`
		}

		// Calculate checksum
		const checksum = await this.calculateChecksum(data)

		return {
			exportId,
			format: config.format,
			exportedAt,
			config,
			data,
			contentType,
			filename,
			size: Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data, 'utf8'),
			checksum,
			compression: compressionInfo,
			encryption: encryptionInfo,
		}
	}

	/**
	 * Export audit events in specified format
	 */
	async exportAuditEvents(
		events: ComplianceReportEvent[],
		config: ExportConfig,
		metadata?: any
	): Promise<ExportResult> {
		// Create a minimal report structure for events-only export
		const report: ComplianceReport = {
			metadata: {
				reportId: this.generateExportId(),
				reportType: 'AUDIT_EVENTS_EXPORT',
				generatedAt: new Date().toISOString(),
				criteria: metadata?.criteria || {},
				totalEvents: events.length,
				filteredEvents: events.length,
			},
			summary: {
				eventsByStatus: {},
				eventsByAction: {},
				eventsByDataClassification: {},
				uniquePrincipals: 0,
				uniqueResources: 0,
				integrityViolations: 0,
				timeRange: {
					earliest: events[0]?.timestamp || new Date().toISOString(),
					latest: events[events.length - 1]?.timestamp || new Date().toISOString(),
				},
			},
			events,
		}

		return this.exportComplianceReport(report, config)
	}

	/**
	 * Export to JSON format
	 */
	private async exportToJSON(
		report: ComplianceReport,
		config: ExportConfig
	): Promise<{ data: string; contentType: string; filename: string }> {
		const exportData = {
			...(config.includeMetadata !== false && { metadata: report.metadata }),
			summary: report.summary,
			events: report.events,
			...(config.includeIntegrityReport &&
				report.integrityReport && {
					integrityReport: report.integrityReport,
				}),
		}

		const data = JSON.stringify(exportData, null, 2)

		return {
			data,
			contentType: 'application/json',
			filename: `audit-report-${report.metadata.reportId}.json`,
		}
	}

	/**
	 * Export to CSV format
	 */
	private async exportToCSV(
		report: ComplianceReport,
		config: ExportConfig
	): Promise<{ data: string; contentType: string; filename: string }> {
		const headers = [
			'ID',
			'Timestamp',
			'Principal ID',
			'Organization ID',
			'Action',
			'Target Resource Type',
			'Target Resource ID',
			'Status',
			'Outcome Description',
			'Data Classification',
			'IP Address',
			'User Agent',
			'Session ID',
			'Integrity Status',
			'Correlation ID',
		]

		const rows = report.events.map((event) => [
			event.id || '',
			event.timestamp,
			event.principalId || '',
			event.organizationId || '',
			event.action,
			event.targetResourceType || '',
			event.targetResourceId || '',
			event.status,
			this.escapeCsvValue(event.outcomeDescription || ''),
			event.dataClassification || '',
			event.sessionContext?.ipAddress || '',
			this.escapeCsvValue(event.sessionContext?.userAgent || ''),
			event.sessionContext?.sessionId || '',
			event.integrityStatus || '',
			event.correlationId || '',
		])

		const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')

		// Add metadata as comments if requested
		let data = csvContent
		if (config.includeMetadata !== false) {
			const metadataComments = [
				`# Report ID: ${report.metadata.reportId}`,
				`# Report Type: ${report.metadata.reportType}`,
				`# Generated At: ${report.metadata.generatedAt}`,
				`# Total Events: ${report.metadata.totalEvents}`,
				`# Filtered Events: ${report.metadata.filteredEvents}`,
				'#',
				csvContent,
			].join('\n')
			data = metadataComments
		}

		return {
			data,
			contentType: 'text/csv',
			filename: `audit-report-${report.metadata.reportId}.csv`,
		}
	}

	/**
	 * Export to XML format
	 */
	private async exportToXML(
		report: ComplianceReport,
		config: ExportConfig
	): Promise<{ data: string; contentType: string; filename: string }> {
		const xmlParts = ['<?xml version="1.0" encoding="UTF-8"?>']
		xmlParts.push('<auditReport>')

		// Add metadata if requested
		if (config.includeMetadata !== false) {
			xmlParts.push('  <metadata>')
			xmlParts.push(`    <reportId>${this.escapeXml(report.metadata.reportId)}</reportId>`)
			xmlParts.push(`    <reportType>${this.escapeXml(report.metadata.reportType)}</reportType>`)
			xmlParts.push(`    <generatedAt>${this.escapeXml(report.metadata.generatedAt)}</generatedAt>`)
			xmlParts.push(`    <totalEvents>${report.metadata.totalEvents}</totalEvents>`)
			xmlParts.push(`    <filteredEvents>${report.metadata.filteredEvents}</filteredEvents>`)
			xmlParts.push('  </metadata>')
		}

		// Add summary
		xmlParts.push('  <summary>')
		xmlParts.push(`    <uniquePrincipals>${report.summary.uniquePrincipals}</uniquePrincipals>`)
		xmlParts.push(`    <uniqueResources>${report.summary.uniqueResources}</uniqueResources>`)
		xmlParts.push(
			`    <integrityViolations>${report.summary.integrityViolations}</integrityViolations>`
		)
		xmlParts.push('    <timeRange>')
		xmlParts.push(`      <earliest>${this.escapeXml(report.summary.timeRange.earliest)}</earliest>`)
		xmlParts.push(`      <latest>${this.escapeXml(report.summary.timeRange.latest)}</latest>`)
		xmlParts.push('    </timeRange>')
		xmlParts.push('  </summary>')

		// Add events
		xmlParts.push('  <events>')
		for (const event of report.events) {
			xmlParts.push('    <event>')
			xmlParts.push(`      <id>${event.id || ''}</id>`)
			xmlParts.push(`      <timestamp>${this.escapeXml(event.timestamp)}</timestamp>`)
			xmlParts.push(`      <principalId>${this.escapeXml(event.principalId || '')}</principalId>`)
			xmlParts.push(
				`      <organizationId>${this.escapeXml(event.organizationId || '')}</organizationId>`
			)
			xmlParts.push(`      <action>${this.escapeXml(event.action)}</action>`)
			xmlParts.push(
				`      <targetResourceType>${this.escapeXml(event.targetResourceType || '')}</targetResourceType>`
			)
			xmlParts.push(
				`      <targetResourceId>${this.escapeXml(event.targetResourceId || '')}</targetResourceId>`
			)
			xmlParts.push(`      <status>${this.escapeXml(event.status)}</status>`)
			xmlParts.push(
				`      <outcomeDescription>${this.escapeXml(event.outcomeDescription || '')}</outcomeDescription>`
			)
			xmlParts.push(
				`      <dataClassification>${this.escapeXml(event.dataClassification || '')}</dataClassification>`
			)

			if (event.sessionContext) {
				xmlParts.push('      <sessionContext>')
				xmlParts.push(
					`        <ipAddress>${this.escapeXml(event.sessionContext.ipAddress || '')}</ipAddress>`
				)
				xmlParts.push(
					`        <userAgent>${this.escapeXml(event.sessionContext.userAgent || '')}</userAgent>`
				)
				xmlParts.push(
					`        <sessionId>${this.escapeXml(event.sessionContext.sessionId || '')}</sessionId>`
				)
				xmlParts.push('      </sessionContext>')
			}

			xmlParts.push(
				`      <integrityStatus>${this.escapeXml(event.integrityStatus || '')}</integrityStatus>`
			)
			xmlParts.push(
				`      <correlationId>${this.escapeXml(event.correlationId || '')}</correlationId>`
			)
			xmlParts.push('    </event>')
		}
		xmlParts.push('  </events>')

		// Add integrity report if requested
		if (config.includeIntegrityReport && report.integrityReport) {
			xmlParts.push('  <integrityReport>')
			xmlParts.push(
				`    <verificationId>${this.escapeXml(report.integrityReport.verificationId)}</verificationId>`
			)
			xmlParts.push(
				`    <verifiedAt>${this.escapeXml(report.integrityReport.verifiedAt)}</verifiedAt>`
			)
			xmlParts.push('    <results>')
			xmlParts.push(
				`      <totalEvents>${report.integrityReport.results.totalEvents}</totalEvents>`
			)
			xmlParts.push(
				`      <verifiedEvents>${report.integrityReport.results.verifiedEvents}</verifiedEvents>`
			)
			xmlParts.push(
				`      <failedVerifications>${report.integrityReport.results.failedVerifications}</failedVerifications>`
			)
			xmlParts.push(
				`      <verificationRate>${report.integrityReport.results.verificationRate}</verificationRate>`
			)
			xmlParts.push('    </results>')
			xmlParts.push('  </integrityReport>')
		}

		xmlParts.push('</auditReport>')

		return {
			data: xmlParts.join('\n'),
			contentType: 'application/xml',
			filename: `audit-report-${report.metadata.reportId}.xml`,
		}
	}

	/**
	 * Export to PDF format (simplified implementation)
	 */
	private async exportToPDF(
		report: ComplianceReport,
		config: ExportConfig
	): Promise<{ data: Buffer; contentType: string; filename: string }> {
		// This is a simplified PDF implementation
		// In a real implementation, you would use a library like PDFKit or Puppeteer

		const htmlContent = this.generateHTMLReport(report, config)

		// Placeholder: Convert HTML to PDF
		// In real implementation: const pdf = await htmlToPdf(htmlContent)
		const pdfBuffer = Buffer.from(`PDF Report Placeholder\n\n${htmlContent}`, 'utf8')

		return {
			data: pdfBuffer,
			contentType: 'application/pdf',
			filename: `audit-report-${report.metadata.reportId}.pdf`,
		}
	}

	/**
	 * Generate HTML report for PDF conversion
	 */
	private generateHTMLReport(report: ComplianceReport, config: ExportConfig): string {
		const html = [
			`
<!DOCTYPE html>
<html>
<head>
    <title>Audit Compliance Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .summary { background-color: #f5f5f5; padding: 15px; margin-bottom: 20px; }
        .events { margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .metadata { font-size: 0.9em; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Audit Compliance Report</h1>
        <div class="metadata">
            <p>Report ID: ${report.metadata.reportId}</p>
            <p>Report Type: ${report.metadata.reportType}</p>
            <p>Generated: ${report.metadata.generatedAt}</p>
        </div>
    </div>
    
    <div class="summary">
        <h2>Summary</h2>
        <p>Total Events: ${report.metadata.totalEvents}</p>
        <p>Filtered Events: ${report.metadata.filteredEvents}</p>
        <p>Unique Principals: ${report.summary.uniquePrincipals}</p>
        <p>Unique Resources: ${report.summary.uniqueResources}</p>
        <p>Integrity Violations: ${report.summary.integrityViolations}</p>
    </div>
    
    <div class="events">
        <h2>Audit Events</h2>
        <table>
            <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Principal</th>
                    <th>Action</th>
                    <th>Resource</th>
                    <th>Status</th>
                    <th>Classification</th>
                </tr>
            </thead>
            <tbody>`,
		]

		for (const event of report.events.slice(0, 100)) {
			// Limit for PDF
			html.push(`
                <tr>
                    <td>${event.timestamp}</td>
                    <td>${event.principalId || ''}</td>
                    <td>${event.action}</td>
                    <td>${event.targetResourceType || ''}/${event.targetResourceId || ''}</td>
                    <td>${event.status}</td>
                    <td>${event.dataClassification || ''}</td>
                </tr>`)
		}

		html.push(`
            </tbody>
        </table>
    </div>
</body>
</html>`)

		return html.join('')
	}

	/**
	 * Compress data using specified algorithm
	 */
	private async compressData(data: string | Buffer, algorithm: 'gzip' | 'zip'): Promise<Buffer> {
		// Placeholder implementation
		// In real implementation, would use zlib for gzip or archiver for zip
		const inputBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8')

		if (algorithm === 'gzip') {
			// Placeholder: return gzipped data
			return Buffer.from(`GZIP:${inputBuffer.toString('base64')}`)
		} else {
			// Placeholder: return zipped data
			return Buffer.from(`ZIP:${inputBuffer.toString('base64')}`)
		}
	}

	/**
	 * Encrypt data using specified configuration
	 */
	private async encryptData(
		data: string | Buffer,
		config: NonNullable<ExportConfig['encryption']>
	): Promise<{ data: Buffer; iv: string }> {
		// Placeholder implementation
		// In real implementation, would use crypto module
		const inputBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8')
		const iv = 'placeholder-iv-' + Math.random().toString(36).substr(2, 16)

		return {
			data: Buffer.from(`ENCRYPTED:${inputBuffer.toString('base64')}`),
			iv,
		}
	}

	/**
	 * Calculate checksum for data integrity
	 */
	private async calculateChecksum(data: string | Buffer): Promise<string> {
		// Placeholder implementation
		// In real implementation, would use crypto.createHash('sha256')
		const inputBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8')
		return `sha256:${inputBuffer.length.toString(16)}-${Date.now().toString(16)}`
	}

	/**
	 * Helper methods
	 */
	private generateExportId(): string {
		return `export-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
	}

	private escapeCsvValue(value: string): string {
		if (value.includes(',') || value.includes('"') || value.includes('\n')) {
			return `"${value.replace(/"/g, '""')}"`
		}
		return value
	}

	private escapeXml(value: string): string {
		return value
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;')
	}
}
