import express from 'express';
import prisma from '../db/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get all employees for organization
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { organizationId: true },
    });

    if (!user?.organizationId) {
      return res.status(400).json({ error: 'No organization found' });
    }

    const employees = await prisma.employee.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { firstName: 'asc' },
    });

    res.json({ employees });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get single employee
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: req.params.id },
      include: {
        shifts: {
          orderBy: { startTime: 'desc' },
          take: 10,
        },
      },
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ employee });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// Create employee
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { organizationId: true },
    });

    if (!user?.organizationId) {
      return res.status(400).json({ error: 'No organization found' });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      hourlyRate,
      maxHoursPerWeek,
      status,
    } = req.body;

    const employee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        position,
        department,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        maxHoursPerWeek: maxHoursPerWeek ? parseInt(maxHoursPerWeek) : null,
        status: status || 'ACTIVE',
        organizationId: user.organizationId,
      },
    });

    res.status(201).json({ employee });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// Update employee
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      hourlyRate,
      maxHoursPerWeek,
      status,
    } = req.body;

    const employee = await prisma.employee.update({
      where: { id: req.params.id },
      data: {
        firstName,
        lastName,
        email,
        phone,
        position,
        department,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        maxHoursPerWeek: maxHoursPerWeek ? parseInt(maxHoursPerWeek) : null,
        status,
      },
    });

    res.json({ employee });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Delete employee
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    await prisma.employee.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

export default router;
