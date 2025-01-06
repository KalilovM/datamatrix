import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import Select from 'react-select';

interface UserOptions {
  users: { id: string; username: string; email: string }[];
}

interface UserSelectProps {
  control: any;
}

export const UserSelect: React.FC<UserSelectProps> = ({ control }) => {
  const [userOptions, setUserOptions] = useState<UserOptions>({ users: [] });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        const users = await res.json();
        setUserOptions({ users });
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Controller
      control={control}
      name="userIds"
      render={({ field: { onChange, value, name, ref } }) => (
        <Select
          name={name}
          ref={ref}
          isMulti
          isClearable
          options={userOptions.users.map(user => ({
            value: user.id,
            label: user.username,
          }))}
          value={value?.map((id: string) =>
            userOptions.users.find(user => user.id === id)
              ? {
                  value: id,
                  label: userOptions.users.find(user => user.id === id)!
                    .username,
                }
              : null,
          )}
          onChange={(selectedOptions: any) => {
            console.log(selectedOptions);
            onChange(
              selectedOptions
                ? selectedOptions.map((opt: any) => opt.value)
                : [],
            );
          }}
        />
      )}
    />
  );
};
