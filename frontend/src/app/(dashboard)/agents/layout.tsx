import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agent Conversation | Kortix Ryxen',
  description: 'Interactive agent conversation powered by Kortix Ryxen',
  openGraph: {
    title: 'Agent Conversation | Kortix Ryxen',
    description: 'Interactive agent conversation powered by Kortix Ryxen',
    type: 'website',
  },
};

export default function AgentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
