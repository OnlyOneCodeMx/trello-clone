'use client';

import { Menu } from 'lucide-react';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { useMobileSidebar } from '@/hooks/use-mobile-sidebar';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Sidebar } from './sidebar';

export const MobileSidebar = () => {
  const pathName = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const onOpen = useMobileSidebar((state) => state.onOpen);
  const onClose = useMobileSidebar((state) => state.onClose);
  const isOpen = useMobileSidebar((state) => state.isOpen);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    onClose();
  }, [pathName, onClose]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Button
        onClick={onOpen}
        className="block md:hidden mr-2"
        variant="ghost"
        size="sm">
        <Menu className="h-4 w-4" />
      </Button>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-2 pt-10">
          {/* SheetHeader is to be accessible for screen reader users */}
          <SheetHeader className="hidden">
            <SheetTitle>SideBar</SheetTitle>
            <SheetDescription>
              SideBar with organization Workspaces
            </SheetDescription>
          </SheetHeader>
          <Sidebar storageKey="p-sidebar-mobile-state" />
        </SheetContent>
      </Sheet>
    </>
  );
};
