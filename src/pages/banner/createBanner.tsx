import { useNavigate } from 'react-router-dom';
import HeaderPopupFullPage from '../../components/headerPopupFullPage/headerPopupFullPage';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { useState } from 'react';
import './style.css';
import { useTranslation } from 'react-i18next';
import { createBanners, uploadBannerImage } from '../../services/banners.service';

function CreateBanner() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [section, setSection] = useState('');
    const [sponsor, setSponsor] = useState('');
    const [url, setUrl] = useState('');

    const handleSubmit = async () => {
        try {
            await createBanners({
                name,
                section,
                sponsor,
                url,
            });
            navigate('/banners');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='full-page-container'>
            <HeaderPopupFullPage
                actionSaveButton={handleSubmit}
                actionCancelButton={() => navigate('/banners')}
                title={t('CREATE_BANNERS')}
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

export default CreateBanner;
