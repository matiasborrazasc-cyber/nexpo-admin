import './style.css';
import Header from '../../components/header/header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronLeft, faChevronRight, faTrash, faPen, faEye } from '@fortawesome/free-solid-svg-icons';
import { QUANTITY_RESULTS } from '../../enums/quantity-results.enum';
import { fetchInfluencers, deleteInfluencer } from '../../services/influencers.service';

function Influencers() {
    const { t } = useTranslation();

    const navigate = useNavigate();
    const [influencers, setInfluencers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');


    useEffect(() => {
        async function getInfluencers() {
            try {
                const result = await fetchInfluencers();
                if (result.status === 200 && Array.isArray(result.data)) {
                    setInfluencers(result.data);
                } else {
                    setInfluencers([]);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        getInfluencers();
    }, []);

    const filteredInfluencers = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return influencers;
        return influencers.filter((inf: any) =>
            (inf.name && inf.name.toLowerCase().includes(term)) ||
            (inf.email && inf.email.toLowerCase().includes(term))
        );
    }, [influencers, search]);

    const handleDelete = async (uuid: string) => {
        const confirmDelete = window.confirm('¿Seguro que quieres eliminar este influencer?');
        if (!confirmDelete) return;

        try {
            await deleteInfluencer(uuid);
            setInfluencers(prev => prev.filter((inf: any) => inf.uuid !== uuid));
        } catch (err: any) {
            setError(err.message || 'Error al eliminar el influencer');
        }
    };

    return (
        <>
            <Header title={t('INFLUENCERS')} subtitle={t('INFLUENCERS_SUBTITLE')}
                actionButton={() => navigate('/create-influencers')}
                showAccount={true} buttonText={t('CREATE_INFLUENCER')} />
            <div className='container-table'>
                <div className='container-filters'>
                    <div className='container-input'>
                        <FontAwesomeIcon icon={faSearch} className='icon-search' />
                        <input
                            type="text"
                            placeholder={t('SEARCH_INFLUENCERS')}
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
                            <th className='table-th' style={{ width: '5%' }}><input type="checkbox" className='custom-checkbox' /></th>
                            <th className='table-th' style={{ width: '25%' }}>{t('NAME')}</th>
                            <th className='table-th' style={{ width: '20%' }}>{t('EMAIL')}</th>
                            <th className='table-th' style={{ width: '50%' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInfluencers.map((influencer: any) => (
                            <tr className='table-tr' key={influencer.uuid}>
                                <td className='table-td'><input type="checkbox" className='custom-checkbox' /></td>
                                <td className='table-td'>
                                    <button type="button" className='link-button' onClick={() => navigate(`/edit-influencers/${influencer.uuid}`)}>
                                        {influencer.name}
                                    </button>
                                </td>
                                <td className='table-td'>{influencer.email}</td>
                                <td className='table-td'>
                                    <button type="button" className='btn-icon' onClick={() => navigate(`/view-influencers/${influencer.uuid}`)} title="Ver info y visitas">
                                        <FontAwesomeIcon icon={faEye} />
                                    </button>
                                    <button type="button" className='btn-icon' onClick={() => navigate(`/edit-influencers/${influencer.uuid}`)}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>
                                    <button type="button" className='btn-icon danger' onClick={() => handleDelete(influencer.uuid)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='footer-table'>
                    <span>{t('TOTAL')}: <span>{filteredInfluencers.length}</span></span>
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

export default Influencers
