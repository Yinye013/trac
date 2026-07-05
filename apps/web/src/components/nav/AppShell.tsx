import { SidebarNav } from "./SidebarNav";
import { BottomTabBar } from "./BottomTabBar";

export function AppShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-dvh overflow-hidden">
      <SidebarNav />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <main className="min-h-0 flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>
      <BottomTabBar />
    </div>
  );
}
