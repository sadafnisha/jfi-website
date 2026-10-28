/**
 * ============================================================================
 *  DONATION DETAILS – THE ONLY FILE YOU NEED TO EDIT
 * ============================================================================
 *  Official details have NOT been supplied yet, so every value below is `null`
 *  and the Donate Us section shows a "coming soon / pending" state.
 *
 *  When JFI provides VERIFIED details:
 *    1. Copy the official QR code image to:  public/images/donation/
 *       (for example  public/images/donation/jfi-donation-qr.png)
 *    2. Replace the `null` values below with the verified information.
 *    3. Save. The page updates automatically; no other code needs to change.
 *
 *  Rules:
 *    - Enter details exactly as supplied by JFI. Do not guess or use sample data.
 *    - `qrImage` must be a site path that starts with "/" (a file inside /public).
 *    - Leave a value as `null` (or "") to keep that item in the "pending" state.
 * ============================================================================
 */

export interface DonationConfig {
  /** Path of the official QR code image, e.g. "/images/donation/jfi-donation-qr.png". */
  qrImage: string | null;
  /** Official UPI ID, exactly as supplied by JFI. */
  upiId: string | null;
  beneficiary: {
    /** Account Holder / Beneficiary Name */
    accountHolder: string | null;
    bankName: string | null;
    accountNumber: string | null;
    branchName: string | null;
    ifscCode: string | null;
  };
}

export const donationConfig: DonationConfig = {
  qrImage: null,
  upiId: null,
  beneficiary: {
    accountHolder: null,
    bankName: null,
    accountNumber: null,
    branchName: null,
    ifscCode: null,
  },
};

/* -------------------------------------------------------------------------- */
/* Helpers used by the page (no need to edit below this line)                  */
/* -------------------------------------------------------------------------- */

/** Treats null, undefined and blank strings as "not provided yet". */
function clean(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Only local files inside /public are accepted for the QR image (no external URLs). */
function cleanLocalPath(value: string | null | undefined): string | null {
  const path = clean(value);
  if (!path) return null;
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("..") ? path : null;
}

export interface BeneficiaryRow {
  key: string;
  label: string;
  value: string | null;
  /** Show in a monospaced font (account numbers, IFSC, UPI). */
  mono: boolean;
}

export interface DonationView {
  qrImage: string | null;
  upiId: string | null;
  rows: BeneficiaryRow[];
  /** True only when the QR code, UPI ID and every beneficiary field are configured. */
  isReady: boolean;
  /** True when at least one beneficiary field is still missing. */
  beneficiaryPending: boolean;
}

export function getDonationView(config: DonationConfig = donationConfig): DonationView {
  const qrImage = cleanLocalPath(config.qrImage);
  const upiId = clean(config.upiId);
  const b = config.beneficiary;

  const rows: BeneficiaryRow[] = [
    { key: "accountHolder", label: "Account Holder / Beneficiary Name", value: clean(b.accountHolder), mono: false },
    { key: "bankName", label: "Bank Name", value: clean(b.bankName), mono: false },
    { key: "accountNumber", label: "Account Number", value: clean(b.accountNumber), mono: true },
    { key: "branchName", label: "Branch Name", value: clean(b.branchName), mono: false },
    { key: "ifscCode", label: "IFSC Code", value: clean(b.ifscCode), mono: true },
    { key: "upiId", label: "UPI ID", value: upiId, mono: true },
  ];

  const beneficiaryPending = rows.some((row) => row.value === null);
  return {
    qrImage,
    upiId,
    rows,
    beneficiaryPending,
    isReady: Boolean(qrImage) && !beneficiaryPending,
  };
}