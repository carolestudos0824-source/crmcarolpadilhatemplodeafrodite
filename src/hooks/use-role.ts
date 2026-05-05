export function useRole() { return { role: "user", isStaff: false, isAdmin: false, isAuditor: false, loading: false }; }
export function canAccessSection() { return false; }
