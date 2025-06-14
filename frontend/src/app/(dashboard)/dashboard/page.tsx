'use client';

import React, { useState, Suspense, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import {
  ChatInput,
  ChatInputHandles,
} from '@/components/thread/chat-input/chat-input';
import {
  initiateAgent,
  createThread,
  addUserMessage,
  startAgent,
  createProject,
  BillingError,
} from '@/lib/api';
import { generateThreadName } from '@/lib/actions/threads';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useBillingError } from '@/hooks/useBillingError';
import { BillingErrorAlert } from '@/components/billing/usage-limit-alert';
import SidebarDialog from '@/components/sidebar/sidebar-dialog';
import { useAccounts } from '@/hooks/use-accounts';
import { isLocalMode, config } from '@/lib/config';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import DropDownMenu from '@/components/headers/DropDownMenu';
import ProfileDropDownMenu from '@/components/headers/ProfileDropDownMenu';
import MobileDropDownMenu from '@/components/headers/MobileDropDownMenu';
import HistoryIcon from '@/components/assets/history';
import NewChatIcon from '@/components/assets/newChat';
import Link from 'next/link';
import Image from 'next/image';
// Constant for localStorage key to ensure consistency
const PENDING_PROMPT_KEY = 'pendingAgentPrompt';

function DashboardContent() {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSubmit, setAutoSubmit] = useState(false);
  const { billingError, handleBillingError, clearBillingError } =
    useBillingError();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();
  const { data: accounts } = useAccounts();
  const personalAccount = accounts?.find((account) => account.personal_account);
  const chatInputRef = useRef<ChatInputHandles>(null);
  const [open, setOpen] = useState(false);

  const secondaryGradient =
    'bg-gradient-to-r from-blue-500 to-blue-500 bg-clip-text text-transparent';

  const handleSubmit = async (
    message: string,
    options?: {
      model_name?: string;
      enable_thinking?: boolean;
      reasoning_effort?: string;
      stream?: boolean;
      enable_context_manager?: boolean;
    },
  ) => {
    if (
      (!message.trim() && !chatInputRef.current?.getPendingFiles().length) ||
      isSubmitting
    )
      return;

    setIsSubmitting(true);

    try {
      const files = chatInputRef.current?.getPendingFiles() || [];
      localStorage.removeItem(PENDING_PROMPT_KEY);

      // Always use FormData for consistency
      const formData = new FormData();
      formData.append('prompt', message);

      // Append files if present
      files.forEach((file, index) => {
        formData.append('files', file, file.name);
      });

      // Append options
      if (options?.model_name) formData.append('model_name', options.model_name);
      formData.append('enable_thinking', String(options?.enable_thinking ?? false));
      formData.append('reasoning_effort', options?.reasoning_effort ?? 'low');
      formData.append('stream', String(options?.stream ?? true));
      formData.append('enable_context_manager', String(options?.enable_context_manager ?? false));

      console.log('FormData content:', Array.from(formData.entries()));

      const result = await initiateAgent(formData);
      console.log('Agent initiated:', result);

      if (result.thread_id) {
        router.push(`/agents/${result.thread_id}`);
      } else {
        throw new Error('Agent initiation did not return a thread_id.');
      }
      chatInputRef.current?.clearPendingFiles();
    } catch (error: any) {
      console.error('Error during submission process:', error);
      if (error instanceof BillingError) {
        console.log('Handling BillingError:', error.detail);
        // handleBillingError({
        //   message:
        //     error.detail.message ||
        //     'Monthly usage limit reached. Please upgrade your plan.',
        //   currentUsage: error.detail.currentUsage as number | undefined,
        //   limit: error.detail.limit as number | undefined,
        //   subscription: error.detail.subscription || {
        //     price_id: config.SUBSCRIPTION_TIERS.FREE.priceId,
        //     plan_name: 'Free',
        //   },
        // });
        setIsSubmitting(false);
        return;
      }

      const isConnectionError =
        error instanceof TypeError && error.message.includes('Failed to fetch');
      if (!isLocalMode() || isConnectionError) {
        toast.error(error.message || 'An unexpected error occurred');
      }
      setIsSubmitting(false);
    }
  };

  // Check for pending prompt in localStorage on mount
  useEffect(() => {
    // Use a small delay to ensure we're fully mounted
    const timer = setTimeout(() => {
      const pendingPrompt = localStorage.getItem(PENDING_PROMPT_KEY);

      if (pendingPrompt) {
        setInputValue(pendingPrompt);
        setAutoSubmit(true); // Flag to auto-submit after mounting
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // Auto-submit the form if we have a pending prompt
  useEffect(() => {
    if (autoSubmit && inputValue && !isSubmitting) {
      const timer = setTimeout(() => {
        handleSubmit(inputValue);
        setAutoSubmit(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [autoSubmit, inputValue, isSubmitting]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {isMobile ? (
        <>
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setOpenMobile(true)}
                >
                  <HistoryIcon className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>History</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard">
                  <NewChatIcon className="h-4 w-4" />
                  <span className="sr-only">New Agent</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>New Agent</TooltipContent>
            </Tooltip>
          </div>
          <div className='absolute top-8 left-1/2 -translate-x-1/2 transform z-10 flex items-center gap-1'>
            {/* <div className={`mr-2`}>
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
            </div> */}
            <DropDownMenu />
          </div>
          <div className='absolute top-4 right-4 z-10'>
            <MobileDropDownMenu endpoint="dashboard" />
          </div>
        </>
      ) : (
        <>
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1">
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
          {/* <div className='absolute top-4 left-1/2 -translate-x-1/2 transform z-10 flex items-center gap-1'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setOpen(true)}
                >
                  <HistoryIcon className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>History</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard">
                  <NewChatIcon className="h-4 w-4" />
                  <span className="sr-only">New Agent</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>New Agent</TooltipContent>
            </Tooltip>
          </div> */}
          <div className='absolute top-4 right-4 z-10 flex items-center gap-1'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setOpen(true)}
                >
                  <HistoryIcon className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>History</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard" className="mr-2 hover:bg-accent rounded-md w-9 h-9 flex items-center justify-center">
                  <NewChatIcon className="h-4 w-4" />
                  <span className="sr-only">New Agent</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>New Agent</TooltipContent>
            </Tooltip>
            <ProfileDropDownMenu endpoint="dashboard" />
          </div>
        </>
      )}

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[650px] max-w-[90%]">
        <div className="flex flex-col items-center text-center mb-2 w-full">
          {/* <h1 className={cn('tracking-tight text-4xl font-semibold leading-tight')}>
            Hey
          </h1> */}
          <Image
            src="/logo-ryxen.svg"
            alt="logo"
            width={300}
            height={300}
            className="h-[60px] sm:h-[64px] w-auto"
          />
          <p className="tracking-tight text-[18px] font-normal text-white mt-6 flex items-center gap-2">
            What would you like Ultron to do today?
          </p>
        </div>

        <div className='max-sm:hidden'>
          <ChatInput
            ref={chatInputRef}
            onSubmit={handleSubmit}
            loading={isSubmitting}
            placeholder="Describe what you need help with..."
            value={inputValue}
            onChange={setInputValue}
            hideAttachments={false}
          />
        </div>
      </div>
      <div className='sm:hidden absolute bottom-0 left-1/2 -translate-x-1/2 transform z-10 w-full'>
        <ChatInput
          ref={chatInputRef}
          onSubmit={handleSubmit}
          loading={isSubmitting}
          placeholder="Describe what you need help with..."
          value={inputValue}
          onChange={setInputValue}
          hideAttachments={false}
        />
      </div>
      <SidebarDialog open={open} onOpenChange={setOpen} />

      {/* Billing Error Alert */}
      {/* <BillingErrorAlert
        message={billingError?.message}
        currentUsage={billingError?.currentUsage}
        limit={billingError?.limit}
        accountId={personalAccount?.account_id}
        onDismiss={clearBillingError}
        isOpen={!!billingError}
      /> */}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[560px] max-w-[90%]">
            <div className="flex flex-col items-center text-center mb-10">
              <Skeleton className="h-10 w-40 mb-2" />
              <Skeleton className="h-7 w-56" />
            </div>

            <Skeleton className="w-full h-[100px] rounded-xl" />
            <div className="flex justify-center mt-3">
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
