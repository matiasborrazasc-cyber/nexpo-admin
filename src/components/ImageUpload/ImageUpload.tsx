import { useState } from 'react';
import { uploadStandImage } from '../../services/stands.service';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label: string;
    placeholder?: string;
    /** Función de subida. Por defecto usa uploadStandImage (stands). Para blog usar uploadBlogImage. */
    uploadFn?: (file: File) => Promise<string>;
}

export default function ImageUpload({ value, onChange, label, placeholder = 'Seleccionar imagen', uploadFn }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const doUpload = uploadFn ?? uploadStandImage;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('Solo se permiten imágenes (jpeg, png, gif, webp)');
            return;
        }
        setError(null);
        setUploading(true);
        try {
            const url = await doUpload(file);
            onChange(url);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al subir');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    return (
        <div className="container-input">
            <label>{label}</label>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <label style={{
                    padding: '10px 16px',
                    background: '#6B4EAA',
                    color: 'white',
                    borderRadius: 8,
                    cursor: uploading ? 'wait' : 'pointer',
                    fontSize: 14,
                }}>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleFileChange}
                        disabled={uploading}
                        style={{ display: 'none' }}
                    />
                    {uploading ? 'Subiendo...' : placeholder}
                </label>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="URL o subir archivo"
                    style={{ flex: 1, minWidth: 200 }}
                />
            </div>
            {value && (
                <div style={{ marginTop: 8 }}>
                    <img src={value} alt="Vista previa" style={{ maxWidth: 200, maxHeight: 120, objectFit: 'contain', borderRadius: 8 }} />
                </div>
            )}
            {error && <p style={{ color: '#c00', fontSize: 13, marginTop: 4 }}>{error}</p>}
        </div>
    );
}
