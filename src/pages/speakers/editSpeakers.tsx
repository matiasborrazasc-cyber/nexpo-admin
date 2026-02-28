import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderPopupFullPage from '../../components/headerPopupFullPage/headerPopupFullPage';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import './style.css';
import { useTranslation } from 'react-i18next';
import { getSpeaker, updateSpeaker, uploadSpeakerImage } from '../../services/speakers.service';

function EditSpeakers() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { uuid } = useParams<{ uuid: string }>();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [instagram, setInstagram] = useState('');
    const [twitter, setTwitter] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [picture, setPicture] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        async function loadSpeaker() {
            if (!uuid) return;
            setLoadError(null);
            try {
                const result = await getSpeaker(uuid);
                const data = result.data;
                if (result.status === 200 && data != null && !Array.isArray(data)) {
                    setName(data.name ?? '');
                    setEmail(data.email ?? '');
                    setDescription(data.description ?? '');
                    setInstagram(data.instagram ?? '');
                    setTwitter(data.twitter ?? '');
                    setWhatsapp(data.whatsapp ?? '');
                    setPicture(data.picture ?? '');
                } else if (data == null) {
                    setLoadError('Orador no encontrado.');
                }
            } catch (error) {
                console.error('Error al cargar orador:', error);
                setLoadError(error instanceof Error ? error.message : 'Error al cargar el orador.');
            } finally {
                setLoading(false);
            }
        }

        loadSpeaker();
    }, [uuid]);

    const handleSubmit = async () => {
        if (!uuid) return;
        try {
            const response = await updateSpeaker(uuid, {
                name,
                email,
                description,
                instagram,
                whatsapp,
                twitter,
                picture,
            });
            if (response.status === 200) {
                navigate('/speakers');
            }
        } catch (error) {
            console.error('Error al actualizar speaker:', error);
        }
    };

    if (loading) {
        return (
            <div className='full-page-container'>
                <p style={{ padding: 24 }}>Cargando orador...</p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className='full-page-container'>
                <HeaderPopupFullPage
                    actionCancelButton={() => navigate('/speakers')}
                    title={t('EDIT_SPEAKER') || 'Editar orador'}
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
                actionCancelButton={() => navigate('/speakers')}
                actionSaveButton={handleSubmit}
                title={t('EDIT_SPEAKER') || 'Editar orador'}
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
                        <label>{t('EMAIL')}</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('EMAIL')}
                            type="text"
                        />
                    </div>
                    <div className='container-input'>
                        <label>{t('DESCRIPTION')}</label>
                        <input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('DESCRIPTION')}
                            type="text"
                        />
                    </div>
                    <div className='container-input'>
                        <label>{t('INSTAGRAM')}</label>
                        <input
                            value={instagram}
                            onChange={(e) => setInstagram(e.target.value)}
                            placeholder={t('INSTAGRAM')}
                            type="text"
                        />
                    </div>
                    <div className='container-input'>
                        <label>{t('WHATSAPP')}</label>
                        <input
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            placeholder={t('WHATSAPP')}
                            type="text"
                        />
                    </div>
                    <div className='container-input'>
                        <label>{t('TWITTER')}</label>
                        <input
                            value={twitter}
                            onChange={(e) => setTwitter(e.target.value)}
                            placeholder={t('TWITTER')}
                            type="text"
                        />
                    </div>
                    <div className='container-input'>
                        <ImageUpload
                            label="Foto"
                            value={picture}
                            onChange={setPicture}
                            placeholder="Subir imagen"
                            uploadFn={uploadSpeakerImage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditSpeakers;

