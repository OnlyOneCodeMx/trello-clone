/**
 * Create Audit Log Action
 *
 * This function logs actions performed by users on various entities.
 * It captures relevant information such as the entity being acted upon,
 * the action taken, and the user who performed the action.
 */
import { auth, currentUser } from '@clerk/nextjs/server';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

import { db } from '@/lib/db';

interface Props {
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  action: ACTION;
}

/**
 * Creates an audit log entry in the database
 *
 * Logs the user action on a specific entity with relevant details.
 * If the user or organization is not found, it throws an error.
 *
 * @param {Props} props - The parameters for creating the audit log, including the entity details and action taken
 */

export const createAuditLog = async (props: Props) => {
  try {
    const { orgId } = await auth();
    const user = await currentUser();

    if (!orgId || !user) {
      throw new Error('User not found');
    }

    const { entityId, entityType, entityTitle, action } = props;

    // Create the audit log entry in the database
    await db.auditLog.create({
      data: {
        orgId,
        entityId,
        entityType,
        entityTitle,
        action,
        userId: user.id,
        userImage: user.imageUrl,
        userName: user.firstName + ' ' + user?.lastName,
      },
    });
  } catch (error) {
    console.log('[AUDIT_LOG_ERROR]', error);
  }
};
