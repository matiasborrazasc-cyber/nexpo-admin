import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderPopupFullPage from '../../../components/headerPopupFullPage/headerPopupFullPage';
import ImageUpload from '../../../components/ImageUpload/ImageUpload';
import '../style.css';
import { useTranslation } from 'react-i18next';
import { getArticle, updateArticle, uploadBlogImage } from '../../../services/blog.service';

function EditArticle() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { uuid } = useParams<{ uuid: string }>();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imagen, setImagen] = useState('');
    const [url, setUrl] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            if (!uuid) return;
            setLoadError(null);
            try {
                const result = await getArticle(uuid);
                const data = result.data;
                if (result.status === 200 && data != null && !Array.isArray(data)) {
                    setName(data.name ?? '');
                    setDescription(data.description ?? '');
                    setImagen(data.imagen ?? '');
                    setUrl(data.url ?? '');
                    setCategory(data.category ?? '');
                } else if (data == null) {
                    setLoadError('Artículo no encontrado.');
                }
            } catch (err) {
                setLoadError(err instanceof Error ? err.message : 'Error al cargar el artículo.');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [uuid]);

    const handleSubmit = async () => {
        if (!uuid) return;
        try {
            await updateArticle(uuid, { name, description, imagen, url, category });
            navigate('/blog');
        } catch (error) {
            console.error('Error al actualizar artículo:', error);
        }
    };

    if (loading) {
        return (
            <div className='full-page-container'>
                <p style={{ padding: 24 }}>Cargando artículo...</p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className='full-page-container'>
                <HeaderPopupFullPage
                    actionCancelButton={() => navigate('/blog')}
                    title={t('EDIT_ARTICLE') || 'Editar artículo'}
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
                actionCancelButton={() => navigate('/blog')}
                actionSaveButton={handleSubmit}
                title={t('EDIT_ARTICLE') || 'Editar artículo'}
                buttonTitle={t('SAVE')}
            />
            <div className='container-form'>
                <div className='form-card'>
                    <div className='container-input'>
                        <label>{t('TITLE')}</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                        <ImageUpload
                            label="Foto"
                            value={imagen}
                            onChange={setImagen}
                            placeholder="Subir imagen"
                            uploadFn={uploadBlogImage}
                        />
                    </div>
                    <div className='container-input'>
                        <label>URL</label>
                        <input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            type="text"
                            placeholder="URL del artículo"
                        />
                    </div>
                    <div className='container-input'>
                        <label>{t('CATEGORY')}</label>
                        <input
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            type="text"
                            placeholder={t('CATEGORY')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditArticle;
