'use client'
import ChatHistory from "@/components/Chat/ChatHistory";
import Header from "@/components/headers";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen h-fit">
      <ChatHistory />
      <Header />
      {children}
    </div>
  )
}

export default ChatLayout;