"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ReviewCard } from "../components/ReviewCard";
import { ReviewForm } from "../components/ReviewForm";
import { useReviews } from "../hooks/useReviews";
import reviewService from "../service/review.service";

export function ReviewSection() {
  const { user } = useAuth();
  const { reviews, isLoading, reload, myReview } = useReviews();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const hasReview = !!user && !!myReview;

  async function confirmDelete() {
    if (!myReview) return;
    setIsDeleting(true);
    try {
      await reviewService.deleteReview(myReview._id);
      setShowDeleteDialog(false);
      reload();
    } catch {
      // keep UI intact on error
    } finally {
      setIsDeleting(false);
    }
  }

  function handleEditSuccess() {
    setEditMode(false);
    reload();
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-[#191c1e] mb-8">
          Ulasan Pengguna
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Review list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
            {isLoading ? (
              <div className="col-span-2 flex justify-center py-10">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00685f]/20 border-t-[#00685f]" />
              </div>
            ) : reviews.length === 0 ? (
              <p className="col-span-2 text-sm text-[#6d7a77] py-6">
                Belum ada ulasan. Jadilah yang pertama!
              </p>
            ) : (
              reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))
            )}
          </div>

          {/* Right panel */}
          <div className="rounded-xl border border-[#bcc9c6]/40 bg-[#f8f9fb] p-5 sticky top-20">
            {hasReview && !editMode ? (
              <>
                <p className="text-sm font-semibold text-[#191c1e] mb-1">
                  Ulasan Anda
                </p>
                <p className="text-xs text-[#6d7a77] mb-4">
                  Anda sudah memberikan ulasan.
                </p>
                <ReviewCard review={myReview!} />
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5"
                    onClick={() => setEditMode(true)}
                  >
                    <Pencil size={14} />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5 border-[#cc4636]/40 text-[#cc4636] hover:bg-[#cc4636]/5"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 size={14} />
                    Hapus
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-[#191c1e] mb-1">
                  {editMode ? "Edit Ulasan" : "Tulis Ulasan"}
                </p>
                <p className="text-xs text-[#6d7a77] mb-4">
                  {editMode
                    ? "Perbarui rating atau komentar Anda."
                    : "Bagikan pengalaman belanja Anda di SEAPEDIA."}
                </p>
                <ReviewForm
                  onSuccess={editMode ? handleEditSuccess : reload}
                  existing={editMode ? myReview : null}
                  onCancel={editMode ? () => setEditMode(false) : undefined}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Hapus Ulasan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus ulasan ini? Setelah dihapus,
              Anda dapat memberikan ulasan baru.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              disabled={isDeleting}
              className="bg-[#cc4636] hover:bg-[#b03a2e] text-white"
              onClick={confirmDelete}
            >
              {isDeleting ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
