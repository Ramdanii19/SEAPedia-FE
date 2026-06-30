"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Search } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import adminService from "../service/admin.service";
import { AdminUser } from "../types/admin.types";

const ALL_ROLES = ["BUYER", "SELLER", "DRIVER", "ADMIN"];

const ROLE_COLORS: Record<string, string> = {
  BUYER:  "bg-[#bee5fd] text-[#3d6377]",
  SELLER: "bg-[#89f5e7] text-[#00685f]",
  DRIVER: "bg-[#ffdad4] text-[#aa2e21]",
  ADMIN:  "bg-[#e8eaed] text-[#191c1e]",
};

type FormState = {
  fullName: string;
  email: string;
  password: string;
  roles: string[];
  activeRole: string;
};

const EMPTY_FORM: FormState = { fullName: "", email: "", password: "", roles: ["BUYER"], activeRole: "BUYER" };

export function UserManagementSection() {
  const [users, setUsers]       = useState<AdminUser[]>([]);
  const [total, setTotal]       = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [search, setSearch]     = useState("");

  const [modal, setModal]       = useState<"create" | "edit" | "delete" | null>(null);
  const [target, setTarget]     = useState<AdminUser | null>(null);
  const [form, setForm]         = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getUsers();
      const raw = (res as any).data ?? res;
      setUsers(raw?.users ?? []);
      setTotal(raw?.pagination?.total ?? 0);
    } catch (e: any) {
      setError(e?.message ?? "Gagal memuat data");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setForm(EMPTY_FORM);
    setFormError(null);
    setModal("create");
  }

  function openEdit(user: AdminUser) {
    setTarget(user);
    setForm({ fullName: user.fullName, email: user.email, password: "", roles: user.roles, activeRole: user.activeRole });
    setFormError(null);
    setModal("edit");
  }

  function openDelete(user: AdminUser) {
    setTarget(user);
    setModal("delete");
  }

  function closeModal() {
    setModal(null);
    setTarget(null);
    setFormError(null);
  }

  function toggleRole(role: string) {
    setForm((f) => {
      const next = f.roles.includes(role) ? f.roles.filter((r) => r !== role) : [...f.roles, role];
      return {
        ...f,
        roles: next,
        activeRole: next.includes(f.activeRole) ? f.activeRole : (next[0] ?? "BUYER"),
      };
    });
  }

  async function handleSave() {
    setFormError(null);
    if (!form.fullName.trim()) return setFormError("Nama lengkap wajib diisi");
    if (!form.email.trim())    return setFormError("Email wajib diisi");
    if (modal === "create" && !form.password) return setFormError("Password wajib diisi untuk user baru");
    if (form.roles.length === 0) return setFormError("Pilih minimal 1 role");

    setSaving(true);
    try {
      if (modal === "create") {
        await adminService.createUser({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          roles: form.roles,
          activeRole: form.activeRole,
        });
      } else if (modal === "edit" && target) {
        const payload: any = { fullName: form.fullName, email: form.email, roles: form.roles, activeRole: form.activeRole };
        if (form.password) payload.password = form.password;
        await adminService.updateUser(target._id, payload);
      }
      closeModal();
      load();
    } catch (e: any) {
      setFormError(e?.message ?? "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!target) return;
    setSaving(true);
    try {
      await adminService.deleteUser(target._id);
      closeModal();
      load();
    } catch (e: any) {
      setFormError(e?.message ?? "Gagal menghapus user");
    } finally {
      setSaving(false);
    }
  }

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7a77]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau email..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#bcc9c6]/50 bg-white text-sm text-[#191c1e] placeholder:text-[#6d7a77] focus:outline-none focus:ring-2 focus:ring-[#00685f]/30"
          />
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#00685f] text-white text-sm font-semibold hover:bg-[#005049] transition-colors shrink-0"
        >
          <Plus size={16} />
          Tambah User
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#bcc9c6]/40 bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#bcc9c6]/30">
          <p className="text-sm font-semibold text-[#191c1e]">Daftar Pengguna</p>
          <span className="text-xs text-[#6d7a77]">{total} total</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
          </div>
        ) : error ? (
          <p className="text-sm text-[#cc4636] text-center py-12">{error}</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-2 text-center">
            <p className="text-sm font-semibold text-[#191c1e]">Tidak ada pengguna</p>
            <p className="text-xs text-[#6d7a77]">{search ? "Coba ubah kata kunci pencarian" : "Belum ada user terdaftar"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-[#f8f9fb] border-b border-[#bcc9c6]/30">
                  {["Nama", "Email", "Role", "Aktif", "Dibuat", "Aksi"].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-[#6d7a77] uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user._id} className="border-b border-[#bcc9c6]/30 last:border-0 hover:bg-[#f8f9fb] transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-[#191c1e]">{user.fullName}</td>
                    <td className="py-3 px-4 text-sm text-[#3d4947]">{user.email}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((r) => (
                          <span key={r} className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLORS[r] ?? "bg-[#f2f4f6] text-[#6d7a77]"}`}>
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLORS[user.activeRole] ?? "bg-[#f2f4f6] text-[#6d7a77]"}`}>
                        {user.activeRole}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-[#6d7a77]">{formatDate(user.createdAt)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(user)}
                          className="p-1.5 rounded-lg hover:bg-[#e8f4f3] text-[#00685f] transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => openDelete(user)}
                          className="p-1.5 rounded-lg hover:bg-[#ffdad4] text-[#aa2e21] transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {(modal === "create" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col gap-5 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#191c1e]">
                {modal === "create" ? "Tambah User Baru" : "Edit User"}
              </h2>
              <button onClick={closeModal} className="p-1 rounded-lg hover:bg-[#f2f4f6] text-[#6d7a77]">
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Nama */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#6d7a77]">Nama Lengkap</label>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  className="px-3 py-2.5 rounded-lg border border-[#bcc9c6]/50 text-sm text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#00685f]/30"
                  placeholder="Nama lengkap"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#6d7a77]">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="px-3 py-2.5 rounded-lg border border-[#bcc9c6]/50 text-sm text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#00685f]/30"
                  placeholder="email@example.com"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#6d7a77]">
                  Password {modal === "edit" && <span className="text-[#6d7a77] font-normal">(kosongkan jika tidak diubah)</span>}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="px-3 py-2.5 rounded-lg border border-[#bcc9c6]/50 text-sm text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#00685f]/30"
                  placeholder={modal === "create" ? "Password" : "••••••••"}
                />
              </div>

              {/* Roles */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#6d7a77]">Role</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => toggleRole(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        form.roles.includes(r)
                          ? "border-[#00685f] bg-[#e8f4f3] text-[#00685f]"
                          : "border-[#bcc9c6]/50 bg-white text-[#6d7a77] hover:bg-[#f2f4f6]"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Role */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#6d7a77]">Role Aktif</label>
                <select
                  value={form.activeRole}
                  onChange={(e) => setForm((f) => ({ ...f, activeRole: e.target.value }))}
                  className="px-3 py-2.5 rounded-lg border border-[#bcc9c6]/50 text-sm text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#00685f]/30 bg-white"
                >
                  {form.roles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {formError && <p className="text-xs text-[#cc4636]">{formError}</p>}

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-lg border border-[#bcc9c6]/50 text-sm font-semibold text-[#3d4947] hover:bg-[#f2f4f6] transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 rounded-lg bg-[#00685f] text-white text-sm font-semibold hover:bg-[#005049] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {saving && <Loader2 size={15} className="animate-spin" />}
                {modal === "create" ? "Buat User" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {modal === "delete" && target && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl flex flex-col gap-5 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#191c1e]">Hapus User</h2>
              <button onClick={closeModal} className="p-1 rounded-lg hover:bg-[#f2f4f6] text-[#6d7a77]">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-[#3d4947]">
              Yakin hapus user <span className="font-semibold">{target.fullName}</span>? Tindakan ini tidak bisa dibatalkan.
            </p>
            {formError && <p className="text-xs text-[#cc4636]">{formError}</p>}
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-lg border border-[#bcc9c6]/50 text-sm font-semibold text-[#3d4947] hover:bg-[#f2f4f6] transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex-1 py-2.5 rounded-lg bg-[#aa2e21] text-white text-sm font-semibold hover:bg-[#8c2219] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {saving && <Loader2 size={15} className="animate-spin" />}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
