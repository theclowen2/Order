
/**
 * SMS Service for sending text messages to customers
 * This service provides an abstraction layer for different SMS providers
 */

// SMS Message interface
export interface SmsMessage {
  to: string;
  body: string;
  from?: string;
}

// SMS Provider interface
export interface SmsProvider {
  sendSms(message: SmsMessage): Promise<SmsResult>;
  getProviderName(): string;
}

// SMS Result interface
export interface SmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Default Configuration
const DEFAULT_CONFIG = {
  // Default provider name
  provider: 'twilio', // Changed default provider to Twilio
  // API Keys for different providers
  apiKeys: {
    twilio: {
      accountSid: 'ACc10f976d5ee41dc4318c95a3b3ca37f3', // Hardcoded Twilio account SID
      authToken: 'a37b7926cfa5e1f5c5963e8b7a5972af',    // Hardcoded Twilio auth token
      fromNumber: '+15635001932',                       // Hardcoded Twilio from number
    },
    // Add more provider configurations here
  }
};

// Console Provider (for development/testing)
class ConsoleProvider implements SmsProvider {
  sendSms(message: SmsMessage): Promise<SmsResult> {
    console.log('[SMS SERVICE] Message would be sent to:', message.to);
    console.log('[SMS SERVICE] Message content:', message.body);
    
    return Promise.resolve({
      success: true,
      messageId: `mock-${Date.now()}`,
    });
  }

  getProviderName(): string {
    return 'Console (Development)';
  }
}

// Twilio Provider implementation
class TwilioProvider implements SmsProvider {
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;

  constructor(accountSid: string, authToken: string, fromNumber: string) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.fromNumber = fromNumber;
  }

  async sendSms(message: SmsMessage): Promise<SmsResult> {
    try {
      const fromNumber = message.from || this.fromNumber;
      
      // For now we'll just log that we would send a message via Twilio
      // In a real implementation, this would make an API call to Twilio
      console.log(`[TWILIO PROVIDER] Sending SMS from ${fromNumber} to ${message.to}`);
      console.log(`[TWILIO PROVIDER] Message: ${message.body}`);
      console.log(`[TWILIO PROVIDER] Using Twilio account: ${this.accountSid}`);
      
      // Return success response
      return {
        success: true,
        messageId: `twilio-${Date.now()}`,
      };
    } catch (error) {
      console.error('[TWILIO PROVIDER] Error sending SMS:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error sending SMS via Twilio',
      };
    }
  }

  getProviderName(): string {
    return 'Twilio';
  }
}

// SMS Service main class
class SmsService {
  private provider: SmsProvider;
  private config: typeof DEFAULT_CONFIG;

  constructor(config?: Partial<typeof DEFAULT_CONFIG>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.provider = this.initializeProvider();
  }

  private initializeProvider(): SmsProvider {
    switch (this.config.provider) {
      case 'twilio':
        const { accountSid, authToken, fromNumber } = this.config.apiKeys.twilio;
        return new TwilioProvider(accountSid, authToken, fromNumber);
      case 'console':
      default:
        return new ConsoleProvider();
    }
  }

  async sendSms(to: string, body: string, from?: string): Promise<SmsResult> {
    if (!to || !body) {
      return {
        success: false,
        error: 'Phone number and message are required',
      };
    }

    try {
      const message: SmsMessage = { to, body, from };
      return await this.provider.sendSms(message);
    } catch (error) {
      console.error('[SMS SERVICE] Error sending SMS:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error sending SMS',
      };
    }
  }

  getProviderName(): string {
    return this.provider.getProviderName();
  }
}

// Export a singleton instance
export const smsService = new SmsService();

// You can also export the class for creating custom instances
export default SmsService;
