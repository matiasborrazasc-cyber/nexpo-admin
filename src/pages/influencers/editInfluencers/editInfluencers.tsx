import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderPopupFullPage from '../../../components/headerPopupFullPage/headerPopupFullPage';
import '../style.css';
import { useTranslation } from 'react-i18next';
import { getInfluencer, updateInfluencer } from '../../../services/influencers.service';
import { FAIR_API_BASE } from '../../../services/auth.service';

function EditInfluencers() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { uuid } = useParams<{ uuid: string }>();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [link, setLink] = useState('');
    const [redirection, setRedirection] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            if (!uuid) return;
            setLoadError(null);
            try {
                const result = await getInfluencer(uuid);
                const data = result.data;
                if (result.status === 200 && data != null && !Array.isArray(data)) {
                    setName(data.name ?? '');
                    setEmail(data.email ?? '');
                    setLink(data.link ?? '');
                    setRedirection(data.redirection ?? '');
                } else if (data == null) {
                    setLoadError('Influencer no encontrado.');
                }
            } catch (e) {
                setLoadError(e instanceof Error ? e.message : 'Error al cargar.');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [uuid]);

    const handleSubmit = async () => {
        if (!uuid) return;
        try {
            await updateInfluencer(uuid, { name, email, link, redirection });
            navigate('/influencers');
        } catch (e) {
            console.error('Error al actualizar influencer:', e);
        }
    };

    const redirectUrl = link ? `${FAIR_API_BASE}/influencers/${encodeURIComponent(link)}` : '';

    if (loading) {
        return (
            <div className='full-page-container'>
                <p style={{ padding: 24 }}>Cargando influencer...</p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className='full-page-container'>
                <HeaderPopupFullPage
                    actionCancelButton={() => navigate('/influencers')}
                    title={t('EDIT_INFLUENCER') || 'Editar influencer'}
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
                actionCancelButton={() => navigate('/influencers')}
                actionSaveButton={handleSubmit}
                title={t('EDIT_INFLUENCER') || 'Editar influencer'}
                buttonTitle={t('SAVE')}
            />
            <div className='container-form'>
                <div className='form-card'>
                    <div className='container-input'>
                        <label>{t('NAME')}</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder={t('NAME')} />
                    </div>
                    <div className='container-input'>
                        <label>{t('EMAIL')}</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder={t('EMAIL')} />
                    </div>
                    <div className='container-input'>
                        <label>{t('LINK')}</label>
                        <input value={link} onChange={(e) => setLink(e.target.value)} type="text" placeholder={t('LINK')} />
                        <p className='input-hint'>Quien entre a la URL de abajo será redirigido a la URL de redirección.</p>
                    </div>
                    {redirectUrl && (
                        <div className='container-input'>
                            <label>URL de entrada (compartir este enlace)</label>
                            <input readOnly value={redirectUrl} type="text" className='input-readonly' />
                        </div>
                    )}
                    <div className='container-input'>
                        <label>{t('LINK_REDIRECTION')}</label>
                        <input value={redirection} onChange={(e) => setRedirection(e.target.value)} type="url" placeholder="https://..." />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditInfluencers;
