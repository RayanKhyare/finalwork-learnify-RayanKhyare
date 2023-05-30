const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const roles = await prisma.roles.createMany({
    data: [
      {
        id: 1,
        name: "admin",
      },
      {
        id: 2,
        name: "teacher",
      },
      {
        id: 3,
        name: "student",
      },
    ],
  });

  const users = await prisma.users.create([
    {
      id: 1,
      role: 2,
      username: "MikeD",
      email: "rkhyare@gmail.com",
      password: "$2a$10$2uWW/9U7phLW2vYdVn9t/OEqbpDYcN8kqAEqEbAjQQ/hZie5aou0G",
    },
    {
      id: 2,
      role: 3,
      username: "student",
      email: "student@gmail.com",
      password: "$2a$10$oSmNxbF6UxDfB2kIpX0qW.mR.X4DNyzwZgKPu4gncIUdG0Ydo2tAu",
    },
    {
      id: 3,
      role: 3,
      username: "qsjdqsdqs",
      email: "email@gmail.com",
      password: "$2a$10$0rL1a3Fv9wED9y./d5Kk.uD2YEDk7r62Etm4W7zWVABUMHcJJpoJC",
    },
  ]);

  const categories = await prisma.categories.create([
    {
      id: 1,
      name: "Multimedia & Creative Technologies",
      image_url:
        "https://i.postimg.cc/rpxVGWLb/realvision-pro-loaded-model-male-user-2.jpg",
      beschrijving:
        "In deze praktijkgerichte opleiding leer je multimediatoepassingen maken zoals apps, websites, virtual reality-games, motion graphics en interactieve projecties. Met behulp van de nieuwste technologieën ga je op zoek naar de perfecte balans tussen design en development.",
    },
    {
      id: 2,
      name: "Rechten",
      image_url: "https://i.postimg.cc/JhqY6y0p/rechten.jpg",
      beschrijving:
        "   Rechten is één van de oudste universitaire opleidingen, maar             studenten worden er nog steeds door aangetrokken. De verklaring             hiervoor ligt voor de hand. De samenleving wordt steeds complexer en             dat heeft zijn weerslag op het recht.",
    },
    {
      id: 3,
      name: "Architectuur",
      image_url:
        "https://i.postimg.cc/9fh5hnv8/architecte-and-technical-plan.jpg",
      beschrijving:
        "Architectuur is de kunst en wetenschap van het ontwerpen van de gebouwde omgeving; inclusief steden, gebouwen, woningen, interieurs, tuinen, landschappen, meubelen of objecten. De architectuur wordt gerekend tot de toegepaste kunsten. Vroeger werd het woord bouwkunst meer gebruikt, dat nu voornamelijk nog voor de esthetische kant van het bouwen wordt gebruikt, terwijl bouwkunde met name voor de technische kant wordt gebruikt. Een beoefenaar van de architectuur heet architect.",
    },
    {
      id: 4,
      name: "Biowetenschappen",
      image_url: "https://i.postimg.cc/pLxMN7N0/0x0.webp",
      beschrijving:
        "In de opleiding biowetenschappen word je opgeleid tot een industrieel ingenieur in de levende materie. Je wordt expert in toepassingen die te maken hebben met land- en tuinbouw, voedingsindustrie of biotechnologie.",
    },
    {
      id: 5,
      name: "Informatica",
      image_url:
        "https://i.postimg.cc/tR5htnqY/Wikimedia-Foundation-Servers-8055-35.jpg",
      beschrijving:
        "Informatica is meer dan het handig gebruik maken van bestaande programma's en meer dan het neerschrijven of aanpassen van die programma's. Het is een wetenschap die zich bezighoudt met de praktische en theoretische aspecten van de verwerking van gegevens tot informatie met behulp van computers.",
    },
    {
      id: 6,
      name: "Handelsingenieur",
      image_url:
        "https://i.postimg.cc/MHFH3S3r/value-engineering-commercial-construction.jpg",
      beschrijving:
        'Handelsingenieur is in Vlaanderen een titel die men behaalt na een vijfjarige universitaire studie in de economie: "Master Handelsingenieur" of "Master in de toegepaste economische wetenschappen: handelsingenieur" of "Master in de toegepaste economische wetenschappen: handelsingenieur in de beleidsinformatica".',
    },
  ]);

  const stream = await prisma.streams.create({
    id: 9,
    user_id: 1,
    category_id: 1,
    room_id: 186,
    title: "lofi hip hop radio 📚 - beats to relax/study to",
    description:
      "🎼 | Listen on Spotify, Apple music and more\n→  https://fanlink.to/lofigirl-music\n\n🌎 | Lofi Girl on all social media\n→  https://fanlink.to/lofigirl-social\n\n👕 | Lofi Girl merch\n→  https://bit.ly/Iofigirl-shop\n\n🎭 | Create your lofi avatar now\n→  https://lofigirl.com/generator/\n\n💬 | Join the Lofi Girl community\n→   https://bit.ly/lofigirl-discord\n→   https://bit.ly/lofigirl-reddit\n\n🎶 | Radio tracklist\n→  https://bit.ly/lofi-tracklist\n\n🎨 | Art by Juan Pablo Machado\n→  https://instagram.com/machado.jp\n\n📝 | Submit your music / art\n→  https://bit.ly/lofi-submission\n\n🤗 Thank you for listening, I hope you will have a good time here",
    iframe: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
