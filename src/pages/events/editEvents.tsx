import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderPopupFullPage from '../../components/headerPopupFullPage/headerPopupFullPage';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import './style.css';
import { useTranslation } from 'react-i18next';
import { getEvent, updateEvent, uploadEventImage } from '../../services/events.service';

function EditEvents() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { uuid } = useParams<{ uuid: string }>();

    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [hour, setHour] = useState('');
    const [link, setLink] = useState('');
    const [description, setDescription] = useState('');
    const [picture, setPicture] = useState('');
    const [people, setPeople] = useState('');
    const [place, setPlace] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            if (!uuid) return;
            setLoadError(null);
            try {
                const result = await getEvent(uuid);
                const data = result.data;
                if (result.status === 200 && data != null && !Array.isArray(data)) {
                    setName(data.name ?? '');
                    setDate(data.date ? String(data.date).slice(0, 10) : '');
                    setHour(data.hour ? String(data.hour).slice(0, 5) : '');
                    setLink(data.link ?? '');
                    setDescription(data.description ?? '');
                    setPicture(data.picture ?? '');
                    setPeople(data.people ?? '');
                    setPlace(data.place ?? '');
                } else if (data == null) {
                    setLoadError('Evento no encontrado.');
                }
            } catch (err) {
                setLoadError(err instanceof Error ? err.message : 'Error al cargar el evento.');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [uuid]);

    const handleSubmit = async () => {
        if (!uuid) return;
        try {
            await updateEvent(uuid, {
                name,
                date,
                hour,
                link,
                description,
                picture,
                people,
                place,
            });
            navigate('/events');
        } catch (error) {
            console.error('Error al actualizar evento:', error);
        }
    };

    if (loading) {
        return (
            <div className='full-page-container'>
                <p style={{ padding: 24 }}>Cargando evento...</p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className='full-page-container'>
                <HeaderPopupFullPage
                    actionCancelButton={() => navigate('/events')}
                    title={t('EDIT_EVENT') || 'Editar evento'}
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
                actionCancelButton={() => navigate('/events')}
                actionSaveButton={handleSubmit}
                title={t('EDIT_EVENT') || 'Editar evento'}
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
                        <label>Lugar</label>
                        <input
                            value={place}
                            onChange={(e) => setPlace(e.target.value)}
                            type="text"
                            placeholder="Lugar del evento"
                        />
                    </div>
                    <div className='container-input'>
                        <label>Link</label>
                        <input
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            type="text"
                            placeholder="URL"
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
                        <ImageUpload
                            label="Foto"
                            value={picture}
                            onChange={setPicture}
                            placeholder="Subir imagen"
                            uploadFn={uploadEventImage}
                        />
                    </div>
                    <div className='container-input'>
                        <label>Personas / aforo</label>
                        <input
                            value={people}
                            onChange={(e) => setPeople(e.target.value)}
                            type="text"
                            placeholder="Ej: 100 personas"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditEvents;
