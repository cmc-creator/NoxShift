import express from 'express';
import prisma from '../db/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get time-off requests
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { organizationId: true },
    });

    if (!user?.organizationId) {
      return res.status(400).json({ error: 'No organization found' });
    }

    const requests = await prisma.timeOffRequest.findMany({
      where: { organizationId: user.organizationId },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ requests });
  } catch (error) {
    console.error('Get time-off error:', error);
    res.status(500).json({ error: 'Failed to fetch time-off requests' });
  }
});

// Create time-off request
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { organizationId: true },
    });

    if (!user?.organizationId) {
      return res.status(400).json({ error: 'No organization found' });
    }

    const { employeeId, startDate, endDate, reason, type } = req.body;

    const request = await prisma.timeOffRequest.create({
      data: {
        employeeId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        type: type || 'VACATION',
        status: 'PENDING',
        organizationId: user.organizationId,
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.status(201).json({ request });
  } catch (error) {
    console.error('Create time-off error:', error);
    res.status(500).json({ error: 'Failed to create time-off request' });
  }
});

// Approve/reject time-off request
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { status, notes } = req.body;

    const request = await prisma.timeOffRequest.update({
      where: { id: req.params.id },
      data: {
        status,
        ...(notes && { notes }),
        reviewedAt: new Date(),
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.json({ request });
  } catch (error) {
    console.error('Update time-off error:', error);
    res.status(500).json({ error: 'Failed to update time-off request' });
  }
});

export default router;
