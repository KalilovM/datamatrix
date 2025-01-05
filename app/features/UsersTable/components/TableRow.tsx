import Button from '@/app/components/Button';
import { EditIcon, BinIcon } from '@/app/components/Icons';
import { User } from '@prisma/client';

interface TableRowProps {
  user: User;
}

export function TableRow({ user }: TableRowProps) {
  return (
    <div className="flex items-center justify-between px-8 py-2 hover:bg-gray-100">
      <div className="flex-1 text-gray-900">{user.username}</div>
      <div className="flex flex-shrink-0 items-center gap-4">
        <Button
          icon={<EditIcon className="size-5" />}
          className="bg-blue-600 px-2.5 py-2.5 text-white hover:bg-blue-700"
        />
        <Button
          icon={<BinIcon className="size-5" />}
          className="bg-red-600 px-2.5 py-2.5 text-white hover:bg-red-700"
        />
      </div>
    </div>
  );
}
