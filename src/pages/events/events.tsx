import './style.css';
import Header from '../../components/header/header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronLeft, faChevronRight, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { QUANTITY_RESULTS } from '../../enums/quantity-results.enum';
import { fetchEvents, deleteEvent } from '../../services/events.service';
import { formatListDate, formatListTime } from '../../utils/dateFormat';

function Events() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [events, setEvents] = useState<any[]>([]);
    const [, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const result = await fetchEvents();
                if (result.status === 200 && Array.isArray(result.data)) {
                    setEvents(result.data);
                } else {
                    setEvents([]);
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
        if (!term) return events;
        return events.filter((e: any) =>
            (e.name && e.name.toLowerCase().includes(term)) ||
            (e.place && e.place.toLowerCase().includes(term)) ||
            (e.description && e.description.toLowerCase().includes(term)) ||
            (e.date && e.date.toLowerCase().includes(term))
        );
    }, [events, search]);

    const handleDelete = async (uuid: string) => {
        if (!window.confirm('¿Seguro que quieres eliminar este evento?')) return;
        setError(null);
        try {
            await deleteEvent(uuid);
            setEvents(prev => prev.filter((e: any) => e.uuid !== uuid));
        } catch (err: any) {
            setError(err?.message || 'Error al eliminar');
        }
    };

    return (
        <>
            <Header
                title={t('EVENTS')}
                subtitle={t('EVENTS_SUBTITLE')}
                showAccount={true}
                buttonText={t('CREATE_EVENT')}
                actionButton={() => navigate('/create-events')}
            />
            <div className='container-table'>
                <div className='container-filters'>
                    <div className='container-input'>
                        <FontAwesomeIcon icon={faSearch} className='icon-search' />
                        <input
                            type="text"
                            placeholder={t('SEARCH_EVENTS')}
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
                            <th className='table-th' style={{ width: '18%' }}>{t('NAME')}</th>
                            <th className='table-th' style={{ width: '12%' }}>{t('DATE')}</th>
                            <th className='table-th' style={{ width: '10%' }}>Hora</th>
                            <th className='table-th' style={{ width: '15%' }}>Lugar</th>
                            <th className='table-th' style={{ width: '35%' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((event: any) => (
                            <tr className='table-tr' key={event.uuid}>
                                <td className='table-td'>
                                    <button type="button" className='link-button' onClick={() => navigate(`/edit-events/${event.uuid}`)}>
                                        {event.name}
                                    </button>
                                </td>
                                <td className='table-td'>{formatListDate(event.date)}</td>
                                <td className='table-td'>{formatListTime(event.hour)}</td>
                                <td className='table-td'>{event.place}</td>
                                <td className='table-td'>
                                    <button type="button" className='btn-icon' onClick={() => navigate(`/edit-events/${event.uuid}`)}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>
                                    <button type="button" className='btn-icon danger' onClick={() => handleDelete(event.uuid)}>
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

export default Events;
