export interface Company {
	id: string;
	name: string;
}

export interface CompanyOption {
	value: string;
	label: string;
}

export interface FormData {
	email: string;
	username: string;
	password: string;
	role: "ADMIN" | "COMPANY_ADMIN" | "COMPANY_USER" | null;
	companyId?: CompanyOption | null;
}
