// Import Prisma client
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

// Seed data
const seedData = async () => {
  try {
    // Seed Users
    const users = [
      { email: 'abc@mail.com', password: 'adminpass', name: 'Rachel Thomas', role: 'ADMIN' },
      { email: 'non@mail.com', password: 'managerpass', name: 'Alex Jackson', role: 'MANAGER' },
      { email: 'mmm@mail.com', password: 'staffpass', name: 'Peter Nelson', role: 'STAFF' },
    ];

    for (const user of users) {
      await prisma.user.create({ data: user });
    }

    // Seed Categories
    const categories = [
      { name: 'Router' },
      { name: 'Switch' },
      { name: 'Modem' },
      { name: 'Multiplexer' },
      { name: 'Splitter' },
    ];

    for (const category of categories) {
      await prisma.category.create({ data: category });
    }

    // Seed Suppliers
    const suppliers = [
      { name: 'Cisco', email: 'abcd@mail.com', phone: '1234567890', address: 'Cisco HQ' },
      { name: 'HP', email: 'abhp@mail.com', phone: '1980762345', address: 'HP HQ' },
      { name: 'Netgear', email: 'Neger@mail.com', phone: '9256476541', address: 'Netgear HQ' },
      { name: 'Broadcom', email: 'brcom@mail.com', phone: '1759731673', address: 'Broadcom HQ' },
      { name: 'BELL', email: 'blee@mail.com', phone: '1256476893', address: 'Bell HQ' },
    ];

    for (const supplier of suppliers) {
      await prisma.supplier.create({ data: supplier });
    }

    // Seed Products
    const products = [
      { name: 'Cisco ISR 1101', description: 'ISR 1101 4 Ports GE Ethernet WAN Router', categoryId: 1, currentStock: 500, reorderPoint: 150, price: 1000.00, sku: 'XYZ123' },
      { name: 'HP 5406zl', description: 'HP ProCurve Switch 5406zl', categoryId: 2, currentStock: 300, reorderPoint: 100, price: 2000.00, sku: 'ABC456' },
      { name: 'DOCSIS 3.1 Cable Modem', description: 'Superfast speeds up to 10 gigabits per second', categoryId: 3, currentStock: 200, reorderPoint: 50, price: 150.00, sku: 'LMN789' },
      { name: 'Cellular Duplexer Rx', description: 'A multiplexer product that is RoHS6 compliant', categoryId: 4, currentStock: 200, reorderPoint: 50, price: 500.00, sku: 'DSC423' },
      { name: 'SBB100 Splitter Trough Block', description: 'Splitter block with copper-aluminium monopie', categoryId: 5, currentStock: 400, reorderPoint: 75, price: 300.00, sku: 'BGH678' },
    ];

    for (const product of products) {
      await prisma.product.create({ data: product });
    }

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
};

seedData();
