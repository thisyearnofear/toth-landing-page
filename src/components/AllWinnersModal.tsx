// src/components/AllWinnersModal.tsx

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
import { FixedSizeList as List } from "react-window";

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
  const Row = ({ index, style }) => (
    <div style={style}>
      <WinnerListCard {...winners[index]} />
    </div>
  );

  const WinnersList = () => (
    <List height={400} itemCount={winners.length} itemSize={35} width={300}>
      {Row}
    </List>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>All Winners</DialogTitle>
          <DialogDescription>
            View all winners and download the list of winners.
          </DialogDescription>
        </DialogHeader>
        <WinnersList />
        <Button onClick={onDownload}>Download Winners List</Button>
      </DialogContent>
    </Dialog>
  );
};

export default AllWinnersModal;
