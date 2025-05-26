'use client';

import { Button } from "@/components/ui/button"
import { FolderOpen, PanelRightOpen, Check, X, Menu, Share2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { toast } from "sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState, useRef, KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { updateProject } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"
import { ShareModal } from "@/components/sidebar/share-modal"
import SidebarDialog from "../sidebar/sidebar-dialog";
import ProfileDropDownMenu from "../headers/ProfileDropDownMenu";
import MobileDropDownMenu from "../headers/MobileDropDownMenu";
import DropDownMenu from "../headers/DropDownMenu";
import HistoryIcon from "../assets/history";
import NewChatIcon from "../assets/newChat";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ThreadSiteHeaderProps {
  threadId: string;
  projectId: string;
  projectName: string;
  onViewFiles: () => void;
  onToggleSidePanel: () => void;
  onProjectRenamed?: (newName: string) => void;
  isMobileView?: boolean;
  debugMode?: boolean;
}

export function SiteHeader({
  threadId,
  projectId,
  projectName,
  onViewFiles,
  onToggleSidePanel,
  onProjectRenamed,
  isMobileView,
  debugMode,
}: ThreadSiteHeaderProps) {
  const pathname = usePathname()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(projectName)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const router = useRouter()

  const isMobile = useIsMobile() || isMobileView
  const { setOpenMobile } = useSidebar()

  const openShareModal = () => {
    setShowShareModal(true)
  }

  const startEditing = () => {
    setEditName(projectName);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditName(projectName);
  };

  const saveNewName = async () => {
    if (editName.trim() === '') {
      setEditName(projectName);
      setIsEditing(false);
      return;
    }

    if (editName !== projectName) {
      try {
        if (!projectId) {
          toast.error('Cannot rename: Project ID is missing');
          setEditName(projectName);
          setIsEditing(false);
          return;
        }

        const updatedProject = await updateProject(projectId, { name: editName })
        if (updatedProject) {
          onProjectRenamed?.(editName);
          toast.success('Project renamed successfully');
        } else {
          throw new Error('Failed to update project');
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to rename project';
        console.error('Failed to rename project:', errorMessage);
        toast.error(errorMessage);
        setEditName(projectName);
      }
    }

    setIsEditing(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveNewName();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <>
      <header className={cn(
        "bg-background sticky top-0 flex h-14 shrink-0 items-center gap-1 z-20 w-full",
        isMobile && "px-2"
      )}>
        {isMobile && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenMobile(true)}
              className="h-9 w-9 mr-1"
              aria-label="Open sidebar"
            >
              {/* <Menu className="h-4 w-4" /> */}
              <HistoryIcon />
            </Button>
            <Link href="/dashboard">
              <NewChatIcon />
            </Link>
          </>
        )}
        <div className={`flex-1 flex items-center ${isMobile ? 'justify-center' : 'justify-start ml-2'}`}>
          <div className={`mr-2`}>
            <Image
              src="/logo-ryxen.svg"
              alt="logo"
              width={100}
              height={100}
              className="h-5 w-auto"
              onClick={() => {
                router.push("/");
              }}
            />
          </div>
          <DropDownMenu />
        </div>

        {/* <div className="flex flex-1 items-center gap-2 px-3">
          {isEditing ? (
            <div className="flex items-center gap-1">
              <Input
                ref={inputRef}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={saveNewName}
                className="h-8 w-auto min-w-[180px] text-base font-medium"
                maxLength={50}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={saveNewName}
              >
                <Check className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={cancelEditing}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : !projectName || projectName === 'Project' ? (
            <Skeleton className="h-5 w-32" />
          ) : (
            <div
              className="text-base font-medium text-muted-foreground hover:text-foreground cursor-pointer flex items-center"
              onClick={startEditing}
              title="Click to rename project"
            >
              {projectName}
            </div>
          )}
        </div> */}

        <div className="flex items-center gap-1 pr-4">
          {/* Debug mode indicator */}
          {debugMode && (
            <div className="bg-amber-500 text-black text-xs px-2 py-0.5 rounded-md mr-2">
              Debug
            </div>
          )}

          {isMobile ? (
            <>
              <MobileDropDownMenu endpoint="agents" />
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleSidePanel}
                className="h-9 w-9 cursor-pointer"
                aria-label="Toggle computer panel"
              >
                <PanelRightOpen className="h-4 w-4" />
              </Button>
            </>
          ) : (
            // Desktop view - show all buttons with tooltips
            <TooltipProvider>
              {/* <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onViewFiles}
                    className="h-9 w-9 cursor-pointer"
                  >
                    <FolderOpen className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Files in Task</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={openShareModal}
                    className="h-9 w-9 cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share Chat</p>
                </TooltipContent>
              </Tooltip> */}
              {!isMobile && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidePanelOpen(true)}
                    className="h-9 w-9"
                    aria-label="Open sidebar"
                  >
                    {/* <Menu className="h-4 w-4" /> */}
                    <HistoryIcon />
                  </Button>
                  <Link href="/dashboard" className="mr-2 hover:bg-accent rounded-md w-9 h-9 flex items-center justify-center">
                    <NewChatIcon />
                  </Link>
                </>
              )}
              <ProfileDropDownMenu endpoint="agents" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleSidePanel}
                    className="h-10 w-10 cursor-pointer"
                  >
                    <PanelRightOpen className="h-9 w-9" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Computer Preview (CMD+I)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </header>
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        threadId={threadId}
        projectId={projectId}
      />
      <SidebarDialog open={isSidePanelOpen} onOpenChange={setIsSidePanelOpen} />
    </>
  )
} 