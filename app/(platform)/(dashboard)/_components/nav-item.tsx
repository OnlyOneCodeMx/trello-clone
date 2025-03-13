/**
 * Navigation Item Component
 *
 * This component handles the rendering of organization navigation items with the following features:
 * - Expandable/collapsible accordion interface
 * - Organization logo and name display
 * - Dynamic route management
 * - Active state indication
 * - Loading state skeleton
 *
 * @param isExpanded - Controls the expanded state of the navigation item
 * @param isActive - Indicates if the item is currently active
 * @param organization - Organization data object
 * @param onExpand - Callback function for expansion state changes
 */

'use-client';

import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Activity, CreditCard, Layout, Settings } from 'lucide-react';

import { cn } from '@/lib/utils';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Organization type definition for type safety
export type Organization = {
  id: string;
  slug: string;
  imageUrl: string;
  name: string;
};

// Props interface for the NavItem component
interface NavItemProps {
  isExpanded: boolean;
  isActive: boolean;
  organization: Organization;
  onExpand: (id: string) => void;
}

export const NavItem = ({
  isExpanded,
  isActive,
  organization,
  onExpand,
}: NavItemProps) => {
  const router = useRouter();
  const pathName = usePathname();

  // Define navigation routes for the organization
  const routes = [
    {
      label: 'Boards',
      icon: <Layout className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}`,
    },
    {
      label: 'Activity',
      icon: <Activity className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/activity`,
    },
    {
      label: 'Settings',
      icon: <Settings className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/settings`,
    },
    {
      label: 'Billing',
      icon: <CreditCard className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/billing `,
    },
  ];

  // Handle navigation to the selected route
  const onClick = (href: string) => {
    router.push(href);
  };

  return (
    <AccordionItem value={organization.id} className="border-none">
      {/* Organization header that toggles expansion */}
      <AccordionTrigger
        onClick={() => onExpand(organization.id)}
        className={cn(
          'flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/50 transition text-start no-underline hover:no-underline',
          isActive && !isExpanded && 'bg-sky-500/10 text-sky-700'
        )}>
        <div className="flex items-center gap-x-2">
          <div className="w-7 h-7 relative">
            <Image
              fill
              src={organization.imageUrl}
              alt="Organization"
              className="rounded-sm object-cover"
            />
          </div>
          <span className="font-medium text-sm">{organization.name}</span>
        </div>
      </AccordionTrigger>
      {/* Expandable content with navigation options */}
      <AccordionContent className="pt-1 text-neutral-700">
        {routes.map((route) => (
          <Button
            key={route.href}
            size="sm"
            variant="ghost"
            onClick={() => onClick(route.href)}
            className={cn(
              'w-full font-normal justify-start pl-10 mb-1',
              pathName === route.href && 'bg-sky-500/10 text-sky-700'
            )}>
            {route.icon}
            {route.label}
          </Button>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

// Skeleton component for loading state
NavItem.Skeleton = function SkeletonNavItem() {
  return (
    <>
      <div className="flex items-center gap-x-2">
        <div className="w-10 h-10 relative shrink-0">
          <Skeleton className="h-full w-full absolute" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </>
  );
};
