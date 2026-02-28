import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderPopupFullPage from '../../components/headerPopupFullPage/headerPopupFullPage';
import './style.css';
import { useTranslation } from 'react-i18next';
import { getCupon, updateCupon } from '../../services/cupons.service';

function EditCupon() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { uuid } = useParams<{ uuid: string }>();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [picture, setPicture] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            if (!uuid) return;
            setLoadError(null);
            try {
                const result = await getCupon(uuid);
                const data = result.data;
                if (result.status === 200 && data != null && !Array.isArray(data)) {
                    setTitle(data.title ?? '');
                    setDescription(data.description ?? '');
                    setPicture(data.picture ?? '');
                } else if (data == null) {
                    setLoadError('Cupón no encontrado.');
                }
            } catch (err) {
                setLoadError(err instanceof Error ? err.message : 'Error al cargar el cupón.');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [uuid]);

    const handleSubmit = async () => {
        if (!uuid) return;
        try {
            await updateCupon(uuid, { title, description, picture });
            navigate('/cupons');
        } catch (error) {
            console.error('Error al actualizar cupón:', error);
        }
    };

    if (loading) {
        return (
            <div className='full-page-container'>
                <p style={{ padding: 24 }}>Cargando cupón...</p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className='full-page-container'>
                <HeaderPopupFullPage
                    actionCancelButton={() => navigate('/cupons')}
                    title={t('EDIT_CUPON') || 'Editar cupón'}
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
                actionCancelButton={() => navigate('/cupons')}
                actionSaveButton={handleSubmit}
                title={t('EDIT_CUPON') || 'Editar cupón'}
                buttonTitle={t('SAVE')}
            />
            <div className='container-form'>
                <div className='form-card'>
                    <div className='container-input'>
                        <label>{t('TITLE')}</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            placeholder={t('TITLE')}
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

export default EditCupon;
