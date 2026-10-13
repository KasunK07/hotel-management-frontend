import { apiRequest } from "../../shared/api/http";

export interface EmployeeInput {
  full_name: string;
  email: string;
  role: string;
  shift: string;
  status: "ACTIVE" | "OFF_DUTY";
}

export interface EmployeeRecord extends EmployeeInput {
  id: string;
  restaurant_id: string;
  created_at: string;
}

const path = (restaurantID: string) => `/restaurants/${restaurantID}/employees`;
export const listEmployees = (restaurantID: string) => apiRequest<EmployeeRecord[]>(path(restaurantID)).then((data) => data || []);
export const createEmployee = (restaurantID: string, input: EmployeeInput) => apiRequest<EmployeeRecord>(path(restaurantID), { method: "POST", body: JSON.stringify(input) });
export const updateEmployee = (restaurantID: string, employeeID: string, input: EmployeeInput) => apiRequest<EmployeeRecord>(`${path(restaurantID)}/${employeeID}`, { method: "PUT", body: JSON.stringify(input) });
export const deleteEmployee = (restaurantID: string, employeeID: string) => apiRequest<void>(`${path(restaurantID)}/${employeeID}`, { method: "DELETE" });
