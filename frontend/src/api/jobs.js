// src/api/jobs.js
const BASE_URL = 'https://job-tracker-production-7a63.up.railway.app/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(new Error(err.detail || "API Error"), {
      status: res.status,
      data: err,
    });
  }
  if (res.status === 204) return null;
  return res.json();
}

export const jobsApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/jobs/${qs ? `?${qs}` : ""}`);
  },
  get: (id) => request(`/jobs/${id}/`),
  create: (data) =>
    request("/jobs/", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/jobs/${id}/`, { method: "PUT", body: JSON.stringify(data) }),
  patch: (id, data) =>
    request(`/jobs/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id) => request(`/jobs/${id}/`, { method: "DELETE" }),
  updateStatus: (id, status) =>
    request(`/jobs/${id}/status/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  stats: () => request("/jobs/stats/"),
};

export const STATUSES = [
  { value: "wishlist", label: "Wishlist", color: "#94a3b8" },
  { value: "applied", label: "Applied", color: "#60a5fa" },
  { value: "interview", label: "Interview", color: "#a78bfa" },
  { value: "offer", label: "Offer", color: "#34d399" },
  { value: "rejected", label: "Rejected", color: "#f87171" },
  { value: "withdrawn", label: "Withdrawn", color: "#fb923c" },
];

export const STATUS_MAP = Object.fromEntries(STATUSES.map((s) => [s.value, s]));
