
import Link from 'next/link';


function Logo() {
  return (
    <Link href='/' className='flex items-center gap-4 z-10'>
      <span className='text-xl font-semibold text-primary-100'>
        InstanTask
      </span>
    </Link>
  );
}

