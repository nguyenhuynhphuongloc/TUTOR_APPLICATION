import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRightIcon, CalendarDays } from "lucide-react";
import Image from "next/image";

import type { FC } from "react";

interface CardDashboardProps {
  bgColor: string;
  icon: string;
  btnColor: string;
  onClick: () => void;
  time: string;
  text: string;
  btnText: string;
  showButton?: boolean;
}

/**
 * CardDashboard component displays a card with a title, an icon, and a button.
 *
 * @param {CardDashboardProps} props The properties for the component.
 * @param {string} props.bgColor Background color for the card.
 * @param {string} props.icon URL or path for the icon image.
 * @param {string} props.btnColor Background color for the button.
 * @param {() => void} props.onClick Function to be called when button is clicked.
 * @param {string} props.time Text displaying the time.
 * @param {string} props.text The title of the card.
 * @param {string} props.btnText The text for the button.
 *
 * @returns {JSX.Element} The rendered card component.
 */
const CardDashboard: FC<CardDashboardProps> = ({
  bgColor,
  icon,
  btnColor,
  onClick,
  time,
  text,
  btnText,
  showButton = true,
}: CardDashboardProps) => {
  return (
    <Card
      className={`flex h-[12.0625rem] w-full flex-col gap-1.5 space-y-4 border-none px-2 pb-2 pt-6`}
      style={{ backgroundColor: bgColor }}
    >
      <Image src={icon} alt="icon" width={50} height={50} />

      <h2 className="text-xl font-semibold text-gray-900">{text}</h2>

      <div className="flex items-center justify-between">
        <div className="flex w-full items-center space-x-2 bg-white p-2 text-xs text-gray-600">
          <CalendarDays className="h-4 w-4" />
          <span>{time}</span>
        </div>

        {showButton && (
          <Button
            className={`flex items-center justify-center text-white hover:bg-cyan-600`}
            style={{ backgroundColor: btnColor }}
            onClick={onClick}
          >
            <span>{btnText}</span>
            <ArrowRightIcon width={14} height={14} />
          </Button>
        )}
      </div>
    </Card>
  );
};

export default CardDashboard;
