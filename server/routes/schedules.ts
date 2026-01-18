import express from 'express';
import prisma from '../db/prisma.ts';
import { authenticate, AuthRequest } from '../middleware/auth.ts';

const router = express.Router();

// Get schedules for date range
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { startDate, endDate } = req.query;

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { organizationId: true },
    });

    if (!user?.organizationId) {
      return res.status(400).json({ error: 'No organization found' });
    }

    const schedules = await prisma.shift.findMany({
      where: {
        organizationId: user.organizationId,
        ...(startDate && endDate ? {
          startTime: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string),
          },
        } : {}),
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
            department: true,
          },
        },
      },
      orderBy: { startTime: 'asc' },
    });

    res.json({ schedules });
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

// Create shift
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { organizationId: true },
    });

    if (!user?.organizationId) {
      return res.status(400).json({ error: 'No organization found' });
    }

    const { employeeId, startTime, endTime, position, notes } = req.body;

    const shift = await prisma.shift.create({
      data: {
        employeeId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        position,
        notes,
        status: 'SCHEDULED',
        organizationId: user.organizationId,
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
          },
        },
      },
    });

    res.status(201).json({ shift });
  } catch (error) {
    console.error('Create shift error:', error);
    res.status(500).json({ error: 'Failed to create shift' });
  }
});

// Update shift
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { employeeId, startTime, endTime, position, notes, status } = req.body;

    const shift = await prisma.shift.update({
      where: { id: req.params.id },
      data: {
        ...(employeeId && { employeeId }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(position && { position }),
        ...(notes !== undefined && { notes }),
        ...(status && { status }),
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
          },
        },
      },
    });

    res.json({ shift });
  } catch (error) {
    console.error('Update shift error:', error);
    res.status(500).json({ error: 'Failed to update shift' });
  }
});

// Delete shift
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    await prisma.shift.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Shift deleted successfully' });
  } catch (error) {
    console.error('Delete shift error:', error);
    res.status(500).json({ error: 'Failed to delete shift' });
  }
});

export default router;
