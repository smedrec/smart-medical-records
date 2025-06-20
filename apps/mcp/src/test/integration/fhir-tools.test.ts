import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  patientReadTool,
  patientCreateTool,
  patientSearchTool,
  patientUpdateTool,
  // Import other tools as they are tested
} from '../../server/tools/fhir-tools';
import type { McpFhirToolCallContext } from '../../server/tools/fhir-tools';
import type { FhirApiClient, FhirSessionData } from '../../lib/hono/middleware/fhir-auth';
import type { Patient, Bundle, OperationOutcome } from '@repo/fhir/src/r4';

// Mock dependencies
vi.mock('../../lib/cerbos', () => ({
  cerbos: {
    isAllowed: vi.fn(),
  },
}));

vi.mock('../../lib/audit', () => ({
  logAuditEvent: vi.fn(),
}));

// Imported for type checking and direct mock access
import { cerbos } from '../../lib/cerbos';
import { logAuditEvent } from '../../lib/audit';

describe('MCP FHIR Tools Integration Tests', () => {
  let mockFhirClient: Record<keyof FhirApiClient, any>; // Partial mock, add methods as needed
  let mockCallContext: McpFhirToolCallContext;
  let mockFhirSessionData: FhirSessionData;

  beforeEach(() => {
    vi.resetAllMocks();

    mockFhirClient = {
      GET: vi.fn(),
      POST: vi.fn(),
      PUT: vi.fn(),
      DELETE: vi.fn(), // Add if any tool uses DELETE
      PATCH: vi.fn(), // Add if any tool uses PATCH
      OPTIONS: vi.fn(),
      HEAD: vi.fn(),
      use: vi.fn(), // Part of openapi-fetch client interface
      removeMiddleware: vi.fn(),
    };

    mockFhirSessionData = {
      userId: 'test-user-123',
      roles: ['test-role', 'practitioner'],
      tokenResponse: { access_token: 'mock-access-token' },
      serverUrl: 'https://mock-fhir-server.com/r4',
    };

    mockCallContext = {
      fhirClient: mockFhirClient as unknown as FhirApiClient, // Cast to the expected type
      fhirSessionData: mockFhirSessionData,
    };
  });

  describe('patientReadTool.handler', () => {
    const toolName = 'fhirPatientRead';
    const resourceType = 'Patient';
    const readParams = { id: 'patient-123' };
    const mockPatient: Patient = { resourceType: 'Patient', id: 'patient-123', name: [{ family: 'Test', given: ['Patient'] }] };

    it('should read patient successfully when authorized', async () => {
      (cerbos.isAllowed as vi.Mock).mockResolvedValue(true);
      mockFhirClient.GET.mockResolvedValue({ data: mockPatient, error: null, response: new Response(JSON.stringify(mockPatient), { status: 200 }) });

      const result = await patientReadTool.handler(readParams, mockCallContext);

      expect(result).toEqual(mockPatient);
      expect(cerbos.isAllowed).toHaveBeenCalledWith({
        principal: { id: mockFhirSessionData.userId, roles: mockFhirSessionData.roles },
        resource: { kind: resourceType, id: readParams.id, attributes: {} },
        action: 'read',
      });
      expect(mockFhirClient.GET).toHaveBeenCalledWith('/Patient/{id}', { params: { path: { id: readParams.id } } });
      expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({ status: 'attempt', action: `${toolName}Attempt` }));
      expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({ status: 'success', action: `cerbos:read` }));
      expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({ status: 'success', action: toolName }));
    });

    it('should throw error and log when Cerbos authorization fails', async () => {
      (cerbos.isAllowed as vi.Mock).mockResolvedValue(false);

      await expect(patientReadTool.handler(readParams, mockCallContext)).rejects.toThrow(/Forbidden: User .* not authorized/);

      expect(cerbos.isAllowed).toHaveBeenCalledOnce();
      expect(mockFhirClient.GET).not.toHaveBeenCalled();
      expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({ status: 'attempt', action: `${toolName}Attempt` }));
      expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({ status: 'failure', action: `cerbos:read`, outcomeDescription: expect.stringContaining('Forbidden') }));
    });

    it('should throw error and log when FHIR client call fails', async () => {
      (cerbos.isAllowed as vi.Mock).mockResolvedValue(true);
      const fhirError = { message: 'FHIR Not Found' };
      mockFhirClient.GET.mockResolvedValue({ data: null, error: fhirError, response: new Response('Not Found', { status: 404 }) });

      await expect(patientReadTool.handler(readParams, mockCallContext)).rejects.toThrow(/FHIR Patient read failed: Status 404/);

      expect(mockFhirClient.GET).toHaveBeenCalledOnce();
      expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({ status: 'attempt', action: `${toolName}Attempt` }));
      expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({ status: 'success', action: `cerbos:read` }));
      expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({ status: 'failure', action: toolName, outcomeDescription: 'FHIR Patient read failed: Status 404' }));
    });

    it('should throw error if FHIR client is not available in context', async () => {
      const contextWithoutClient: McpFhirToolCallContext = { ...mockCallContext, fhirClient: null };
      await expect(patientReadTool.handler(readParams, contextWithoutClient)).rejects.toThrow('FHIR client not available.');
      expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({ status: 'failure', action: toolName, outcomeDescription: 'FHIR client not available.' }));
    });
  });

  describe('patientCreateTool.handler', () => {
    const toolName = 'fhirPatientCreate';
    const resourceType = 'Patient';
    const newPatientData: Patient = { resourceType: 'Patient', name: [{ family: 'New', given: ['Patient'] }] };
    const createdPatient: Patient = { ...newPatientData, id: 'new-patient-id' };
    const createParams = { resource: newPatientData };

    it('should create patient successfully when authorized', async () => {
      (cerbos.isAllowed as vi.Mock).mockResolvedValue(true);
      mockFhirClient.POST.mockResolvedValue({ data: createdPatient, error: null, response: new Response(JSON.stringify(createdPatient), { status: 201 }) });

      const result = await patientCreateTool.handler(createParams, mockCallContext);

      expect(result).toEqual(createdPatient);
      expect(cerbos.isAllowed).toHaveBeenCalledWith({
        principal: { id: mockFhirSessionData.userId, roles: mockFhirSessionData.roles },
        resource: { kind: resourceType, attributes: newPatientData },
        action: 'create',
      });
      expect(mockFhirClient.POST).toHaveBeenCalledWith('/Patient', { body: newPatientData });
      expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({ status: 'attempt', action: `${toolName}Attempt` }));
      expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({ status: 'success', action: `cerbos:create` }));
      expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({ status: 'success', action: toolName, targetResourceId: 'new-patient-id' }));
    });

    it('should throw error and log when Cerbos authorization fails for create', async () => {
      (cerbos.isAllowed as vi.Mock).mockResolvedValue(false);

      await expect(patientCreateTool.handler(createParams, mockCallContext)).rejects.toThrow(/Forbidden: User .* not authorized/);

      expect(cerbos.isAllowed).toHaveBeenCalledOnce();
      expect(mockFhirClient.POST).not.toHaveBeenCalled();
      expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({ status: 'attempt', action: `${toolName}Attempt` }));
      expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({ status: 'failure', action: `cerbos:create`, outcomeDescription: expect.stringContaining('Forbidden') }));
    });

    it('should throw error and log when FHIR client create call fails', async () => {
      (cerbos.isAllowed as vi.Mock).mockResolvedValue(true);
      const fhirError = { message: 'Creation failed' };
      const operationOutcome: OperationOutcome = { resourceType: "OperationOutcome", issue: [{ severity: 'error', code: 'processing', diagnostics: 'Validation error' }]};
      mockFhirClient.POST.mockResolvedValue({ data: null, error: fhirError, response: new Response(JSON.stringify(operationOutcome), { status: 400 }) });

      await expect(patientCreateTool.handler(createParams, mockCallContext)).rejects.toThrow(/Validation error/);

      expect(mockFhirClient.POST).toHaveBeenCalledOnce();
      expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({ status: 'attempt', action: `${toolName}Attempt` }));
      expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({ status: 'success', action: `cerbos:create` }));
      expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({ status: 'failure', action: toolName, outcomeDescription: 'Validation error' }));
    });
  });

  // TODO: Add similar comprehensive test suites for:
  // - patientSearchTool.handler
  // - patientUpdateTool.handler
  // - All Practitioner tools (read, search, create, update)
  // - All Organization tools (read, search, create, update)
  // Each suite should test: authorized success, Cerbos deny, FHIR client error, missing FHIR client.
});
