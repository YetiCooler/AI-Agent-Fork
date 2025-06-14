"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { MenuItems } from "@/lib/stack";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ShadowBtn from "../Chat/ShadowBtn";
import { Divider } from "@mui/material";
// import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import React from "react";
// import { styled } from '@mui/material/styles';
// import { useAtom } from "jotai";
import { ChevronsUpDownIcon } from "lucide-react";

const MenuItems = [
    {
        id: "edith",
        label: "EDITH",
        disable: false,
    },
    {
        id: "dashboard",
        label: "ULTRON",
        disable: false,
    },
]

// const MenuTooltip = styled(({ className, ...props }: TooltipProps) => (
//   <Tooltip {...props} classes={{ popper: className }} />
// ))(({ theme }) => ({
//   [`& .${tooltipClasses.tooltip}`]: {
//     backgroundColor: "#151517",
//     color: '#808080',
//     boxShadow: theme.shadows[1],
//     border: '1px solid #2C2B3080',
//     padding: '16px 12px',
//     fontSize: 13,
//     width: '282px',
//     borderRadius: '6px',
//   },
// }));

// const InfoComponent = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(function InfoComponent(props, ref) {
//   return (
//     <div {...props} ref={ref}>
//       <InfoIcon />
//     </div>
//   );
// });

const DropDownMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const url = pathname.split("/")[1];

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [itemId, setItemId] = useState<string>("");
  const [menuId, setMenuId] = useState<string>("");
  const [itemTitle, setItemTitle] = useState<string>("");
//   const [, setChatLog] = useAtom(chatLogAtom);
//   const [, setRoboChatLog] = useAtom(roboChatLogAtom);
//   const [, setRouterChatLog] = useAtom(routerChatLogAtom);

  const handleItemClick = (itemId: string) => {
    const item = MenuItems.find((menu) => menu.id === itemId);
    if (item && !item.disable) {
    //   setChatLog([]);
    //   setRoboChatLog([]);
    //   setRouterChatLog([]);
      setItemTitle(item.label);
      setItemId(item.id);
    //   setMenuId(menuId);
      router.push(`/${item.id}`);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // console.log("url", url);
    for (const menu of MenuItems) {
      const subItem = menu.id === url || (menu.id == "dashboard" && url === "agents");
      if (subItem) {
        setItemTitle(menu.label);
        setItemId(menu.id);
        // setMenuId(menu.id);
        return;
      } else {
        setItemTitle("EDITH");
        setItemId("edith");
        // setMenuId("innovations");
      }
    }
  }, [MenuItems, url]);

  return (
    <>
      <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
        <DropdownMenuTrigger className="flex justify-between items-center gap-3 bg-transparent hover:border-transparent h-2 text-mainFont text-[16px] focus:outline-none w-fit p-0">
          <span className="flex-1 leading-none text-center">{itemTitle}</span>
          <ChevronsUpDownIcon className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-box-bg mt-[14px] border-box-border rounded-2xl flex flex-col min-w-[300px]"
          align="center"
        >
          {/* <div className="p-3">
            <div className="flex items-center justify-between gap-1 rounded-xl bg-[#0B0B0D] p-2 w-full border border-[#25252799]">
              {
                MenuItems.map((menu) => (
                  <ShadowBtn
                    key={menu.id}
                    className={`w-full rounded-md ${menu.id !== menuId && "bg-transparent"}`}
                    mainClassName={`px-3 py-1 text-[12px] text-white ${menu.id !== menuId && "bg-transparent"}`}
                    onClick={() => setMenuId(menu.id)}
                  >
                    {menu.label}
                  </ShadowBtn>
                ))
              }
            </div>
          </div>
          <Divider sx={{
            borderColor: "#25252799",
            borderWidth: "1px",
            borderStyle: "solid",
            width: "100%",
          }} /> */}
          <div className="p-3 flex flex-col gap-3">
            {
              MenuItems.map((subItem) => (
                <ShadowBtn
                  key={subItem.id}
                  className={`w-full rounded-md`}
                  mainClassName={`text-white flex flex-col items-center justify-center py-7 relative ${subItem.disable && "bg-[#141415]"}`}
                  onClick={() => handleItemClick(subItem.id)}
                >
                  <div className="flex items-center gap-2">
                    <Image src="/logo-ryxen.svg" alt="edith-logo" className="h-[22px] w-auto" width={100} height={22} />
                    <span className="text-[16px] text-nowrap">{subItem.label}</span>
                  </div>
                  {/* {
                    subItem.tooltip &&
                    <div className="absolute right-3 top-3 w-4 h-4 bg-black border-2 border-[#2C2B30] rounded-full flex items-center justify-center">
                      <MenuTooltip title={subItem.tooltip} placement="top" arrow>
                        <InfoComponent />
                      </MenuTooltip>
                    </div>
                  } */}
                </ShadowBtn>
              ))
            }
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* {
        isOpen &&
        <div
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-500 w-screen h-screen z-20 sm:hidden`}
        />
      } */}
    </>
  );
};

export default DropDownMenu;