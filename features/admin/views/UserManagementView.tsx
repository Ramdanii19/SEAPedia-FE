import { UserManagementSection } from "../sections/UserManagementSection";

export function UserManagementView() {
  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#191c1e]">Manajemen Pengguna</h1>
        <p className="text-sm text-[#6d7a77] mt-0.5">Buat, edit, dan hapus akun pengguna platform.</p>
      </div>
      <UserManagementSection />
    </main>
  );
}
