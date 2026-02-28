import { useNavigate } from 'react-router-dom';
import HeaderPopupFullPage from '../../components/headerPopupFullPage/headerPopupFullPage';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import { useState } from 'react';
import './style.css';
import { useTranslation } from 'react-i18next';
import { createEvent, uploadEventImage } from '../../services/events.service';

function CreateEvents() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [hour, setHour] = useState('');
    const [link, setLink] = useState('');
    const [description, setDescription] = useState('');
    const [picture, setPicture] = useState('');
    const [people, setPeople] = useState('');
    const [place, setPlace] = useState('');

    const handleSubmit = async () => {
        try {
            await createEvent({
                name,
                date,
                hour,
                link,
                description,
                picture,
                people,
                place,
            });
            navigate('/events');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='full-page-container'>
            <HeaderPopupFullPage
                actionCancelButton={() => navigate('/events')}
                actionSaveButton={handleSubmit}
                title={t('CREATE_EVENT')}
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
                        <label>Lugar</label>
                        <input
                            value={place}
                            onChange={(e) => setPlace(e.target.value)}
                            type="text"
                            placeholder="Lugar del evento"
                        />
                    </div>
                    <div className='container-input'>
                        <label>Link</label>
                        <input
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            type="text"
                            placeholder="URL"
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
                            value={picture}
                            onChange={setPicture}
                            placeholder="Subir imagen"
                            uploadFn={uploadEventImage}
                        />
                    </div>
                    <div className='container-input'>
                        <label>Personas / aforo</label>
                        <input
                            value={people}
                            onChange={(e) => setPeople(e.target.value)}
                            type="text"
                            placeholder="Ej: 100 personas"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateEvents;
