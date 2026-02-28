import './style.css';
import Header from '../../components/header/header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronLeft, faChevronRight, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { QUANTITY_RESULTS } from '../../enums/quantity-results.enum';
import { fetchSponsors, deleteSponsor } from '../../services/sponsors.service';

function Sponsors() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [sponsors, setSponsors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const result = await fetchSponsors();
                if (result.status === 200 && Array.isArray(result.data)) {
                    setSponsors(result.data);
                } else {
                    setSponsors([]);
                }
            } catch (err: any) {
                setError(err?.message ?? 'Error');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return sponsors;
        return sponsors.filter((s: any) =>
            (s.name && s.name.toLowerCase().includes(term)) ||
            (s.email && s.email.toLowerCase().includes(term)) ||
            (s.phone && s.phone.toLowerCase().includes(term))
        );
    }, [sponsors, search]);

    const handleDelete = async (uuid: string) => {
        if (!window.confirm('¿Seguro que quieres eliminar este sponsor?')) return;
        setError(null);
        try {
            await deleteSponsor(uuid);
            setSponsors(prev => prev.filter((s: any) => s.uuid !== uuid));
        } catch (err: any) {
            setError(err?.message || 'Error al eliminar');
        }
    };

    return (
        <>
            <Header
                title={t('SPONSORS')}
                subtitle={t('SPONSORS_SUBTITLE')}
                showAccount={true}
                buttonText={t('CREATE_SPONSOR')}
                actionButton={() => navigate('/create-sponsors')}
            />
            <div className='container-table'>
                <div className='container-filters'>
                    <div className='container-input'>
                        <FontAwesomeIcon icon={faSearch} className='icon-search' />
                        <input
                            type="text"
                            placeholder={t('SEARCH_SPONSORS')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className='filters-buttons' />
                </div>
                {error && <p className='error-text'>{error}</p>}
                <table className='table-lists'>
                    <thead className='table-header'>
                        <tr className='table-header-row'>
                            <th className='table-th' style={{ width: '22%' }}>{t('NAME')}</th>
                            <th className='table-th' style={{ width: '18%' }}>{t('EMAIL')}</th>
                            <th className='table-th' style={{ width: '18%' }}>{t('PHONE')}</th>
                            <th className='table-th' style={{ width: '32%' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((sponsor: any) => (
                            <tr className='table-tr' key={sponsor.uuid}>
                                <td className='table-td'>{sponsor.name}</td>
                                <td className='table-td'>{sponsor.email}</td>
                                <td className='table-td'>{sponsor.phone}</td>
                                <td className='table-td'>
                                    <button type="button" className='btn-icon' onClick={() => navigate(`/edit-sponsors/${sponsor.uuid}`)}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>
                                    <button type="button" className='btn-icon danger' onClick={() => handleDelete(sponsor.uuid)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='footer-table'>
                    <span>{t('TOTAL')}: <span>{filtered.length}</span></span>
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
    );
}

export default Sponsors;
