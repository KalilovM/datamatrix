import type * as React from "react";

export type IconProps = {
	fill?: string;
	stroke?: string;
	strokeWidth?: string;
	className?: string;
	width?: number | string;
	height?: number | string;
	onClick?: () => void;
};

export const LogoIcon: React.FC<IconProps> = ({
	fill = "none",
	stroke = "currentColor",
	strokeWidth = "1.5",
	className = "w-10 h-10",
	width = 70,
	height = 77,
	onClick,
}) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill={fill}
		stroke={stroke}
		strokeWidth={strokeWidth}
		className={className}
		viewBox="0 0 70 77"
		width={width}
		height={height}
		onClick={onClick}
	>
		<path
			fill="url(#paint0_linear_1830_4564)"
			d="M37.162 7.164c2.19.168 4.462.595 6.732 1.301a31.8 31.8 0 0 1 14.777 9.75v-6.068c-1.473-1.339-3.979-3.264-7.038-4.97-2.641-1.473-5.65-2.757-8.728-3.379a2.32 2.32 0 0 1-1.778.827 2.316 2.316 0 0 1-2.32-2.313A2.316 2.316 0 0 1 41.127 0c1.116 0 2.049.786 2.27 1.833"
		/>
	</svg>
);

export const EditIcon: React.FC<IconProps> = ({
	fill = "none",
	stroke = "currentColor",
	strokeWidth = "1.5",
	className = "size-6",
}) => (
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
	fill = "none",
	stroke = "currentColor",
	strokeWidth = "1.5",
	className = "size-6",
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
	fill = "none",
	stroke = "currentColor",
	strokeWidth = "1.5",
	className = "size-6",
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
	fill = "none",
	stroke = "currentColor",
	strokeWidth = "1.5",
	className = "size-6",
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
	fill = "none",
	stroke = "currentColor",
	strokeWidth = "1.5",
	className = "size-6",
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
	fill = "none",
	stroke = "currentColor",
	strokeWidth = "1.5",
	className = "size-6",
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
	fill = "none",
	stroke = "currentColor",
	strokeWidth = "1.5",
	className = "size-6",
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
	fill = "none",
	stroke = "currentColor",
	strokeWidth = "1.5",
	className = "size-6",
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

export const CloseIcon = ({
	fill = "none",
	stroke = "currentColor",
	strokeWidth = "1.5",
	className = "size-6",
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
			d="M6 18 18 6M6 6l12 12"
		></path>
	</svg>
);

export const UploadCloudIcon = ({
	fill = "none",
	stroke = "currentColor",
	strokeWidth = "1.5",
	className = "size-6",
}: IconProps) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill={fill}
		stroke={stroke}
		strokeWidth={strokeWidth}
		className={className}
		viewBox="0 0 48 48"
	>
		<path
			stroke="#2563EB"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="3"
			d="M23.51 32.061v-13.5m0 0 6 6m-6-6-6 6m-4.5 13.5a9 9 0 0 1-2.82-17.55 10.5 10.5 0 0 1 20.466-4.66 6 6 0 0 1 7.516 7.696 7.504 7.504 0 0 1-2.662 14.514z"
		></path>
	</svg>
);

export const OrderIcon = ({
	fill = "none",
	stroke = "currentColor",
	strokeWidth = "1.5",
	className = "size-6",
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
			d="M11.35 3.836q-.099.316-.1.664c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.3 2.3 0 0 0-.1-.664m-5.8 0A2.25 2.25 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0q-.563.035-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414q.564.035 1.124.08c1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
		></path>
	</svg>
);

export const FilterIcon = ({
	fill = "none",
	stroke = "currentColor",
	strokeWidth = "1.5",
	className = "size-6",
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
			d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.3 48.3 0 0 1 12 3"
		></path>
	</svg>
);

export const PrintIcon = ({ className = "size-6" }: IconProps) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		className={className}
		viewBox="0 0 24 24"
	>
		<path
			fillRule="evenodd"
			d="M7.875 1.5C6.839 1.5 6 2.34 6 3.375v2.99q-.64.079-1.274.174C3.272 6.757 2.25 8.022 2.25 9.456v6.294a3 3 0 0 0 3 3h.27l-.155 1.705A1.875 1.875 0 0 0 7.232 22.5h9.536a1.875 1.875 0 0 0 1.867-2.045l-.155-1.705h.27a3 3 0 0 0 3-3V9.456c0-1.434-1.022-2.7-2.476-2.917A49 49 0 0 0 18 6.366V3.375c0-1.036-.84-1.875-1.875-1.875zM16.5 6.205v-2.83A.375.375 0 0 0 16.125 3h-8.25a.375.375 0 0 0-.375.375v2.83a49.4 49.4 0 0 1 9 0m-.217 8.265c.178.018.317.16.333.337l.526 5.784a.375.375 0 0 1-.374.409H7.232a.375.375 0 0 1-.374-.409l.526-5.784a.37.37 0 0 1 .333-.337 41.7 41.7 0 0 1 8.566 0m.967-3.97a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H18a.75.75 0 0 1-.75-.75zM15 9.75a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V10.5a.75.75 0 0 0-.75-.75z"
			clipRule="evenodd"
		></path>
	</svg>
);

export const PlusIcon = ({
	fill = "none",
	stroke = "currentColor",
	strokeWidth = "1.5",
	className = "size-6",
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
			d="M12 4.5v15m7.5-7.5h-15"
		></path>
	</svg>
);

export const UploadIcon = ({
	fill = "none",
	stroke = "currentColor",
	strokeWidth = "1.5",
	className = "size-6",
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
			d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
		></path>
	</svg>
);

export const AggregationIcon = ({
	fill = "none",
	stroke = "currentColor",
	strokeWidth = "1.5",
	className = "size-6",
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
			d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48 48 0 0 0-1.123-.08m-5.801 0q-.099.316-.1.664c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.3 2.3 0 0 0-.1-.664m-5.8 0A2.25 2.25 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0q-.563.035-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125zM6.75 12h.008v.008H6.75zm0 3h.008v.008H6.75zm0 3h.008v.008H6.75z"
		></path>
	</svg>
);

export const DisaggregationIcon = ({
	fill = "none",
	stroke = "currentColor",
	strokeWidth = "1.5",
	className = "size-6",
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
			d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192q.56-.045 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48 48 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.25 2.25 0 0 0 15 2.25h-1.5a2.25 2.25 0 0 0-2.15 1.586m5.8 0q.099.316.1.664v.75h-6V4.5q.001-.348.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9"
		></path>
	</svg>
);

export const AggregatedCodesIcon = ({
	fill = "none",
	stroke = "currentColor",
	strokeWidth = "1.5",
	className = "size-6",
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
			d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125"
		></path>
	</svg>
);
