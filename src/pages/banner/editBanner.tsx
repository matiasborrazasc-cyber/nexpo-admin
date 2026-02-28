import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderPopupFullPage from '../../components/headerPopupFullPage/headerPopupFullPage';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import './style.css';
import { useTranslation } from 'react-i18next';
import { getBanner, updateBanner, uploadBannerImage } from '../../services/banners.service';

function EditBanner() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { uuid } = useParams<{ uuid: string }>();

    const [name, setName] = useState('');
    const [section, setSection] = useState('');
    const [sponsor, setSponsor] = useState('');
    const [url, setUrl] = useState('');
    const [views, setViews] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            if (!uuid) return;
            setLoadError(null);
            try {
                const result = await getBanner(uuid);
                const data = result.data;
                if (result.status === 200 && data != null && !Array.isArray(data)) {
                    setName(data.name ?? '');
                    setSection(data.section ?? '');
                    setSponsor(data.sponsor ?? '');
                    setUrl(data.url ?? '');
                    setViews(data.views ?? 0);
                } else if (data == null) {
                    setLoadError('Banner no encontrado.');
                }
            } catch (err) {
                setLoadError(err instanceof Error ? err.message : 'Error al cargar el banner.');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [uuid]);

    const handleSubmit = async () => {
        if (!uuid) return;
        try {
            await updateBanner(uuid, { name, section, sponsor, url });
            navigate('/banners');
        } catch (error) {
            console.error('Error al actualizar banner:', error);
        }
    };

    if (loading) {
        return (
            <div className='full-page-container'>
                <p style={{ padding: 24 }}>Cargando banner...</p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className='full-page-container'>
                <HeaderPopupFullPage
                    actionCancelButton={() => navigate('/banners')}
                    title={t('EDIT_BANNER') || 'Editar banner'}
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
                actionCancelButton={() => navigate('/banners')}
                actionSaveButton={handleSubmit}
                title={t('EDIT_BANNER') || 'Editar banner'}
                buttonTitle={t('SAVE')}
            />
            <div className='container-form'>
                <div className='form-card'>
                    <div className='container-input'>
                        <label>Visualizaciones</label>
                        <p style={{ margin: 0, padding: '8px 0', fontSize: 18, fontWeight: 600, color: '#2563eb' }}>{views}</p>
                        <p className='input-hint'>Cantidad de veces que se mostró este banner en la app.</p>
                    </div>
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
                        <label>{t('SECTION')}</label>
                        <select value={section} onChange={(e) => setSection(e.target.value)}>
                            <option value="">Seleccionar sección</option>
                            <option value="Home">Home</option>
                            <option value="Eventos">Eventos</option>
                            <option value="Tiendas">Tiendas</option>
                            <option value="Participantes">Participantes</option>
                        </select>
                    </div>
                    <div className='container-input'>
                        <ImageUpload
                            label={t('URL') || 'Imagen del banner'}
                            value={url}
                            onChange={setUrl}
                            placeholder="Subir imagen"
                            uploadFn={uploadBannerImage}
                        />
                    </div>
                    <div className='container-input'>
                        <label>{t('SPONSORS')}</label>
                        <input
                            value={sponsor}
                            onChange={(e) => setSponsor(e.target.value)}
                            type="text"
                            placeholder={t('SPONSORS')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditBanner;
