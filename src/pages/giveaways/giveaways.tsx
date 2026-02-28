import './style.css';
import Header from '../../components/header/header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronLeft, faChevronRight, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { QUANTITY_RESULTS } from '../../enums/quantity-results.enum';
import { fetchGiveaways, deleteGiveaway } from '../../services/giveaways.service';
import { formatListDate, formatListTime } from '../../utils/dateFormat';

function Giveaways() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [giveaways, setGiveaways] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const result = await fetchGiveaways();
                if (result.status === 200 && Array.isArray(result.data)) {
                    setGiveaways(result.data);
                } else {
                    setGiveaways([]);
                }
            } catch (err: any) {
                setError(err?.message ?? 'Error');
            }
        }
        load();
    }, []);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return giveaways;
        return giveaways.filter((g: any) =>
            (g.name && g.name.toLowerCase().includes(term)) ||
            (g.description && g.description.toLowerCase().includes(term)) ||
            (g.date && g.date.toLowerCase().includes(term))
        );
    }, [giveaways, search]);

    const handleDelete = async (uuid: string) => {
        if (!window.confirm('¿Seguro que quieres eliminar este sorteo?')) return;
        setError(null);
        try {
            await deleteGiveaway(uuid);
            setGiveaways(prev => prev.filter((g: any) => g.uuid !== uuid));
        } catch (err: any) {
            setError(err?.message || 'Error al eliminar');
        }
    };

    return (
        <>
            <Header
                title="Sorteos"
                subtitle="Gestiona los sorteos de la feria"
                showAccount={true}
                buttonText="Crear sorteo"
                actionButton={() => navigate('/create-giveaways')}
            />
            <div className='container-table'>
                <div className='container-filters'>
                    <div className='container-input'>
                        <FontAwesomeIcon icon={faSearch} className='icon-search' />
                        <input
                            type="text"
                            placeholder="Buscar sorteos"
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
                            <th className='table-th' style={{ width: '15%' }}>{t('DATE')}</th>
                            <th className='table-th' style={{ width: '10%' }}>Hora</th>
                            <th className='table-th' style={{ width: '33%' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((g: any) => (
                            <tr className='table-tr' key={g.uuid}>
                                <td className='table-td'>
                                    <button type="button" className='link-button' onClick={() => navigate(`/edit-giveaways/${g.uuid}`)}>
                                        {g.name}
                                    </button>
                                </td>
                                <td className='table-td'>{formatListDate(g.date)}</td>
                                <td className='table-td'>{formatListTime(g.hour)}</td>
                                <td className='table-td'>
                                    <button type="button" className='btn-icon' onClick={() => navigate(`/edit-giveaways/${g.uuid}`)}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>
                                    <button type="button" className='btn-icon danger' onClick={() => handleDelete(g.uuid)}>
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

export default Giveaways;
