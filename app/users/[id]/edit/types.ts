export interface Company {
	id: string;
	name: string;
}

export interface User {
	id: string;
	email: string;
	username: string;
	role: "ADMIN" | "COMPANY_ADMIN" | "COMPANY_USER" | null;
	companyId: string | null;
}

export interface CompanyOption {
	label: string;
	value: string;
}

export interface FormData {
	email?: string;
	username: string;
	role: "ADMIN" | "COMPANY_ADMIN" | "COMPANY_USER" | null;
	companyId?: CompanyOption | null;
	password?: string;
}
