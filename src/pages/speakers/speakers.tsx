import './style.css';
import Header from '../../components/header/header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronLeft, faChevronRight, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { QUANTITY_RESULTS } from '../../enums/quantity-results.enum';
import { fetchSpeakers, deleteSpeaker } from '../../services/speakers.service';

function Speakers() {
    const { t } = useTranslation();

    const navigate = useNavigate();
    const [speakers, setSpeakers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');


    useEffect(() => {
        async function getSpeakers() {
            try {
                const result = await fetchSpeakers();
                if (result.status === 200 && Array.isArray(result.data)) {
                    setSpeakers(result.data);
                } else {
                    setSpeakers([]);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        getSpeakers();
    }, []);

    const filteredSpeakers = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return speakers;
        return speakers.filter((sp: any) =>
            (sp.name && sp.name.toLowerCase().includes(term)) ||
            (sp.email && sp.email.toLowerCase().includes(term))
        );
    }, [speakers, search]);

    const handleDelete = async (uuid: string) => {
        const confirmDelete = window.confirm('¿Seguro que quieres eliminar este orador?');
        if (!confirmDelete) return;

        setError(null);
        try {
            await deleteSpeaker(uuid);
            setSpeakers(prev => prev.filter((sp: any) => sp.uuid !== uuid));
        } catch (err: any) {
            setError(err?.message || 'Error al eliminar el orador');
        }
    };

    return (
        <>
            <Header title={t('SPEAKERS')} subtitle={t('SPEAKERS_SUBTITLE')}
                actionButton={() => navigate('/create-speakers')}
                buttonText={t('CREATE_SPEAKER')}
                showAccount={true} />
            <div className='container-table'>
                <div className='container-filters'>
                    <div className='container-input'>
                        <FontAwesomeIcon icon={faSearch} className='icon-search' />
                        <input
                            type="text"
                            placeholder={t('SEARCH_SPEAKERS')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className='filters-buttons'>
                    </div>
                </div>
                {error && <p className='error-text'>{error}</p>}
                <table className='table-lists'>
                    <thead className='table-header'>
                        <tr className='table-header-row'>
                            <th className='table-th' style={{ width: '25%' }}>{t('TITLE')}</th>
                            <th className='table-th' style={{ width: '20%' }}>{t('EMAIL')}</th>
                            <th className='table-th' style={{ width: '50%' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSpeakers.map((speaker: any) => (
                            <tr className='table-tr' key={speaker.uuid}>
                                <td className='table-td'>
                                    <button
                                        className='link-button'
                                        onClick={() => navigate(`/edit-speakers/${speaker.uuid}`)}
                                    >
                                        {speaker.name}
                                    </button>
                                </td>
                                <td className='table-td'>{speaker.email}</td>
                                <td className='table-td'>
                                    <button
                                        className='btn-icon'
                                        onClick={() => navigate(`/edit-speakers/${speaker.uuid}`)}
                                    >
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>
                                    <button
                                        className='btn-icon danger'
                                        onClick={() => handleDelete(speaker.uuid)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='footer-table'>
                    <span>{t('TOTAL')}: <span>{filteredSpeakers.length}</span></span>
                    <div className='container-pagination'>
                        <select>
                            <option>{QUANTITY_RESULTS.ONE}</option>
                            <option>{QUANTITY_RESULTS.TWO}</option>
                            <option>{QUANTITY_RESULTS.THREE}</option>
                        </select>
                        <div className='container-pagination-buttons'>
                            <button><FontAwesomeIcon icon={faChevronLeft} /></button>
                            <button><FontAwesomeIcon icon={faChevronRight} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Speakers
