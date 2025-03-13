/**
 * Sidebar Navigation Component
 *
 * This component manages the main navigation sidebar with the following features:
 * - Organization list management
 * - Persistent expansion state using local storage
 * - Dynamic workspace switching
 * - Loading states and skeletons
 * - Add new workspace functionality
 *
 * The sidebar maintains its state between sessions and provides
 * quick access to all available workspaces and their features.
 *
 * @param storageKey - Key used for persisting expansion state in local storage
 */

'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useLocalStorage } from 'usehooks-ts';
import { useOrganization, useOrganizationList } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion } from '@/components/ui/accordion';

import { NavItem, Organization } from './nav-item';

// Props interface for the Sidebar component
interface SidebarProps {
  storageKey?: string;
}

export const Sidebar = ({ storageKey = 'p-sidebar-state' }: SidebarProps) => {
  // Store expanded state in local storage for persistence
  const [expanded, setExpanded] = useLocalStorage<Record<string, boolean>>(
    storageKey,
    {}
  );

  // Get current active organization and loading state
  const { organization: activeOrganization, isLoaded: isLoadedOrg } =
    useOrganization();

  // Get list of all organizations the user belongs to
  const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
    userMemberships: { infinite: true },
  });

  // Convert expanded state object to array of IDs for Accordion
  const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
    (acc: string[], key: string) => {
      if (expanded[key]) {
        acc.push(key);
      }

      return acc;
    },
    []
  );

  // Toggle expansion state for an organization
  const onExpand = (id: string) => {
    setExpanded((curr) => ({
      ...curr,
      [id]: !expanded[id],
    }));
  };

  // Show skeleton loading state while data is being fetched
  if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
    return (
      <>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-10 w-[50%]" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <NavItem.Skeleton />
          <NavItem.Skeleton />
          <NavItem.Skeleton />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header with title and add organization button */}
      <div className="font-medium text- flex items-center mb-1">
        <span className="pl-4">Workspaces</span>
        <Button
          asChild
          type="button"
          size="icon"
          variant="ghost"
          className="ml-auto">
          <Link href="/select-org">
            <Plus className="h-4 W-4" />
          </Link>
        </Button>
      </div>

      {/* Organization list with accordion behavior */}
      <Accordion
        type="multiple"
        defaultValue={defaultAccordionValue}
        className="space-y-2">
        {userMemberships.data.map(({ organization }) => (
          <NavItem
            key={organization.id}
            isActive={activeOrganization?.id === organization.id}
            isExpanded={expanded[organization.id]}
            organization={organization as Organization}
            onExpand={onExpand}
          />
        ))}
      </Accordion>
    </>
  );
};
