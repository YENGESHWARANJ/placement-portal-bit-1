/**
 * Institution-grade Domain Validation
 * Ensures all telemetry and identity nodes are within the official @bitsathy.ac.in cluster.
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@bitsathy\.ac\.in$/;
  return regex.test(email);
};

export const validatePasswordStrength = (password: string): { isValid: boolean; score: number } => {
  let score = 0;
  if (password.length >= 8) score += 20;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[a-z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 20;
  if (/[^A-Za-z0-9]/.test(password)) score += 20;
  
  return {
    isValid: score >= 60,
    score
  };
};

export const formatUSN = (usn: string): string => {
  return usn.toUpperCase().trim();
};
