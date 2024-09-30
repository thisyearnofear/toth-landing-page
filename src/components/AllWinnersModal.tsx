import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Winner } from "../types";
import WinnerListCard from "./WinnerListCard";

interface AllWinnersModalProps {
  isOpen: boolean;
  onClose: () => void;
  winners: Winner[];
  onDownload: () => void;
}

const AllWinnersModal: React.FC<AllWinnersModalProps> = ({
  isOpen,
  onClose,
  winners,
  onDownload,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>All Winners</DialogTitle>
          <DialogDescription>
            View all winners and download the list of winners.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full pr-4">
          {winners.map((winner, index) => (
            <WinnerListCard key={index} {...winner} />
          ))}
        </ScrollArea>
        <Button onClick={onDownload}>Download Winners List</Button>
      </DialogContent>
    </Dialog>
  );
};

export default AllWinnersModal;
