// src/components/AllNominationsModal.tsx

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
import NominationNotification from "./NominationNotification";
import { Nomination } from "../types";

interface AllNominationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  nominations: Nomination[];
  onDownload: () => void;
}

const AllNominationsModal: React.FC<AllNominationsModalProps> = ({
  isOpen,
  onClose,
  nominations,
  onDownload,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>All Nominations</DialogTitle>
          <DialogDescription>
            View all nominations and download the list of nominees.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full pr-4">
          {nominations.map((nomination, index) => (
            <NominationNotification key={index} {...nomination} />
          ))}
        </ScrollArea>
        <Button onClick={onDownload}>Download Nominees List</Button>
      </DialogContent>
    </Dialog>
  );
};

export default AllNominationsModal;
