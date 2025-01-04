import LogoIconWithText from '@/app/components/LogoIconWithText';
import Avatar from '@/app/features/Avatar';

export default function Navbar() {
  return (
    <nav className="fixed top-0 flex h-16 w-full flex-row items-center justify-between bg-white px-10 shadow">
      <LogoIconWithText />
      <Avatar />
    </nav>
  );
}
