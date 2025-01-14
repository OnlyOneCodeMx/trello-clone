import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/']);

export default clerkMiddleware(async (auth, request) => {
  const { userId, orgId } = await auth();

  const getRedirectPath = () =>
    orgId ? `/organization/${orgId}` : '/select-org';

  // Redirect authenticated users from public routes to their org or org selection
  if (userId && isPublicRoute(request)) {
    return NextResponse.redirect(new URL(getRedirectPath(), request.url));
  }

  // Ensure users without an org are redirected to org selection
  if (userId && !orgId && request.nextUrl.pathname !== '/select-org') {
    return NextResponse.redirect(new URL(getRedirectPath(), request.url));
  }

  // Protect non-public routes from unauthorized access
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
