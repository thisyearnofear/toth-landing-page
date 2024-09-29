// src/data/mockData.tsx

export const mockScoreData = {
  kindness: [
    {
      date: "2024-09-01",
      nominated: ["alice.eth", "bob.eth", "charlie.eth"],
      value: 3,
    },
    { date: "2024-08-01", nominated: ["david.eth", "eve.eth"], value: 2 },
    {
      date: "2024-07-01",
      nominated: ["frank.eth", "grace.eth", "henry.eth"],
      value: 3,
    },
    {
      date: "2024-06-01",
      nominated: ["ian.eth", "jack.eth", "kelly.eth", "liam.eth"],
      value: 4,
    },
    { date: "2024-05-01", nominated: ["mike.eth"], value: 1 },
    { date: "2024-04-01", nominated: ["nina.eth", "oscar.eth"], value: 2 },
    {
      date: "2024-03-01",
      nominated: ["paul.eth", "quinn.eth", "rachel.eth"],
      value: 3,
    },
  ],
  recognition: [
    { date: "2024-09-01", nominatedBy: ["zack.eth", "yvonne.eth"], value: 2 },
    {
      date: "2024-08-01",
      nominatedBy: ["xavier.eth", "wendy.eth", "victor.eth"],
      value: 3,
    },
    { date: "2024-07-01", nominatedBy: ["ursula.eth"], value: 1 },
    {
      date: "2024-06-01",
      nominatedBy: ["tom.eth", "sarah.eth", "ryan.eth", "quinn.eth"],
      value: 4,
    },
    { date: "2024-05-01", nominatedBy: ["peter.eth", "olivia.eth"], value: 2 },
    {
      date: "2024-04-01",
      nominatedBy: ["noah.eth", "mia.eth", "liam.eth"],
      value: 3,
    },
    { date: "2024-03-01", nominatedBy: ["kate.eth"], value: 1 },
  ],
  governance: [
    { date: "2024-09-01", votesCount: 15, value: 15 },
    { date: "2024-08-01", votesCount: 12, value: 12 },
    { date: "2024-07-01", votesCount: 18, value: 18 },
    { date: "2024-06-01", votesCount: 22, value: 22 },
    { date: "2024-05-01", votesCount: 10, value: 10 },
    { date: "2024-04-01", votesCount: 16, value: 16 },
    { date: "2024-03-01", votesCount: 20, value: 20 },
  ],
  value: [
    { date: "2024-09-01", votesReceived: 25, value: 25 },
    { date: "2024-08-01", votesReceived: 30, value: 30 },
    { date: "2024-07-01", votesReceived: 22, value: 22 },
    { date: "2024-06-01", votesReceived: 28, value: 28 },
    { date: "2024-05-01", votesReceived: 35, value: 35 },
    { date: "2024-04-01", votesReceived: 20, value: 20 },
    { date: "2024-03-01", votesReceived: 32, value: 32 },
  ],
};
