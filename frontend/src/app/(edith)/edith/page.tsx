"use client"

import ChatArea from "@/components/Chat/ChatArea";
import InputBox from "@/components/Chat/InputBox";
import { useAtom } from "jotai";
import { isStartChatAtom, isSidebarVisibleAtom } from "@/lib/store";
import Image from "next/image";
import ResearchArea from "@/components/Chat/ResearchArea";

const ChatText = () => {
  const [isStartChat,] = useAtom(isStartChatAtom);
  const [, setIsSidebarVisible] = useAtom(isSidebarVisibleAtom);

  return (
    <main className={`flex justify-center text-mainFont w-screen min-h-screen`}>
      <div className={`flex flex-col flex-auto items-center mt-[72px] justify-center h-[calc(100vh-72px)] py-5 relative`}>
        <div className="flex flex-col h-full items-center justify-center w-full gap-2 px-2 md:px-4" onClick={() => setIsSidebarVisible(false)}>
          {!isStartChat ? (
            <div className="text-3xl font-bold whitespace-nowrap w-full max-sm:h-full flex flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center max-sm:flex-auto">
                <div className="flex items-end justify-center border-none outline-none focus:outline-none">
                  <Image
                    src="/logo-chat.png"
                    alt="logo"
                    width={300}
                    height={300}
                    className="h-[60px] sm:h-[64px] w-auto"
                  />
                </div>
                <span className="text-[16px] sm:text-[18px] text-white mt-6 text-center mb-[34px]">
                  Every Day I&apos;m Theoretically Human
                </span>
              </div>
              <InputBox />
            </div>
          ) : (
            <>
              <ChatArea />
            </>
          )}
          {isStartChat && <InputBox />}
        </div>
      </div>
      <ResearchArea />
    </main>
  );
};

export default ChatText;