import { useNavigate } from 'react-router-dom';
import HeaderPopupFullPage from '../../../components/headerPopupFullPage/headerPopupFullPage';
import { useState } from 'react';
import '../style.css';
import { useTranslation } from 'react-i18next';
import { createInfluencers } from '../../../services/influencers.service';
import { FAIR_API_BASE } from '../../../services/auth.service';

function CreateInfluencers() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [link, setLink] = useState('');
    const [linkRedirection, setLinkRedirection] = useState('');

    const handleSubmit = async () => {
        try {
            const response = await createInfluencers({
                name,
                email,
                link,
                redirection: linkRedirection,
            });
            if (response.status === 200) {
                navigate('/influencers');
            }
        } catch (error) {
            console.error('Error al crear influencer:', error);
        }
    };

    const redirectUrl = link ? `${FAIR_API_BASE}/influencers/${encodeURIComponent(link)}` : '';

    return (
        <div className='full-page-container'>
            <HeaderPopupFullPage
                actionCancelButton={() => navigate('/influencers')}
                actionSaveButton={handleSubmit}
                title={t('CREATE_INFLUENCER')}
                buttonTitle={t('SAVE')}
            />
            <div className='container-form'>
                <div className='form-card'>
                    <div className='container-input'>
                        <label>{t('NAME')}</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder={t('NAME')} />
                    </div>
                    <div className='container-input'>
                        <label>{t('EMAIL')}</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('EMAIL')} type="text" />
                    </div>
                    <div className='container-input'>
                        <label>{t('LINK')}</label>
                        <input value={link} onChange={(e) => setLink(e.target.value)} placeholder={t('LINK')} type="text" />
                        <p className='input-hint'>Quien entre a la URL de abajo será redirigido a la URL de redirección.</p>
                    </div>
                    {redirectUrl && (
                        <div className='container-input'>
                            <label>URL de entrada (compartir este enlace)</label>
                            <input readOnly value={redirectUrl} type="text" className='input-readonly' />
                        </div>
                    )}
                    <div className='container-input'>
                        <label>{t('LINK_REDIRECTION')}</label>
                        <input
                            value={linkRedirection}
                            onChange={(e) => setLinkRedirection(e.target.value)}
                            placeholder="https://..."
                            type="url"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateInfluencers
