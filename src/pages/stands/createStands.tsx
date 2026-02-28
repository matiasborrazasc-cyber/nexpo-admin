import { useNavigate } from 'react-router-dom';
import HeaderPopupFullPage from '../../components/headerPopupFullPage/headerPopupFullPage';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { useState } from 'react';
import './style.css';
import { useTranslation } from 'react-i18next';
import { createStands } from '../../services/stands.service';

function CreateStands() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [portada, setPortada] = useState('');
    const [image, setImage] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [instagram, setInstagram] = useState('');
    const [facebook, setFacebook] = useState('');
    const [category, setCategory] = useState('');
    const [typeOfStand, setTypeOfStand] = useState('');

    const handleSubmit = async () => {
        try {
            await createStands({
                name,
                description,
                portada,
                image,
                email,
                whatsapp,
                instagram,
                facebook,
                user: '',
                category,
                typeOfStand,
            });
            navigate('/stands');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='full-page-container'>
            <HeaderPopupFullPage
                actionCancelButton={() => navigate('/stands')}
                actionSaveButton={handleSubmit}
                title={t('CREATE_STAND')}
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
                        <label>{t('DESCRIPTION')}</label>
                        <input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('DESCRIPTION')}
                            type="text"
                        />
                    </div>
                    <ImageUpload
                        label="Portada"
                        value={portada}
                        onChange={setPortada}
                        placeholder="Subir portada"
                    />
                    <ImageUpload
                        label="Logo / Imagen"
                        value={image}
                        onChange={setImage}
                        placeholder="Subir logo"
                    />
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
                        <label>{t('WHATSAPP')}</label>
                        <input
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            placeholder={t('WHATSAPP')}
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
                        <label>Facebook</label>
                        <input
                            value={facebook}
                            onChange={(e) => setFacebook(e.target.value)}
                            placeholder="Facebook"
                            type="text"
                        />
                    </div>
                    <div className='container-input'>
                        <label>Categoría</label>
                        <input
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Categoría"
                            type="text"
                        />
                    </div>
                    <div className='container-input'>
                        <label>Tipo de stand</label>
                        <input
                            value={typeOfStand}
                            onChange={(e) => setTypeOfStand(e.target.value)}
                            placeholder="Tipo de stand"
                            type="text"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateStands;
