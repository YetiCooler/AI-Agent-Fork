import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agent Conversation | Ryxen',
  description: 'Interactive agent conversation powered by Ryxen',
  openGraph: {
    title: 'Agent Conversation | Ryxen',
    description: 'Interactive agent conversation powered by Ryxen',
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
