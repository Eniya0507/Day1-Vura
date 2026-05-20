export function generateCertificateId(): string {
    const buf = new Uint8Array(4);
    crypto.getRandomValues(buf);
    return "CERT-" + Array.from(buf).map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export function generateBatchId(): string {
    const buf = new Uint8Array(4);
    crypto.getRandomValues(buf);
    return "BATCH-" + Array.from(buf).map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}