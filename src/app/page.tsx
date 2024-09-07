"use client";

import Image from "next/image";
import HyperText from "@/components/magicui/hyper-text";
import { BentoGrid, BentoCard } from "@/components/magicui/bento-grid";
import { Tree, Folder, File } from "@/components/magicui/file-tree";
import Marquee from "@/components/magicui/marquee";
import SparklesText from "@/components/magicui/sparkles-text";
import AnimatedCircularProgressBar from "@/components/magicui/animated-circular-progress-bar";
import {
  PersonIcon,
  GroupIcon,
  StarIcon,
  BellIcon,
  TwitterLogoIcon,
  FrameIcon,
  PersonIcon as TeamIcon,
} from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

interface Nomination {
  id: string;
  nominator: string;
  nominee: string;
  round: number;
  date: string;
  nominatorPfp: string;
}

interface Vote {
  voter: string;
  nominationId: string;
  round: number;
  date: string;
  voterPfp: string;
}

interface CombinedVote {
  vote: Vote;
  nomination: Nomination;
}

// Add this utility function at the top of the file, outside of the component
const generateUserUrl = (username: string) => {
  // Remove the @ symbol if present
  const cleanUsername = username.startsWith("@") ? username.slice(1) : username;
  return `https://warpcast.com/${cleanUsername}`;
};

