import { useNavigate } from 'react-router-dom';
import HeaderPopupFullPage from '../../components/headerPopupFullPage/headerPopupFullPage';
import { useState } from 'react';
import './style.css';
import { useTranslation } from 'react-i18next';
import { createGiveaway } from '../../services/giveaways.service';

function CreateGiveaways() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [hour, setHour] = useState('');
    const [description, setDescription] = useState('');
    const [picture, setPicture] = useState('');

    const handleSubmit = async () => {
        try {
            await createGiveaway({
                name,
                date,
                hour,
                description,
                picture,
            });
            navigate('/giveaway');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='full-page-container'>
            <HeaderPopupFullPage
                actionCancelButton={() => navigate('/giveaway')}
                actionSaveButton={handleSubmit}
                title="Crear sorteo"
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
                        <label>{t('DATE')}</label>
                        <input
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            type="date"
                        />
                    </div>
                    <div className='container-input'>
                        <label>Hora</label>
                        <input
                            value={hour}
                            onChange={(e) => setHour(e.target.value)}
                            type="time"
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

export default CreateGiveaways;
