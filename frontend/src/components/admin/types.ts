export type FileInfo = { originalName: string; mimeType: string; size: number } | null;

export type Application = {
  _id: string; createdAt: string; status: "pending" | "approved" | "rejected"; adminNote: string;
  fullName: string; guardianName: string; dob: string; gender: string; phone: string; alternatePhone: string;
  email: string; address: string; city: string; district: string; state: string; pinCode: string;
  idType: string; unit: string; role: string; reason: string; experience: string;
  photo: FileInfo; idProof: FileInfo; panCard: FileInfo; panNumber: string;
  kycStatus?: "pending" | "verified"; kycVerifiedAt?: string | null; kycVerifiedBy?: string;
};

export type Donation = {
  _id: string; createdAt: string; paidAt: string | null; status: "created" | "paid" | "failed";
  donorName: string; email: string; phone: string; pan: string; message: string; amountPaise: number;
  method: string; paymentVpa: string; razorpayOrderId: string; razorpayPaymentId: string | null;
};

export type MediaItem = {
  _id: string; type: "image" | "video"; url: string; caption: string; originalName: string; size: number; createdAt: string;
};

export type MessageItem = {
  _id: string; createdAt: string; name: string; email: string; phone: string; subject: string; message: string;
  source: "support-us" | "contact-us" | "other"; isRead: boolean;
};

export type Stats = {
  applications: { total: number; pending: number; approved: number; rejected: number };
  kycPending: number;
  donations: { paidCount: number; totalRupees: number };
  unreadMessages: number;
  mediaCount: number;
};

export type Page<T> = { items: T[]; total: number; page: number; pages: number };