export default function Home() {
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [combinedVotes, setCombinedVotes] = useState<CombinedVote[]>([]);
  const [nominationsProgress, setNominationsProgress] = useState(0);
  const [votesProgress, setVotesProgress] = useState(0);

  useEffect(() => {
    // sourcery skip: avoid-function-declarations-in-blocks
    async function fetchData() {
      try {
        // Fetch nominations
        setNominationsProgress(10);
        const nominationsResponse = await fetch("/api/fetchNominations");
        setNominationsProgress(30);
        const nominationsData = await nominationsResponse.json();
        setNominationsProgress(50);

        const allNominations = nominationsData
          .flatMap((round: any) =>
            round.nominations.map((nom: any) => ({
              ...nom,
              roundNumber: round.roundNumber,
            }))
          )
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        const recentNominations = allNominations.slice(0, 20);

        const formattedNominations = await Promise.all(
          recentNominations.map(async (nom: any) => {
            const userResponse = await fetch(
              `/api/fetchUserInfo?fid=${nom.fid}`
            );
            if (!userResponse.ok) {
              throw new Error(
                `Error fetching user data: ${userResponse.statusText}`
              );
            }
            const userData = await userResponse.json();
            if (!userData.username) {
              console.error(
                "User data is missing 'username' property:",
                userData
              );
              return null;
            }
            return {
              id: nom.id,
              nominator: userData.username,
              nominee: nom.username,
              round: nom.roundNumber,
              date: new Date(nom.createdAt).toLocaleDateString(),
              nominatorPfp: userData.pfp_url,
            };
          })
        );

        setNominationsProgress(80);
        const validNominations = formattedNominations.filter(
          (nom): nom is Nomination => nom !== null
        );
        setNominations(validNominations);
        setNominationsProgress(100);

        // Fetch votes
        setVotesProgress(10);
        const votesResponse = await fetch("/api/fetchVotes");
        setVotesProgress(30);
        const votesData = await votesResponse.json();
        setVotesProgress(50);

        const allVotes = votesData
          .flatMap((round: any) =>
            round.votes.map((vote: any) => ({
              ...vote,
              roundNumber: round.roundNumber,
            }))
          )
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        const recentVotes = allVotes.slice(0, 20);

        const formattedVotes = await Promise.all(
          recentVotes.map(async (vote: any) => {
            const userResponse = await fetch(
              `/api/fetchUserInfo?fid=${vote.fid}`
            );
            if (!userResponse.ok) {
              throw new Error(
                `Error fetching user data: ${userResponse.statusText}`
              );
            }
            const userData = await userResponse.json();
            if (!userData.username) {
              console.error(
                "User data is missing 'username' property:",
                userData
              );
              return null;
            }
            return {
              voter: userData.username,
              nominationId: vote.nominationId,
              round: vote.roundNumber,
              date: new Date(vote.createdAt).toLocaleDateString(),
              voterPfp: userData.pfp_url,
            };
          })
        );

        const validVotes = formattedVotes.filter(
          (vote): vote is Vote => vote !== null
        );

        // Combine votes with nominations
        setVotesProgress(80);
        const combined = validVotes
          .map((vote) => {
            const nomination = validNominations.find(
              (nom) => nom.id === vote.nominationId
            );
            return { vote, nomination: nomination! };
          })
          .filter((combined) => combined.nomination !== undefined);

        setCombinedVotes(combined);
        setVotesProgress(100);
      } catch (error) {
        console.error("Error fetching data:", error);
        setNominationsProgress(100);
        setVotesProgress(100);
      }
    }

    fetchData();
  }, []);

  const autosubscribers = [
    {
      name: "@juli",
      allowance: "10k",
      icon: "💎",
      color: "#FFD700",
    },
    {
      name: "@leovido.eth",
      allowance: "2k",
      icon: "💎",
      color: "#C0C0C0",
    },
    {
      name: "@scizors.eth",
      allowance: "1k",
      icon: "💎",
      color: "#CD7F32",
    },
    {
      name: "@papa",
      allowance: "2k",
      icon: "💎",
      color: "#C0C0C0",
    },
  ];

  const winners = [
    {
      name: "@kenny",
      description: "Charity bounty via POIDH for $50 in DEGEN on Degen Chain",
      icon: "🎩", // Hat, representing "tip of the hat"
      color: "#4CAF50", // Green for charity and good deeds
    },
    {
      name: "@linda",
      description:
        "Support for Bountycaster bootstrapping team raising 1M degen tips",
      icon: "💡", // Idea bulb, representing innovation and support for startups
      color: "#00BFFF", // Light blue for creativity and support
    },
    {
      name: "@cryptowenmoon.eth",
      description: "New admin of the /spanish channel on Warpcast",
      icon: "🌍", // Globe, representing community and language diversity
      color: "#FFA500", // Orange for community building and warmth
    },
    {
      name: "@eirran",
      description: "Spotlighting dope art by (un)curated artists",
      icon: "🎨", // Palette, representing art and creativity
      color: "#FF69B4", // Hot pink for artistic expression
    },
    {
      name: "@arfonzo",
      description:
        "Building cast back /cli command line tool that backs up user Farcaster casts and enables searches",
      icon: "💻", // Laptop, representing coding and tooling
      color: "#1E90FF", // Blue for technology and development
    },
    {
      name: "@mattkim",
      description:
        "Creating SafariCaster to livestream the Namib desert in a Farcaster frame and mint wild animals",
      icon: "🦁", // Lion, representing safari and wild animals
      color: "#228B22", // Forest green for nature and the safari
    },
    {
      name: "@brixbounty",
      description: "/Parenting updates, getting a new bike for his kid",
      icon: "🚴", // Bicycle, representing the new bike for his kid
      color: "#FFD700", // Gold for a joyful and milestone moment
    },
    {
      name: "@compez.eth",
      description: "Ongoing frames creation & ecosystem updates",
      icon: "🖼️", // Picture frame, representing creative frames
      color: "#FF4500", // Orange-red for creativity and vibrant updates
    },
    {
      name: "@alvesjtiago.eth",
      description: "Shipping fiids beta, now available to everyone",
      icon: "🚀", // Rocket, representing a product launch
      color: "#8A2BE2", // Blue-violet for exciting tech launches
    },
    {
      name: "@leaolmos.eth",
      description:
        "Hosting Kismet Casa, a 2nd onchain residency pairing an artist and a dev",
      icon: "🏡", // House, representing the Kismet Casa residency
      color: "#8B0000", // Dark red for collaboration and creativity
    },
  ];

  const firstRowWinners = winners.slice(0, winners.length / 2);
  const secondRowWinners = winners.slice(winners.length / 2);

  return (
    <main className="min-h-screen bg-purple-100 flex flex-col items-center justify-center p-4">
      <HyperText text="TIPOTHEHAT" className="text-3xl font-bold mb-4" />
      <p className="text-purple-800 text-center mb-6">
        Daily $degen rewards for quality casts on farcaster
      </p>
      <Image
        src="/toth-logo.png"
        alt="TOTH Logo"
        width={200}
        height={200}
        className="mb-6"
      />

      <div className="w-full max-w-md mx-auto mb-8">
        <Tree className="bg-white rounded-lg shadow-lg p-4">
          <Folder element="TOTH" value="toth">
            <Folder element="Farcaster" value="farcaster">
              <File value="channel" fileIcon={<FrameIcon className="size-4" />}>
                <a
                  href="https://warpcast.com/~/channel/tipothehat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-purple-600 transition-colors"
                >
                  Channel: /tipothehat
                </a>
              </File>
              <File
                value="profile"
                fileIcon={<PersonIcon className="size-4" />}
              >
                <a
                  href="https://warpcast.com/tipothehat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-purple-600 transition-colors"
                >
                  Profile: @tipothehat
                </a>
              </File>
            </Folder>
            <Folder element="Twitter" value="twitter">
              <File
                value="degentoth"
                fileIcon={<TwitterLogoIcon className="size-4" />}
              >
                <a
                  href="https://x.com/degentoth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-blue-400 transition-colors"
                >
                  @degentoth
                </a>
              </File>
            </Folder>
            <Folder element="Team" value="team">
              <File value="leovido" fileIcon={<TeamIcon className="size-4" />}>
                <a
                  href="https://warpcast.com/leovido.eth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-green-500 transition-colors"
                >
                  @leovido.eth
                </a>
              </File>
              <File value="papa" fileIcon={<TeamIcon className="size-4" />}>
                <a
                  href="https://warpcast.com/papa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-green-500 transition-colors"
                >
                  @papa
                </a>
              </File>
            </Folder>
            <Folder element="Blog" value="blog">
              <File value="season1" fileIcon={<FrameIcon className="size-4" />}>
                <a
                  href="https://paragraph.xyz/@papajams.eth/funding-the-future-on-farcaster-and-beyond-with-dollardegen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-purple-600 transition-colors"
                >
                  Season 1
                </a>
              </File>
              <File value="season2" fileIcon={<FrameIcon className="size-4" />}>
                <a
                  href="https://paragraph.xyz/@papajams.eth/tip-o-the-hat-season-two-dapp-guides"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-purple-600 transition-colors"
                >
                  Season 2
                </a>
              </File>
            </Folder>
          </Folder>
        </Tree>
      </div>

      <BentoGrid className="max-w-6xl mx-auto mb-12">
        <BentoCard
          name="Nominations"
          className="col-span-2"
          background={
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600" />
          }
          Icon={PersonIcon}
          description="Pool Tips, Fund Awesomeness"
          href="#"
          cta="View All Nominations"
        >
          {nominationsProgress < 100 ? (
            <div className="flex justify-center items-center h-40">
              <AnimatedCircularProgressBar
                max={100}
                value={nominationsProgress}
                min={0}
                gaugePrimaryColor="#8B5CF6"
                gaugeSecondaryColor="#C4B5FD"
                className="scale-75"
              />
            </div>
          ) : (
            <Marquee className="h-40" vertical pauseOnHover speed={10}>
              {nominations.map((nomination, index) => (
                <NominationNotification key={index} {...nomination} />
              ))}
            </Marquee>
          )}
        </BentoCard>

        <BentoCard
          name="Votes"
          className="col-span-1"
          background={
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600" />
          }
          Icon={GroupIcon}
          description="The ballot is stronger than the bullet"
          href="https://toth-bec749001fd2.herokuapp.com/allVotesForRounds"
          cta="View All Votes"
        >
          {votesProgress < 100 ? (
            <div className="flex justify-center items-center h-40">
              <AnimatedCircularProgressBar
                max={100}
                value={votesProgress}
                min={0}
                gaugePrimaryColor="#3B82F6"
                gaugeSecondaryColor="#93C5FD"
                className="scale-75"
              />
            </div>
          ) : (
            <Marquee className="h-40" vertical pauseOnHover speed={10} reverse>
              {combinedVotes.map((combinedVote, index) => (
                <VoteNotification key={index} {...combinedVote} />
              ))}
            </Marquee>
          )}
        </BentoCard>
        <BentoCard
          name="Autosubscribers"
          className="col-span-1"
          background={
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600" />
          }
          Icon={BellIcon}
          description="Donating $degen to TOTH"
          href="#"
          cta="View All Autosubscribers"
        >
          <Marquee className="h-40" vertical pauseOnHover>
            {autosubscribers.map((subscriber, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg bg-white bg-opacity-20 mb-2"
              >
                <span className="text-lg">{subscriber.icon}</span>
                <div className="flex flex-col">
                  <SparklesText
                    text={subscriber.name}
                    colors={{ first: subscriber.color, second: "#FFFFFF" }}
                    className="text-base font-bold"
                  />
                  <span className="text-xs">
                    Daily allowance: {subscriber.allowance} $degen
                  </span>
                </div>
              </div>
            ))}
          </Marquee>
        </BentoCard>
        <BentoCard
          name="Winners"
          className="col-span-2"
          background={
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600" />
          }
          Icon={StarIcon}
          description="Recent $degen TOTH recipients"
          href="#"
          cta="View All Winners"
        >
          <div className="relative h-40 overflow-hidden">
            <Marquee pauseOnHover className="[--duration:40s]">
              {winners.slice(0, winners.length / 2).map((winner, index) => (
                <WinnerCard key={index} {...winner} />
              ))}
            </Marquee>
            <Marquee pauseOnHover className="[--duration:40s]" reverse>
              {winners.slice(winners.length / 2).map((winner, index) => (
                <WinnerCard key={index} {...winner} />
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-green-400"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-green-600"></div>
          </div>
        </BentoCard>
      </BentoGrid>
    </main>
  );
}

const WinnerCard = ({
  name,
  description,
  icon,
  color,
}: {
  name: string;
  description: string;
  icon: string;
  color: string;
}) => {
  // Shorten the description to a maximum of 50 characters
  const shortDescription =
    description.length > 50
      ? description.substring(0, 47) + "..."
      : description;

  return (
    <div className="w-48 p-2 mx-2 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <a
          href={generateUserUrl(name)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-sm hover:underline"
          style={{ color }}
        >
          {name}
        </a>
      </div>
      <p className="text-xs">{shortDescription}</p>
    </div>
  );
};

const NominationNotification = ({
  nominator,
  nominee,
  round,
  date,
  nominatorPfp,
}: Nomination) => {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-white bg-opacity-20 mb-2 w-full">
      <img
        src={nominatorPfp}
        alt={`${nominator}'s profile picture`}
        width={32}
        height={32}
        className="rounded-full"
      />
      <div className="flex flex-col">
        <span className="font-bold">
          <a
            href={generateUserUrl(nominator)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {nominator}
          </a>
        </span>
        <span className="text-sm">
          nominated{" "}
          <a
            href={generateUserUrl(nominee)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            @{nominee}
          </a>{" "}
          in Round {round} on {date}
        </span>
      </div>
    </div>
  );
};

const VoteNotification = ({ vote, nomination }: CombinedVote) => {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-white bg-opacity-20 mb-2 w-full">
      <img
        src={vote.voterPfp}
        alt={`${vote.voter}'s profile picture`}
        width={32}
        height={32}
        className="rounded-full"
      />
      <div className="flex flex-col">
        <span className="font-bold">
          <a
            href={generateUserUrl(vote.voter)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {vote.voter}
          </a>
        </span>
        <span className="text-sm">
          voted for{" "}
          <a
            href={generateUserUrl(nomination.nominee)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            @{nomination.nominee}
          </a>{" "}
          in Round {vote.round} on {vote.date}
        </span>
      </div>
    </div>
  );
};
