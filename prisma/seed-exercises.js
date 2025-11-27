// Seed default exercises
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaults = [
  { key: 'run', name: 'Running', category: 'cardio', defaultUnit: 'distance' },
  { key: 'bike', name: 'Cycling', category: 'cardio', defaultUnit: 'distance' },
  { key: 'swim', name: 'Swimming', category: 'cardio', defaultUnit: 'distance' },
  { key: 'walk', name: 'Walking', category: 'cardio', defaultUnit: 'distance' },
  { key: 'strength', name: 'Strength', category: 'strength', defaultUnit: 'count' },
];

async function main() {
  for (const ex of defaults) {
    await prisma.exercise.upsert({
      where: { key: ex.key },
      update: ex,
      create: ex,
    });
  }
  console.log('✅ Seeded default exercises');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
