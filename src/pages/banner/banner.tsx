import './style.css';
import Header from '../../components/header/header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronLeft, faChevronRight, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { QUANTITY_RESULTS } from '../../enums/quantity-results.enum';
import { fetchBanners, deleteBanner } from '../../services/banners.service';

function Banner() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [banners, setBanners] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const result = await fetchBanners();
                if (result.status === 200 && Array.isArray(result.data)) {
                    setBanners(result.data);
                } else {
                    setBanners([]);
                }
            } catch (err: any) {
                setError(err?.message ?? 'Error');
            }
        }
        load();
    }, []);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return banners;
        return banners.filter((b: any) =>
            (b.name && b.name.toLowerCase().includes(term)) ||
            (b.section && b.section.toLowerCase().includes(term)) ||
            (b.sponsor && b.sponsor.toLowerCase().includes(term))
        );
    }, [banners, search]);

    const handleDelete = async (uuid: string) => {
        if (!window.confirm('¿Seguro que quieres eliminar este banner?')) return;
        setError(null);
        try {
            await deleteBanner(uuid);
            setBanners(prev => prev.filter((b: any) => b.uuid !== uuid));
        } catch (err: any) {
            setError(err?.message || 'Error al eliminar');
        }
    };

    return (
        <>
            <Header
                title={t('BANNERS')}
                subtitle={t('BANNERS_SUBTITLE')}
                showAccount={true}
                buttonText={t('CREATE_BANNERS')}
                actionButton={() => navigate('/create-banners')}
            />
            <div className='container-table'>
                <div className='container-filters'>
                    <div className='container-input'>
                        <FontAwesomeIcon icon={faSearch} className='icon-search' />
                        <input
                            type="text"
                            placeholder={t('SEARCH_BANNERS')}
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
                            <th className='table-th' style={{ width: '14%' }}>{t('SECTION')}</th>
                            <th className='table-th' style={{ width: '20%' }}>URL / Imagen</th>
                            <th className='table-th' style={{ width: '12%' }}>{t('SPONSORS')}</th>
                            <th className='table-th' style={{ width: '10%' }}>Vistas</th>
                            <th className='table-th' style={{ width: '26%' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((banner: any) => (
                            <tr className='table-tr' key={banner.uuid}>
                                <td className='table-td'>
                                    <button type="button" className='link-button' onClick={() => navigate(`/edit-banners/${banner.uuid}`)}>
                                        {banner.name}
                                    </button>
                                </td>
                                <td className='table-td'>{banner.section}</td>
                                <td className='table-td'>{banner.url ? `${banner.url.slice(0, 30)}${banner.url.length > 30 ? '…' : ''}` : ''}</td>
                                <td className='table-td'>{banner.sponsor}</td>
                                <td className='table-td'>{banner.views ?? 0}</td>
                                <td className='table-td'>
                                    <button type="button" className='btn-icon' onClick={() => navigate(`/edit-banners/${banner.uuid}`)}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>
                                    <button type="button" className='btn-icon danger' onClick={() => handleDelete(banner.uuid)}>
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

export default Banner;
