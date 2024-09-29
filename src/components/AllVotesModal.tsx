"use client";

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
import VoteNotification from "./VoteNotification";
import { CombinedVote } from "../types";

interface AllVotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  votes: CombinedVote[];
  onDownload: () => void;
}

const AllVotesModal: React.FC<AllVotesModalProps> = ({
  isOpen,
  onClose,
  votes,
  onDownload,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>All Votes</DialogTitle>
          <DialogDescription>
            View all votes and download the list of voters.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full pr-4">
          {votes.map((vote, index) => (
            <VoteNotification key={index} {...vote} />
          ))}
        </ScrollArea>
        <Button onClick={onDownload}>Download Voters List</Button>
      </DialogContent>
    </Dialog>
  );
};

export default AllVotesModal;
