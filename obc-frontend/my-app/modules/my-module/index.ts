import { requireNativeModule } from 'expo-modules-core';

const MyModule = requireNativeModule('MyModule');

export type SMSEvent = {
  message: string;
  error?: string;
};

// Simple event handling
let smsListener: ((event: SMSEvent) => void) | null = null;

// Set up native listener if available
if (MyModule.addListener) {
  MyModule.addListener('onSmsReceived', (event: SMSEvent) => {
    if (smsListener) {
      smsListener(event);
    }
  });
}

export async function startSmsRetriever(): Promise<string> {
  return await MyModule.startSmsRetriever();
}

export async function getAppSignature(): Promise<string> {
  return await MyModule.getAppSignature();
}

export function addSmsListener(listener: (event: SMSEvent) => void): () => void {
  smsListener = listener;
  return () => { smsListener = null; };
}

export function removeSmsListener(): void {
  smsListener = null;
}

export default {
  startSmsRetriever,
  getAppSignature,
  addSmsListener,
  removeSmsListener,
};