import { useNavigate } from 'react-router-dom';
import HeaderPopupFullPage from '../../components/headerPopupFullPage/headerPopupFullPage';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { useState } from 'react';
import './style.css';
import { useTranslation } from 'react-i18next';
import { createSpeakers, uploadSpeakerImage } from '../../services/speakers.service';

function CreateSpeakers() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [instagram, setInstagram] = useState('');
    const [twitter, setTwitter] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [picture, setPicture] = useState('');


    const handleSubmit = async () => {
        try {
            const response = await createSpeakers({
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
            console.error('Error al crear speaker:', error);
        }
    };

    return (
        <div className='full-page-container'>
            <HeaderPopupFullPage
                actionCancelButton={() => navigate('/speakers')}
                actionSaveButton={handleSubmit}
                title={t('CREATE_SPEAKER')}
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
                            type="email"
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
                        <ImageUpload
                            label="Foto"
                            value={picture}
                            onChange={setPicture}
                            placeholder="Subir imagen"
                            uploadFn={uploadSpeakerImage}
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
                </div>
            </div>
        </div>
    )
}

export default CreateSpeakers
