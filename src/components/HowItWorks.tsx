import { Modak } from "next/font/google";
import { capitalizeFirstLetter } from "~/helpers";
import type { StaticImageData } from "next/image";
import createEventScreenshot from "public/Gather Screenshot-1.jpg";
import eventInviteScreenshot from "public/Gather Screenshot-2.jpg";
import eventPostScreenshot from "public/Gather Screenshot-4.jpg";
import downloadScreenshot from "public/Gather Screenshot-3.jpg";
import Link from "next/link";
import Image from "next/image";

const modak = Modak({ weight: "400", subsets: ["latin"] });

const howItWorksSteps = [
  {
    count: "one",
    description: "Create an event space.",
    screenshot: createEventScreenshot,
  },
  {
    count: "two",
    description: "Invite your friends, loved ones, or colleages.",
    screenshot: eventInviteScreenshot,
  },
  {
    count: "three",
    description: "Post in a private timeline.",
    screenshot: eventPostScreenshot,
  },
  {
    count: "four",
    description:
      "Download all of your event's photos in one shot. No more reaching out to everyone to get their photos.",
    screenshot: downloadScreenshot,
  },
];

interface StepCardProps {
  step: {
    count: string;
    description: string;
    screenshot: StaticImageData;
  };
}

const StepCard: React.FC<StepCardProps> = ({ step }) => {
  return (
    <div
      key={`step ${step.count}`}
      className="mx-auto my-8 w-[90%] max-w-xl rounded-3xl bg-famous-white p-4 shadow-lg shadow-pink-400/40 sm:w-3/4"
    >
      <h4 className="text-2xl font-semibold">
        Step {capitalizeFirstLetter(step.count)}
      </h4>
      <p className="mb-2 text-lg">{step.description}</p>
      <Image
        src={step.screenshot}
        alt="gather social screenshot"
        className="rounded-2xl"
      />
    </div>
  );
};

const HowItWorks = () => {
  return (
    <section id="how" className="mb-24 mt-64 text-center">
      <h2 className={`${modak.className} text-6xl text-pink-400`}>
        How It Works
      </h2>
      {howItWorksSteps.map((step) => (
        <StepCard key={`step ${step.count} card`} step={step} />
      ))}
      <Link
        href={"#"}
        className="text-xl text-pink-400 duration-300 hover:underline"
      >
        Back to top
      </Link>
    </section>
  );
};

export default HowItWorks;
