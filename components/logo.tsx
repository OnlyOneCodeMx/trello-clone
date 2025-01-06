import Link from 'next/link';
import Image from 'next/image';
import localFont from 'next/font/local';

import { cn } from '@/lib/utils';

const headingFont = localFont({
  src: '../public/fonts/font.woff2',
});

export const Logo = () => {
  return (
    <Link href="/">
      {/* arreglar que no esta centrado el nombre con el logo */}
      <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
        <Image src="/logo.svg" alt="Logo" height={30} width={30} />
        <p
          className={cn(
            'text-lg text-neutral-700 pb-1',
            headingFont.className
          )}>
          Planify
        </p>
      </div>
    </Link>
  );
};
