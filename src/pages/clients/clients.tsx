import './style.css';
import Header from '../../components/header/header';
import { useEffect, useState, useMemo } from 'react';
import { fetchClients } from '../../services/clients.service';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { QUANTITY_RESULTS } from '../../enums/quantity-results.enum';

function Clients() {
    const { t } = useTranslation();
    const [clients, setClients] = useState<any[]>([]);
    const [, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const result = await fetchClients();
                if (result.status === 200 && Array.isArray(result.data)) {
                    setClients(result.data);
                } else {
                    setClients([]);
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
        if (!term) return clients;
        return clients.filter((c: any) =>
            (c.name && c.name.toLowerCase().includes(term)) ||
            (c.email && c.email.toLowerCase().includes(term))
        );
    }, [clients, search]);

    return (
        <>
            <Header title={t('CLIENTS')} subtitle={t('CLIENTS_SUBTITLE')} showAccount={true} />
            <div className='container-table'>
                <div className='container-filters'>
                    <div className='container-input'>
                        <FontAwesomeIcon icon={faSearch} className='icon-search' />
                        <input
                            type="text"
                            placeholder={t('SEARCH_CLIENTS')}
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
                            <th className='table-th' style={{ width: '5%' }}><input type="checkbox" className='custom-checkbox' /></th>
                            <th className='table-th' style={{ width: '35%' }}>{t('NAME')}</th>
                            <th className='table-th' style={{ width: '40%' }}>{t('EMAIL')}</th>
                            <th className='table-th' style={{ width: '20%' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((client: any) => (
                            <tr className='table-tr' key={client.uuid}>
                                <td className='table-td'><input type="checkbox" className='custom-checkbox' /></td>
                                <td className='table-td'>{client.name}</td>
                                <td className='table-td'>{client.email}</td>
                                <td></td>
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

export default Clients;
