import { useNavigate } from 'react-router-dom';
import HeaderPopupFullPage from '../../components/headerPopupFullPage/headerPopupFullPage';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { useState } from 'react';
import './style.css';
import { useTranslation } from 'react-i18next';
import { createSponsors, uploadSponsorImage } from '../../services/sponsors.service';

function CreateSponsors() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = async () => {
        try {
            await createSponsors({
                name,
                description,
                image,
                email,
                phone,
            });
            navigate('/sponsors');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='full-page-container'>
            <HeaderPopupFullPage
                actionSaveButton={handleSubmit}
                actionCancelButton={() => navigate('/sponsors')}
                title={t('CREATE_SPONSOR')}
                buttonTitle={t('SAVE')}
            />
            <div className='container-form'>
                <div className='form-card'>
                    <div className='container-input'>
                        <label>{t('TITLE') || 'Título / Nombre'}</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder={t('NAME')}
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
                            value={image}
                            onChange={setImage}
                            placeholder="Subir imagen"
                            uploadFn={uploadSponsorImage}
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
                        <label>{t('PHONE')}</label>
                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={t('PHONE')}
                            type="text"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateSponsors;
