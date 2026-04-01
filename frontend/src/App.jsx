// src/App.jsx
import { useState, useCallback } from "react";
import { useJobs } from "./hooks/useJobs";
import JobCard from "./components/JobCard";
import JobForm from "./components/JobForm";
import StatsBar from "./components/StatsBar";
import FilterBar from "./components/FilterBar";
import Modal from "./components/Modal";
import ConfirmDialog from "./components/ConfirmDialog";

export default function App() {
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    ordering: "-created_at",
  });
  const {
    jobs,
    stats,
    loading,
    error,
    createJob,
    updateJob,
    deleteJob,
    updateStatus,
    getJob,
  } = useJobs(filters);

  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null); // job id to delete
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => {
    setEditing(null);
    setModal("add");
  };
  const openEdit = async (job) => {
    try {
      const fullJob = await getJob(job.id);
      setEditing(fullJob);
      setModal("edit");
    } catch (e) {
      showToast(e.message || "Could not load job details", "error");
    }
  };
  const closeModal = () => {
    setModal(null);
    setEditing(null);
  };

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (modal === "edit") {
        await updateJob(editing.id, data);
        showToast("Application updated!");
      } else {
        await createJob(data);
        showToast("Application added!");
      }
      closeModal();
    } catch (e) {
      showToast(e.message || "Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteJob(confirm);
      showToast("Application deleted.");
    } catch (e) {
      showToast(e.message || "Delete failed", "error");
    } finally {
      setConfirm(null);
    }
  };

  const handleStatusChange = useCallback(
    async (id, status) => {
      try {
        await updateStatus(id, status);
        showToast("Status updated!");
      } catch (e) {
        showToast(e.message || "Failed to update status", "error");
      }
    },
    [updateStatus],
  );

  const activeFilter = filters.status || filters.search;

  return (
    <div className="app">
      {/* Background decoration */}
      <div className="bg-grid" />
      <div className="bg-glow glow-1" />
      <div className="bg-glow glow-2" />

      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <div>
              <h1 className="logo-title">JobTrack</h1>
              <p className="logo-sub">Your career pipeline</p>
            </div>
          </div>
          <button className="btn-primary btn-add" onClick={openAdd}>
            <span>+</span> New Application
          </button>
        </div>
      </header>

      <main className="app-main">
        <StatsBar stats={stats} />
        <FilterBar filters={filters} onChange={setFilters} />

        {error && (
          <div className="error-banner">
            ⚠️ Could not reach the API — is Django running on port 8000?
            <br />
            <small>{error}</small>
          </div>
        )}

        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="card-skeleton"
                style={{ animationDelay: `${i * 0.08}s` }}
              />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{activeFilter ? "🔍" : "📋"}</div>
            <h3>
              {activeFilter
                ? "No matching applications"
                : "No applications yet"}
            </h3>
            <p>
              {activeFilter
                ? "Try adjusting your filters or search query."
                : "Start tracking your job search — add your first application!"}
            </p>
            {!activeFilter && (
              <button className="btn-primary" onClick={openAdd}>
                + Add First Application
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="results-count">
              {jobs.length} application{jobs.length !== 1 ? "s" : ""}
              {filters.status && ` · ${filters.status}`}
              {filters.search && ` matching "${filters.search}"`}
            </div>
            <div className="jobs-grid">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onEdit={openEdit}
                  onDelete={(id) => setConfirm(id)}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Add / Edit Modal */}
      {modal && (
        <Modal
          title={modal === "edit" ? "Edit Application" : "New Application"}
          onClose={closeModal}
        >
          <JobForm
            initial={editing}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            loading={saving}
          />
        </Modal>
      )}

      {/* Delete Confirm */}
      {confirm && (
        <ConfirmDialog
          message="Delete this application? This cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}
    </div>
  );
}
