import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderPopupFullPage from '../../components/headerPopupFullPage/headerPopupFullPage';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import './style.css';
import { useTranslation } from 'react-i18next';
import { getStand, updateStand } from '../../services/stands.service';

function EditStands() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { uuid } = useParams<{ uuid: string }>();

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
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        async function loadStand() {
            if (!uuid) return;
            setLoadError(null);
            try {
                const result = await getStand(uuid);
                const data = result.data;
                if (result.status === 200 && data != null && !Array.isArray(data)) {
                    setName(data.name ?? '');
                    setDescription(data.description ?? '');
                    setPortada(data.portada ?? '');
                    setImage(data.image ?? '');
                    setEmail(data.email ?? '');
                    setWhatsapp(data.whatsapp ?? '');
                    setInstagram(data.instagram ?? '');
                    setFacebook(data.facebook ?? '');
                    setCategory(data.category ?? '');
                    setTypeOfStand(data.typeOfStand ?? '');
                } else if (data == null) {
                    setLoadError('Stand no encontrado.');
                }
            } catch (error) {
                setLoadError(error instanceof Error ? error.message : 'Error al cargar el stand.');
            } finally {
                setLoading(false);
            }
        }
        loadStand();
    }, [uuid]);

    const handleSubmit = async () => {
        if (!uuid) return;
        try {
            await updateStand(uuid, {
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
            console.error('Error al actualizar stand:', error);
        }
    };

    if (loading) {
        return (
            <div className='full-page-container'>
                <p style={{ padding: 24 }}>Cargando stand...</p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className='full-page-container'>
                <HeaderPopupFullPage
                    actionCancelButton={() => navigate('/stands')}
                    title="Editar stand"
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
                actionCancelButton={() => navigate('/stands')}
                actionSaveButton={handleSubmit}
                title="Editar stand"
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

export default EditStands;
