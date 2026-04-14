export const BOTID_CHECK_OPTIONS = {
  checkLevel: "basic" as const,
};

export const BOTID_PROTECTED_ROUTES = [
  {
    path: "/api/leads",
    method: "POST",
    advancedOptions: BOTID_CHECK_OPTIONS,
  },
];
