import React from "react";
import { Tree, Folder, File } from "@/components/magicui/file-tree";
import {
  PersonIcon,
  FrameIcon,
  TwitterLogoIcon,
  PersonIcon as TeamIcon,
} from "@radix-ui/react-icons";

const Directory = () => {
  return (
    <div className="w-full max-w-md mx-auto mt-8">
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
            <File value="profile" fileIcon={<PersonIcon className="size-4" />}>
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
  );
};

export default Directory;
