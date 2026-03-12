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
import { type BreadcrumbItem, OpsBreadcrumb } from "./ops-breadcrumb";
import { OpsUserMenu } from "./ops-user-menu";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Aujourd'hui", url: "/today", icon: Sun },
  { title: "Projets", url: "/projects", icon: FolderOpen },
  { title: "Clients", url: "/clients", icon: Users },
  {
    title: "Suivi de temps",
    url: "/time",
    icon: Clock,
    items: [{ title: "Récapitulatif", url: "/recap" }],
  },
  { title: "Todos", url: "/todos", icon: CheckSquare },
  { title: "Chat", url: "/chat", icon: MessageSquare },
  { title: "Packages", url: "/packages", icon: Package },
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
              {navItems.map((item) => {
                if (item.items) {
                  const isParentActive =
                    isActive(item.url) && !hasActiveChild(item.items);
                  return (
                    <SidebarCollapsible
                      key={item.url}
                      open={isActive(item.url) || hasActiveChild(item.items)}
                    >
                      <SidebarMenuItem>
                        <SidebarMenuCollapsibleTrigger
                          spacing="compact"
                          asChild
                          isActive={isParentActive}
                        >
                          <Link href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuCollapsibleTrigger>
                        <SidebarCollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((sub) => (
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
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
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
