import { DashboardWelcome } from '@/components/dashboard';
import KanbanBoard from '@/components/dashboard/kanban-board';

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-2 py-4 flex flex-col gap-4 h-[calc(100vh-144px)]">
      <DashboardWelcome />
      <KanbanBoard />
    </div>
  );
}
