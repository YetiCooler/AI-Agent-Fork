'use client'
import { usePathname, useRouter } from "next/navigation";
import MobileDropDownMenu from "@/components/headers/MobileDropDownMenu";
import { useEffect, useRef, useState } from "react";
import ProfileDropDownMenu from "@/components/headers/ProfileDropDownMenu";
import Image from "next/image";
import ShadowBtn from "../Chat/ShadowBtn";
import ProfileIcon from "@/components/assets/profile";
// import SunIcon from "@/app/assets/sun";
import { useAtom } from "jotai";
import {
  isSidebarVisibleAtom,
  chatLogAtom,
  sessionIdAtom,
  isStartChatAtom,
  fileAtom
} from "@/lib/store";
import HistoryIcon from "@/components/assets/history";
import NewChatIcon from "@/components/assets/newChat";
import { IFileWithUrl } from "@/lib/interface";
import { generateSessionId } from "@/lib/utils";
import DialogModelMenu from "../Chat/DialogModelMenu";
import { useUser } from "@/contexts/UserContext";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const endPoint = pathname.split("/");
  const { profile: user } = useUser();

  const leftSidebarRef = useRef<HTMLDivElement | null>(null);
  const rightSidebarRef = useRef<HTMLDivElement | null>(null);

  const [isLeftSidebar, setIsLeftSidebar] = useState<boolean>(false);
  const [isRightSidebar, setIsRightSidebar] = useState<boolean>(false);
  const [isSidebarVisible, setIsSidebarVisible] = useAtom(isSidebarVisibleAtom);
  const [, setIsStartChat] = useAtom(isStartChatAtom);
  const [, setSessionId] = useAtom(sessionIdAtom);
  const [, setChatLog] = useAtom(chatLogAtom);
  const [, setFiles] = useAtom<IFileWithUrl[]>(fileAtom);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        leftSidebarRef.current &&
        !leftSidebarRef.current.contains(event.target as Node) &&
        isLeftSidebar
      ) {
        setIsLeftSidebar(false);
      }

      if (
        rightSidebarRef.current &&
        !rightSidebarRef.current.contains(event.target as Node) &&
        isRightSidebar
      ) {
        setIsRightSidebar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLeftSidebar, isRightSidebar]);

  return (
    <>
      <header className="absolute top-0 left-0 right-0 text-mainFont">
        {/* {
          endPoint[1] !== "router" &&
          <div className="w-full bg-[#FFFFFF0D] py-[6px] text-center text-sm text-[#FFFFFF99] sm:hidden">
            <span>
              TESTNET
            </span>
          </div>
        } */}
        <div className="flex h-[72px] items-center max-sm:px-3 max-sm:pt-[11px] pr-2 md:pr-6 justify-between relative">
          <div className={`items-center pl-4 h-full hidden sm:flex`}>
            <div className={`mr-2`}>
              <Image
                src="/logo-chat.png"
                alt="logo"
                width={100}
                height={100}
                className="h-5 w-auto"
                onClick={() => {
                  router.push("/");
                }}
              />
            </div>
            <DialogModelMenu />
          </div>
          {
            endPoint[1] !== "admin" &&
            <div className="flex items-center gap-2 sm:hidden">
              {
                <>
                  <ShadowBtn
                    mainClassName="border-[#2C2B30] border bg-[#292929] shadow-btn-google text-white p-2 flex items-center justify-center gap-2"
                    onClick={() => {
                      setIsSidebarVisible(!isSidebarVisible);
                    }}
                  >
                    <HistoryIcon />
                  </ShadowBtn>
                  <ShadowBtn
                    mainClassName="border-[#2C2B30] border bg-[#292929] shadow-btn-google text-white p-2 flex items-center justify-center gap-2"
                    onClick={() => {
                      setIsStartChat(false);
                      setSessionId(generateSessionId(
                        user?.email as string,
                        Date.now().toString()
                      ));
                      setFiles([]);
                      setIsSidebarVisible(false);
                      setChatLog([]);
                      router.push(`/edith`);
                    }}
                  >
                    <NewChatIcon />
                  </ShadowBtn>
                </>
              }
              {
                (endPoint[1] === "workers" || endPoint[1] === "subscription") &&
                <>
                  <ShadowBtn
                    mainClassName="border-[#2C2B30] border bg-[#292929] shadow-btn-google text-white p-2 flex items-center justify-center gap-2"
                  >
                    <ProfileIcon />
                  </ShadowBtn>
                </>
              }
            </div>
          }
          {
            endPoint[1] !== "admin" ? (
              <>
                <div className="items-center hidden gap-10 sm:flex">
                  <div className="flex items-center">
                    {/* {
                      endPoint[1] !== "router" &&
                      <>
                        <ShadowBtn
                          className="rounded-md"
                          mainClassName="rounded-md border-[#2C2B30] border bg-[#292929] shadow-btn-google text-white py-[6px] px-[14px] flex items-center justify-center gap-2"
                          onClick={() => router.push("/changeLog")}
                        >
                          <ChangeLog />
                          <span className="text-[14px]">Changelog</span>
                        </ShadowBtn>
                        <ShadowBtn
                          className="rounded-md"
                          mainClassName="rounded-md border-[#2C2B30] border bg-[#292929] shadow-btn-google text-white py-[6px] px-[14px] flex items-center justify-center gap-2"
                          onClick={() => window.open("https://docs.edithx.ai", "_blank")}
                        >
                          <DocsIcon />
                          <span className="text-[14px]">Docs</span>
                        </ShadowBtn>
                      </>
                    } */}
                    {/* <ShadowBtn
                      className="rounded-full"
                      mainClassName="rounded-full border-[#2C2B30] border bg-[#292929] shadow-btn-google text-white py-[7px] px-[7px] flex items-center justify-center gap-2"
                    >
                      <SunIcon />
                    </ShadowBtn> */}
                    {
                      <>
                        <button
                          className="bg-transparent border-none p-3 hover:bg-[#ffffff80] focus:bg-[#ffffff80] focus:outline-none rounded-md"
                          onClick={() => {
                            setIsStartChat(false);
                            setSessionId(generateSessionId(
                              user?.email as string,
                              Date.now().toString()
                            ));
                            setFiles([]);
                            setIsSidebarVisible(false);
                            setChatLog([]);
                            router.push(`/${endPoint[1] == "roboChat" ? "roboChat" : endPoint[1] == "router" ? "router" : "chatText"}`);
                          }}
                        >
                          <NewChatIcon />
                          {/* <span className="text-sm">New Chat</span> */}
                        </button>
                        <button
                          className="bg-transparent border-none p-3 mr-5 hover:bg-[#ffffff80] focus:bg-[#ffffff80] focus:outline-none rounded-md"
                          onClick={() => {
                            setIsSidebarVisible(!isSidebarVisible);
                          }}
                        >
                          <HistoryIcon />
                          {/* <span className="text-sm">History</span> */}
                        </button>
                      </>
                    }
                    <ProfileDropDownMenu endpoint={endPoint[1]} />
                  </div>
                </div>
                <div className="sm:hidden flex items-center gap-2">
                  <MobileDropDownMenu endpoint={endPoint[1]} />
                </div>
              </>
            ) : (
              <>
              </>
            )
          }
        </div>
        {/* {
          endPoint[1] !== "admin" &&
          <div className="sm:hidden">
            <DropDownModelMenu />
          </div>
        } */}
      </header>
    </>
  );
};

export default Header;