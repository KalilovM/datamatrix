import { LogoIconWithText } from "./Icons";
import Avatar from "./Avatar";
import { UserProvider } from "./auth/UserProvider";

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 flex h-16 w-full flex-row items-center justify-between bg-white px-10 shadow-sm print:hidden">
      <LogoIconWithText />
      <UserProvider>{(user) => <Avatar user={user!} />}</UserProvider>
    </nav>
  );
}
