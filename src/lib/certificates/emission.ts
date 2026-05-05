export const emitCertificate = async () => {};
export const buildEarnedCertificate = () => ({});
export const isCertificateEarned = () => false;
export interface EarnedCertificateView {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  accentColor: string;
  earnedAt: string;
  studentName: string;
}
