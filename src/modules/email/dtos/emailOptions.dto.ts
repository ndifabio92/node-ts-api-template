export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
  encoding?: string;
}

export interface EmailOptions {
  from?: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: any[];
}
