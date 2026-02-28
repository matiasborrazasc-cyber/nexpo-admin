import { useEffect, useState } from 'react';
import './style.css';
import Header from '../../components/header/header';
import { fetchConfig, updateConfig } from '../../services/config.service';

function Settings() {
    const [primaryColor, setPrimaryColor] = useState('#6840FF');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetchConfig();
                if (res.data?.primaryColor) {
                    setPrimaryColor(res.data.primaryColor);
                }
            } catch (e) {
                setMessage({ type: 'error', text: 'Error al cargar la configuración' });
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            await updateConfig(primaryColor);
            setMessage({ type: 'success', text: 'Color guardado. La app se actualizará con el nuevo color.' });
        } catch (e) {
            setMessage({ type: 'error', text: (e as Error).message || 'Error al guardar' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="padding-left-30">
            <Header
                title="Configuración"
                showAccount={true}
                subtitle="Personaliza el color de la app móvil"
            />
            <div className="settings-container">
                {loading ? (
                    <p>Cargando...</p>
                ) : (
                    <>
                        <div className="settings-section border-radius-32 padding-20 border-cards">
                            <h3 className="settings-section-title">Color de la app</h3>
                            <p className="settings-section-desc">
                                Este color se usará en la app móvil como color principal (botones, enlaces, acentos).
                            </p>
                            <div className="settings-color-row">
                                <input
                                    type="color"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="settings-color-input"
                                />
                                <input
                                    type="text"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="settings-color-text"
                                    placeholder="#6840FF"
                                />
                            </div>
                            <button
                                className="settings-save-btn"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? 'Guardando...' : 'Guardar color'}
                            </button>
                        </div>
                        {message && (
                            <div className={`settings-message settings-message-${message.type}`}>
                                {message.text}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Settings;
