export interface ReportExtractionReqModal {
  RequestId: string;
  CorrelationId: string;
  agentId: string | null;
  startDateTime: Date | null;
  endDateTime: Date | null;
}
