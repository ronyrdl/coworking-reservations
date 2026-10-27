import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { Role } from "../src/generated/prisma/enums";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = "admin@cospace.com";
  const adminPassword = "Admin123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin CoSpace",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const spaces = [
    {
      name: "Escritorio Ventana",
      description: "Escritorio individual junto a la ventana, luz natural.",
      type: "desk",
      capacity: 1,
      pricePerHour: 8,
      imageUrl:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    },
    {
      name: "Sala Reuniones Andina",
      description: "Sala para 6 personas con pantalla y pizarra.",
      type: "meeting_room",
      capacity: 6,
      pricePerHour: 25,
      imageUrl:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
    },
    {
      name: "Cabina Focus",
      description: "Cabina insonorizada para llamadas y trabajo profundo.",
      type: "cabin",
      capacity: 1,
      pricePerHour: 12,
      imageUrl:
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
    },
  ];

  for (const space of spaces) {
    const existing = await prisma.space.findFirst({
      where: { name: space.name },
    });
    if (!existing) {
      await prisma.space.create({ data: space });
    }
  }

  console.log("Seed completado. Admin:", adminEmail, "/", adminPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });