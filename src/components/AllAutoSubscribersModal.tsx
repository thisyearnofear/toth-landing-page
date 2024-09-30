// src/components/AllAutoSubscribersModal.tsx

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
import { Autosubscriber } from "../types";
import SparklesText from "@/components/magicui/sparkles-text";

interface AllAutoSubscribersModalProps {
  isOpen: boolean;
  onClose: () => void;
  autosubscribers: Autosubscriber[];
  onDownload: () => void;
}

const AllAutoSubscribersModal: React.FC<AllAutoSubscribersModalProps> = ({
  isOpen,
  onClose,
  autosubscribers,
  onDownload,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>All Auto-Subscribers</DialogTitle>
          <DialogDescription>
            View all auto-subscribers and download the list of subscribers.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full pr-4">
          {autosubscribers.map((subscriber, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg bg-white bg-opacity-20 mb-2"
            >
              <span className="text-lg">{subscriber.icon}</span>
              <div className="flex flex-col">
                <SparklesText
                  text={subscriber.name}
                  colors={{ first: subscriber.color, second: "#000000" }}
                  className="text-base font-bold"
                />
                <span className="text-xs">
                  Daily allowance: {subscriber.allowance} $degen
                </span>
              </div>
            </div>
          ))}
        </ScrollArea>
        <Button onClick={onDownload}>Download Subscribers List</Button>
      </DialogContent>
    </Dialog>
  );
};

export default AllAutoSubscribersModal;
