declare module 'winston-daily-rotate-file' {
  import * as winston from 'winston';
  
  interface DailyRotateFileTransportOptions extends winston.transport.TransportStreamOptions {
    filename?: string;
    dirname?: string;
    datePattern?: string;
    maxSize?: string;
    maxFiles?: string | number;
    zippedArchive?: boolean;
  }
  
  class DailyRotateFileTransport extends winston.transport {
    constructor(options?: DailyRotateFileTransportOptions);
  }
  
  const transports: {
    DailyRotateFile: typeof DailyRotateFileTransport;
  };
  
  export = DailyRotateFileTransport;
} 