/**
 * Generate Log Message Function
 *
 * This function generates a descriptive log message based on the action
 * performed on an entity. It uses the action type (CREATE, UPDATE, DELETE)
 * along with the entity's title and type to construct a human-readable message.
 *
 * @param {AuditLog} log - The audit log object containing the action and entity details
 * @returns {string} A log message describing the action taken on the entity
 */
import { ACTION, AuditLog } from '@prisma/client';

export const generateLogMessage = (log: AuditLog) => {
  const { action, entityTitle, entityType } = log;

  // Determine the log message based on the action type
  switch (action) {
    case ACTION.CREATE:
      return `created ${entityType.toLowerCase()} "${entityTitle}"`;
    case ACTION.UPDATE:
      return `updated ${entityType.toLowerCase()} "${entityTitle}"`;
    case ACTION.DELETE:
      return `deleted ${entityType.toLowerCase()} "${entityTitle}"`;
    default:
      return `unknown action ${entityType.toLowerCase()} "${entityTitle}"`;
  }
};
