"use client";

import { Frame } from "@blazz/ui/components/patterns/frame";
import {
	Sidebar,
	SidebarCollapsible,
	SidebarCollapsibleContent,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuCollapsibleTrigger,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarTrigger,
} from "@blazz/ui/components/ui/sidebar";
import { CheckSquare, Clock, FolderOpen, LayoutDashboard, MessageSquare, Package, Sun, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { type FeatureFlag, isEnabled } from "@/lib/features";
import { type BreadcrumbItem, OpsBreadcrumb } from "./ops-breadcrumb";
import { OpsUserMenu } from "./ops-user-menu";

const navItems: Array<{
  title: string;
  url: string;
  icon: React.ComponentType;
  flag?: FeatureFlag;
  items?: Array<{ title: string; url: string; flag?: FeatureFlag }>;
}> = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, flag: "dashboard" },
  { title: "Aujourd'hui", url: "/today", icon: Sun, flag: "today" },
  { title: "Projets", url: "/projects", icon: FolderOpen, flag: "projects" },
  { title: "Clients", url: "/clients", icon: Users, flag: "clients" },
  {
    title: "Suivi de temps",
    url: "/time",
    icon: Clock,
    flag: "time",
    items: [{ title: "Récapitulatif", url: "/recap", flag: "recap" }],
  },
  { title: "Todos", url: "/todos", icon: CheckSquare, flag: "todos" },
  { title: "Chat", url: "/chat", icon: MessageSquare, flag: "chat" },
  { title: "Packages", url: "/packages", icon: Package, flag: "packages" },
];

function OpsSidebar() {
  const pathname = usePathname();

  const isActive = (url?: string) => {
    if (!pathname || !url) return false;
    if (url === "/") return pathname === "/";
    return pathname.startsWith(url);
  };

  const hasActiveChild = (items?: { url?: string }[]) =>
    items?.some((sub) => isActive(sub.url)) ?? false;

  return (
    <Sidebar
      collapsible="offcanvas"
      className="w-60 top-0 border-r border-edge-subtle"
    >
      <SidebarHeader className="border-b border-edge-subtle pb-2 h-10 justify-center px-5">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo_blazz_white.svg"
            alt="Blazz"
            width={64}
            height={24}
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems
                .filter((item) => !item.flag || isEnabled(item.flag))
                .map((item) => {
                  const filteredItems = item.items?.filter(
                    (sub) => !sub.flag || isEnabled(sub.flag),
                  );
                  const current = filteredItems?.length
                    ? { ...item, items: filteredItems }
                    : { ...item, items: undefined };

                  if (current.items) {
                    const isParentActive =
                      isActive(current.url) && !hasActiveChild(current.items);
                    return (
                      <SidebarCollapsible
                        key={current.url}
                        open={isActive(current.url) || hasActiveChild(current.items)}
                      >
                        <SidebarMenuItem>
                          <SidebarMenuCollapsibleTrigger
                            spacing="compact"
                            asChild
                            isActive={isParentActive}
                          >
                            <Link href={current.url}>
                              <current.icon />
                              <span>{current.title}</span>
                            </Link>
                          </SidebarMenuCollapsibleTrigger>
                          <SidebarCollapsibleContent>
                            <SidebarMenuSub>
                              {current.items.map((sub) => (
                                <SidebarMenuSubItem
                                  key={sub.url}
                                  isActive={isActive(sub.url)}
                                >
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isActive(sub.url)}
                                  >
                                    <Link href={sub.url}>{sub.title}</Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </SidebarCollapsibleContent>
                        </SidebarMenuItem>
                      </SidebarCollapsible>
                    );
                  }
                  return (
                    <SidebarMenuItem key={current.url}>
                      <SidebarMenuButton asChild isActive={isActive(current.url)}>
                        <Link href={current.url}>
                          <current.icon />
                          <span>{current.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <OpsUserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}

const OpsTopBarCtx = createContext<
  Dispatch<SetStateAction<BreadcrumbItem[] | null>>
>(() => {});

export function useOpsTopBar(items: BreadcrumbItem[] | null) {
  const set = useContext(OpsTopBarCtx);
  const key = items?.map((i) => `${i.label}|${i.href ?? ""}`).join(",") ?? "";
  useEffect(() => {
    set(items);
    return () => set(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [set, key]);
}

function MobileHeader() {
  return (
    <div className="flex md:hidden h-10 items-center gap-2 border-b border-edge-subtle bg-raised px-3">
      <SidebarTrigger />
      <Link href="/">
        <Image
          src="/logo_blazz_white.svg"
          alt="Blazz"
          width={64}
          height={24}
        />
      </Link>
    </div>
  );
}

export function OpsFrame({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BreadcrumbItem[] | null>(null);
  return (
    <OpsTopBarCtx.Provider value={setItems}>
      <SidebarProvider>
        <Frame
          navigation={<OpsSidebar />}
          tabBar={
            <>
              <MobileHeader />
              {items ? <OpsBreadcrumb items={items} /> : null}
            </>
          }
        >
          {children}
        </Frame>
      </SidebarProvider>
    </OpsTopBarCtx.Provider>
  );
}
