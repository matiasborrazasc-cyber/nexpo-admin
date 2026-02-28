/**
 * Formatea una fecha para mostrar en listados (ej: "20 feb 2025").
 * Acepta YYYY-MM-DD o ISO.
 */
export function formatListDate(value: string): string {
    if (!value || typeof value !== 'string') return '—';
    const trimmed = value.trim().slice(0, 10);
    if (!trimmed || trimmed.length < 10) return value;
    const d = new Date(trimmed + 'T12:00:00');
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Formatea la hora para listados (ej: "12:00"). Acepta "12:00" o "12:00:00".
 */
export function formatListTime(value: string): string {
    if (!value || typeof value !== 'string') return '—';
    const trimmed = value.trim();
    if (!trimmed) return '—';
    const part = trimmed.slice(0, 5);
    return /^\d{1,2}:\d{2}$/.test(part) ? part : trimmed;
}
