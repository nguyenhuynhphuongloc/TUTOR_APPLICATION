"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Mail, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface WarningModalProps {
  studentId?: string;
  studentIds?: string[];
  studentEmails?: string[];
  studentName?: string;
  currentStatus?: string;
  onUpdate?: () => void;
}

export default function WarningModal({
  studentId,
  studentIds,
  studentEmails,
  studentName,
  currentStatus,
  onUpdate,
}: WarningModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const router = useRouter();

  const targetIds = studentIds || (studentId ? [studentId] : []);
  const isBulk = targetIds.length > 1;

  const handleUpdateStatus = async (
    status: "warning_1" | "warning_2" | "terminated",
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/student/warning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentIds: targetIds, status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      toast.success(
        `Đã cập nhật trạng thái cho ${targetIds.length} học viên và gửi email cảnh báo`,
      );
      setOpen(false);
      onUpdate?.();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCustomEmail = async () => {
    if (!emailSubject || !emailMessage) {
      console.log("Vui lòng điền đầy đủ tất cả các trường");
      return;
    }

    const emails = studentEmails || [];
    if (emails.length === 0) {
      console.log("Không tìm thấy địa chỉ email của học viên");
      return;
    }

    console.log(emails);

    setLoadingEmail(true);
    try {
      const results = await Promise.all(
        emails.map((to) =>
          fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to,
              subject: emailSubject,
              message: emailMessage,
            }),
          }).then((res) =>
            res.json().then((data) => ({ ok: res.ok, error: data.error })),
          ),
        ),
      );

      const successCount = results.filter((r) => r.ok).length;
      if (successCount === emails.length) {
        toast.success("Gửi email thành công!");
        setShowEmailForm(false);
        setEmailSubject("");
        setEmailMessage("");
      } else {
        const firstError = results.find((r) => !r.ok)?.error;
        toast.warning(
          `Đã gửi thành công cho ${successCount}/${emails.length} học viên. ${firstError ? `Lỗi: ${firstError}` : ""}`,
        );
      }
    } catch (error) {
      console.log("Đã xảy ra lỗi không mong đợi.");
    } finally {
      setLoadingEmail(false);
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "warning_1":
        return "Đang bị Cảnh báo lần 1";
      case "warning_2":
        return "Đang bị Cảnh báo lần 2";
      case "terminated":
        return "Đã Hủy hợp đồng";
      default:
        return "Bình thường";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-2 cursor-pointer bg-red-500 text-white hover:bg-red-500 hover:text-white`}
        >
          <AlertTriangle className="h-4 w-4 text-white" />
          {isBulk
            ? `Cảnh báo (${targetIds.length})`
            : currentStatus === "terminated"
              ? "Đã hủy"
              : "Cảnh báo"}
        </Button>
      </DialogTrigger>

      {/* ===== MODAL CONTENT ===== */}
      <DialogContent
        className="
    fixed
    top-1/2
    translate-x-1/2 -translate-y-1/2
    left-1/3
    rounded-3xl
    bg-white
    px-6 py-5
    shadow-xl
    z-50
    animate-in fade-in-0 zoom-in-95
    max-w-[700px]
    h-auto
    max-h-[90vh]
  "
      >
        <DialogHeader className="text-center flex-col">
          <DialogTitle className="text-lg font-bold text-red-600">
            {isBulk
              ? `Cảnh báo ${targetIds.length} học viên`
              : `Cảnh báo học viên: ${studentName}`}
          </DialogTitle>

          <DialogDescription className="text-sm text-slate-600">
            {isBulk ? (
              <span className="text-xl mb-2">
                Hành động này sẽ cập nhật trạng thái của tất cả học viên đã chọn
                và tự động gửi email thông báo.
              </span>
            ) : (
              <>
                Trạng thái hiện tại:{" "}
                <span className="font-semibold text-red-600">
                  {getStatusLabel(currentStatus)}
                </span>
                <br />
                Hệ thống sẽ tự động gửi email thông báo cho học viên.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* ===== ACTION BUTTONS ===== */}
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] pr-2">
          {!showEmailForm ? (
            <>
              <Button
                variant="outline"
                className="justify-start gap-3 border-black-500 text-yellow-700
                       hover:bg-transparent hover:text-current cursor-pointer rounded-xl"
                onClick={() => handleUpdateStatus("warning_1")}
                disabled={loading || loadingEmail}
              >
                <Mail className="h-4 w-4" />
                <span className="text-black-500">Gửi Cảnh báo lần 1</span>
              </Button>

              <Button
                variant="outline"
                className="justify-start gap-3 border-black-500 text-orange-700
                       hover:bg-transparent hover:text-current cursor-pointer rounded-xl"
                onClick={() => handleUpdateStatus("warning_2")}
                disabled={loading || loadingEmail}
              >
                <Mail className="h-4 w-4" />
                Gửi Cảnh báo lần 2
              </Button>

              <Button
                variant="outline"
                className="justify-start gap-3 border-black-500 text-orange-700
                       hover:bg-transparent hover:text-current cursor-pointer rounded-xl"
                onClick={() => handleUpdateStatus("terminated")}
                disabled={loading || loadingEmail}
              >
                <Mail className="h-4 w-4" />
                Hủy hợp đồng đào tạo
              </Button>

              <Button
                variant="outline"
                className="justify-start gap-3 border-blue-500 text-blue-700
                       hover:bg-blue-50 cursor-pointer rounded-xl"
                onClick={() => setShowEmailForm(true)}
                disabled={loading || loadingEmail}
              >
                <Send className="h-4 w-4" />
                Gửi Email tùy chỉnh
              </Button>
            </>
          ) : (
            <div className="space-y-4 animate-in slide-in-from-right-5 duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-slate-800">Gửi Email</h3>
                  <p className="text-[10px] text-slate-500">
                    Gửi email đến học viên đã chọn.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmailForm(false)}
                  className="text-xs hover:bg-slate-100"
                >
                  Quay lại
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="to" className="text-xs font-medium">
                  Người nhận (Email)
                </Label>
                <Input
                  id="to"
                  value={studentEmails?.join(", ") || ""}
                  readOnly
                  placeholder="Không tìm thấy email"
                  className="rounded-lg bg-slate-50 text-slate-600 border-slate-200 text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-xs font-medium">
                  Tiêu đề
                </Label>
                <Input
                  id="subject"
                  placeholder="Tiêu đề email"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="rounded-lg border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-xs font-medium">
                  Nội dung
                </Label>
                <Textarea
                  id="message"
                  placeholder="Nội dung email..."
                  rows={5}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="rounded-lg border-slate-200 resize-none"
                />
              </div>

              <Button
                onClick={handleSendCustomEmail}
                disabled={loadingEmail}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 gap-2 font-bold shadow-lg transition-all"
              >
                {loadingEmail ? (
                  "Đang gửi..."
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Gửi Email
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
        <DialogFooter>
          <p className="text-sm text-muted-foreground text-center w-full text-red-500 font-semibold ">
            Email sẽ được gửi đến địa chỉ email đã đăng ký của học viên.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
