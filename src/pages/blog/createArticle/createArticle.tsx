import { useNavigate } from 'react-router-dom';
import HeaderPopupFullPage from '../../../components/headerPopupFullPage/headerPopupFullPage';
import ImageUpload from '../../../components/ImageUpload/ImageUpload';
import { useState } from 'react';
import '../style.css';
import { useTranslation } from 'react-i18next';
import { createArticle, uploadBlogImage } from '../../../services/blog.service';

function CreateArticle() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState('');
    const [url, setUrl] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = async () => {
        try {
            await createArticle({
                name: title,
                description,
                imagen: photo,
                url,
                category,
            });
            navigate('/blog');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='full-page-container'>
            <HeaderPopupFullPage
                actionCancelButton={() => navigate('/blog')}
                actionSaveButton={handleSubmit}
                title={t('CREATE_ARTICLE') || 'Crear artículo'}
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
                        <ImageUpload
                            label="Foto"
                            value={photo}
                            onChange={setPhoto}
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

export default CreateArticle;
