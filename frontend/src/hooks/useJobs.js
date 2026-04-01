// src/hooks/useJobs.js
import { useState, useEffect, useCallback } from "react";
import { jobsApi } from "../api/jobs";

export function useJobs(filters = {}) {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      if (filters.ordering) params.ordering = filters.ordering;

      const [data, statsData] = await Promise.all([
        jobsApi.list(params),
        jobsApi.stats(),
      ]);
      setJobs(data.results ?? data);
      setStats(statsData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.search, filters.ordering]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const createJob = async (data) => {
    const newJob = await jobsApi.create(data);
    await fetchAll();
    return newJob;
  };

  const updateJob = async (id, data) => {
    const updated = await jobsApi.update(id, data);
    await fetchAll();
    return updated;
  };

  const getJob = async (id) => {
    return jobsApi.get(id);
  };

  const deleteJob = async (id) => {
    await jobsApi.delete(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
    const statsData = await jobsApi.stats();
    setStats(statsData);
  };

  const updateStatus = async (id, status) => {
    const updated = await jobsApi.updateStatus(id, status);
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, ...updated } : j)),
    );
    const statsData = await jobsApi.stats();
    setStats(statsData);
    return updated;
  };

  return {
    jobs,
    stats,
    loading,
    error,
    createJob,
    updateJob,
    deleteJob,
    updateStatus,
    getJob,
    refresh: fetchAll,
  };
}
