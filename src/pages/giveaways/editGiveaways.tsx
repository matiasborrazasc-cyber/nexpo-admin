import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderPopupFullPage from '../../components/headerPopupFullPage/headerPopupFullPage';
import './style.css';
import { useTranslation } from 'react-i18next';
import { getGiveaway, updateGiveaway } from '../../services/giveaways.service';

function EditGiveaways() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { uuid } = useParams<{ uuid: string }>();

    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [hour, setHour] = useState('');
    const [description, setDescription] = useState('');
    const [picture, setPicture] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            if (!uuid) return;
            setLoadError(null);
            try {
                const result = await getGiveaway(uuid);
                const data = result.data;
                if (result.status === 200 && data != null && !Array.isArray(data)) {
                    setName(data.name ?? '');
                    setDate(data.date ? String(data.date).slice(0, 10) : '');
                    setHour(data.hour ? String(data.hour).slice(0, 5) : '');
                    setDescription(data.description ?? '');
                    setPicture(data.picture ?? '');
                } else if (data == null) {
                    setLoadError('Sorteo no encontrado.');
                }
            } catch (err) {
                setLoadError(err instanceof Error ? err.message : 'Error al cargar el sorteo.');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [uuid]);

    const handleSubmit = async () => {
        if (!uuid) return;
        try {
            await updateGiveaway(uuid, { name, date, hour, description, picture });
            navigate('/giveaway');
        } catch (error) {
            console.error('Error al actualizar sorteo:', error);
        }
    };

    if (loading) {
        return (
            <div className='full-page-container'>
                <p style={{ padding: 24 }}>Cargando sorteo...</p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className='full-page-container'>
                <HeaderPopupFullPage
                    actionCancelButton={() => navigate('/giveaway')}
                    title="Editar sorteo"
                />
                <div className='container-form'>
                    <p className='error-text'>{loadError}</p>
                </div>
            </div>
        );
    }

    return (
        <div className='full-page-container'>
            <HeaderPopupFullPage
                actionCancelButton={() => navigate('/giveaway')}
                actionSaveButton={handleSubmit}
                title="Editar sorteo"
                buttonTitle={t('SAVE')}
            />
            <div className='container-form'>
                <div className='form-card'>
                    <div className='container-input'>
                        <label>{t('NAME')}</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder={t('NAME')}
                        />
                    </div>
                    <div className='container-input'>
                        <label>{t('DATE')}</label>
                        <input
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            type="date"
                        />
                    </div>
                    <div className='container-input'>
                        <label>Hora</label>
                        <input
                            value={hour}
                            onChange={(e) => setHour(e.target.value)}
                            type="time"
                        />
                    </div>
                    <div className='container-input'>
                        <label>{t('DESCRIPTION')}</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('DESCRIPTION')}
                            rows={4}
                        />
                    </div>
                    <div className='container-input'>
                        <label>Foto</label>
                        <input
                            value={picture}
                            onChange={(e) => setPicture(e.target.value)}
                            type="text"
                            placeholder="URL de la imagen"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditGiveaways;
