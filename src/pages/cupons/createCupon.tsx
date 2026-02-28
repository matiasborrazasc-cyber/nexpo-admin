import { useNavigate } from 'react-router-dom';
import HeaderPopupFullPage from '../../components/headerPopupFullPage/headerPopupFullPage';
import { useState } from 'react';
import './style.css';
import { useTranslation } from 'react-i18next';
import { createCupons } from '../../services/cupons.service';

function CreateCupon() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [picture, setPicture] = useState('');

    const handleSubmit = async () => {
        try {
            await createCupons({
                title,
                description,
                picture,
            });
            navigate('/cupons');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='full-page-container'>
            <HeaderPopupFullPage
                actionSaveButton={handleSubmit}
                actionCancelButton={() => navigate('/cupons')}
                title={t('CREATE_CUPON')}
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

export default CreateCupon;
