import './style.css';
import Header from '../../components/header/header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronLeft, faChevronRight, faTrash, faPen, faEye } from '@fortawesome/free-solid-svg-icons';
import { QUANTITY_RESULTS } from '../../enums/quantity-results.enum';
import { fetchStands, deleteStand } from '../../services/stands.service';

function Stands() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [stands, setStands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const result = await fetchStands();
                if (result.status === 200 && Array.isArray(result.data)) {
                    setStands(result.data);
                } else {
                    setStands([]);
                }
            } catch (err: any) {
                setError(err?.message ?? 'Error');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const filteredStands = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return stands;
        return stands.filter((s: any) =>
            (s.name && s.name.toLowerCase().includes(term)) ||
            (s.email && s.email.toLowerCase().includes(term)) ||
            (s.whatsapp && s.whatsapp.toLowerCase().includes(term))
        );
    }, [stands, search]);

    const handleDelete = async (uuid: string) => {
        if (!window.confirm('¿Seguro que quieres eliminar este stand?')) return;
        setError(null);
        try {
            await deleteStand(uuid);
            setStands(prev => prev.filter((s: any) => s.uuid !== uuid));
        } catch (err: any) {
            setError(err?.message || 'Error al eliminar');
        }
    };

    return (
        <>
            <Header
                title={t('STANDS')}
                subtitle={t('STANDS_SUBTITLE')}
                showAccount={true}
                buttonText={t('CREATE_STAND')}
                actionButton={() => navigate('/create-stands')}
            />
            <div className='container-table'>
                <div className='container-filters'>
                    <div className='container-input'>
                        <FontAwesomeIcon icon={faSearch} className='icon-search' />
                        <input
                            type="text"
                            placeholder={t('SEARCH_STANDS')}
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
                            <th className='table-th' style={{ width: '25%' }}>{t('NAME')}</th>
                            <th className='table-th' style={{ width: '20%' }}>{t('EMAIL')}</th>
                            <th className='table-th' style={{ width: '20%' }}>{t('WHATSAPP')}</th>
                            <th className='table-th' style={{ width: '35%' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStands.map((stand: any) => (
                            <tr className='table-tr' key={stand.uuid}>
                                <td className='table-td'>
                                    <button type="button" className='link-button' onClick={() => navigate(`/stands/${stand.uuid}`)}>
                                        {stand.name}
                                    </button>
                                </td>
                                <td className='table-td'>{stand.email}</td>
                                <td className='table-td'>{stand.whatsapp}</td>
                                <td className='table-td'>
                                    <button type="button" className='btn-icon' onClick={() => navigate(`/stands/${stand.uuid}`)} title="Ver detalle">
                                        <FontAwesomeIcon icon={faEye} />
                                    </button>
                                    <button type="button" className='btn-icon' onClick={() => navigate(`/edit-stands/${stand.uuid}`)} title="Editar">
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>
                                    <button type="button" className='btn-icon danger' onClick={() => handleDelete(stand.uuid)} title="Eliminar">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='footer-table'>
                    <span>{t('TOTAL')}: <span>{filteredStands.length}</span></span>
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

export default Stands
