export interface ActivityLog {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  action: string;
  page?: string;
  timestamp: string;
  duration?: number;
  ipAddress?: string;
  device?: string;
}
