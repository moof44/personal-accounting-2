export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface MessagePattern {
  [key: string]: {
    [key in NotificationType]?: (subject?: string) => string;
  };
}

export const messagePatterns: MessagePattern = {
  create: {
    success: (subject) => `${subject || 'Item'} created successfully!`,
    error: (subject) => `Error creating ${subject || 'item'}.`,
  },
  update: {
    success: (subject) => `Changes to ${subject || 'item'} saved!`,
    error: (subject) => `Error updating ${subject || 'item'}.`,
  },
  delete: {
    success: (subject) => `${subject || 'Item'} deleted.`,
    error: (subject) => `Error deleting ${subject || 'item'}.`,
  },
  validity: {
    success: (subject) => `Data entry accepted`,
    error: (subject) => `Invalid data entry.`
  },
  custom: {
    success: (subject) => `${subject}`,
    error: (subject) => `${subject}`,
  }
  // Add more patterns as needed
};
