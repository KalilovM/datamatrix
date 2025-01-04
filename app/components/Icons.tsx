import * as React from 'react';

type IconProps = {
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
  className?: string;
};

export const EditIcon = ({
  fill = 'none',
  stroke = 'currentColor',
  strokeWidth = '1.5',
  className = 'size-6',
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    className={className}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
    ></path>
  </svg>
);

export const BinIcon = ({
  fill = 'none',
  stroke = 'currentColor',
  strokeWidth = '1.5',
  className = 'size-6',
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    className={className}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21q.512.078 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48 48 0 0 0-3.478-.397m-12 .562q.51-.089 1.022-.165m0 0a48 48 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a52 52 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a49 49 0 0 0-7.5 0"
    ></path>
  </svg>
);

export const ChevronRightIcon = ({
  fill = 'none',
  stroke = 'currentColor',
  strokeWidth = '1.5',
  className = 'size-6',
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    className={className}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m8.25 4.5 7.5 7.5-7.5 7.5"
    ></path>
  </svg>
);

export const EyeIcon = ({
  fill = 'none',
  stroke = 'currentColor',
  strokeWidth = '1.5',
  className = 'size-6',
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    className={className}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1 1 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
    ></path>
  </svg>
);

export const EyeSlashIcon = ({
  fill = 'none',
  stroke = 'currentColor',
  strokeWidth = '1.5',
  className = 'size-6',
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    className={className}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.5 10.5 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.52 10.52 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
    ></path>
  </svg>
);

export const SearchIcon = ({
  fill = 'none',
  stroke = 'currentColor',
  strokeWidth = '1.5',
  className = 'size-6',
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    className={className}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607"
    ></path>
  </svg>
);

export const CompanyIcon = ({
  fill = 'none',
  stroke = 'currentColor',
  strokeWidth = '1.5',
  className = 'size-6',
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    className={className}
    viewBox="0 0 24 24"
  >
    <path d="M15 19.128a9.4 9.4 0 0 0 2.625.372 9.3 9.3 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.3 12.3 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"></path>
  </svg>
);

export const NomenclatureIcon = ({
  fill = 'none',
  stroke = 'currentColor',
  strokeWidth = '1.5',
  className = 'size-6',
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    className={className}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3"
    ></path>
  </svg>
);
