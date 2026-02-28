import './style.css';
import Header from '../../components/header/header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronLeft, faChevronRight, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { QUANTITY_RESULTS } from '../../enums/quantity-results.enum';
import { fetchBlog, deleteArticle } from '../../services/blog.service';

function Blog() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [articles, setArticles] = useState<any[]>([]);
    const [, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const result = await fetchBlog();
                if (result.status === 200 && Array.isArray(result.data)) {
                    setArticles(result.data);
                } else {
                    setArticles([]);
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
        if (!term) return articles;
        return articles.filter((a: any) =>
            (a.name && a.name.toLowerCase().includes(term)) ||
            (a.description && a.description.toLowerCase().includes(term)) ||
            (a.category && a.category.toLowerCase().includes(term))
        );
    }, [articles, search]);

    const handleDelete = async (uuid: string) => {
        if (!window.confirm('¿Seguro que quieres eliminar este artículo?')) return;
        setError(null);
        try {
            await deleteArticle(uuid);
            setArticles(prev => prev.filter((a: any) => a.uuid !== uuid));
        } catch (err: any) {
            setError(err?.message || 'Error al eliminar');
        }
    };

    return (
        <>
            <Header
                title={t('BLOG')}
                subtitle={t('BLOG_SUBTITLE')}
                showAccount={true}
                buttonText={t('CREATE_ARTICLE') || 'Crear artículo'}
                actionButton={() => navigate('/create-article')}
            />
            <div className='container-table'>
                <div className='container-filters'>
                    <div className='container-input'>
                        <FontAwesomeIcon icon={faSearch} className='icon-search' />
                        <input
                            type="text"
                            placeholder={t('BLOG_SEARCH')}
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
                            <th className='table-th' style={{ width: '25%' }}>{t('TITLE')}</th>
                            <th className='table-th' style={{ width: '25%' }}>{t('CATEGORY')}</th>
                            <th className='table-th' style={{ width: '30%' }}>Descripción</th>
                            <th className='table-th' style={{ width: '20%' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((article: any) => (
                            <tr className='table-tr' key={article.uuid}>
                                <td className='table-td'>
                                    <button type="button" className='link-button' onClick={() => navigate(`/edit-article/${article.uuid}`)}>
                                        {article.name}
                                    </button>
                                </td>
                                <td className='table-td'>{article.category}</td>
                                <td className='table-td'>{article.description ? `${article.description.slice(0, 60)}${article.description.length > 60 ? '…' : ''}` : ''}</td>
                                <td className='table-td'>
                                    <button type="button" className='btn-icon' onClick={() => navigate(`/edit-article/${article.uuid}`)}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>
                                    <button type="button" className='btn-icon danger' onClick={() => handleDelete(article.uuid)}>
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

export default Blog;
