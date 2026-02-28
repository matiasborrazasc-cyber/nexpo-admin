import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/header/header';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import './style.css';
import { useTranslation } from 'react-i18next';
import { getStand } from '../../services/stands.service';
import {
    fetchProductsByStore,
    fetchCategoriesByStore,
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    uploadProductImage,
    type ProductItem,
    type ProductCategoryItem,
} from '../../services/products.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faArrowLeft, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

function StandDetail() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { uuid } = useParams<{ uuid: string }>();
    const [stand, setStand] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            if (!uuid) return;
            setError(null);
            try {
                const result = await getStand(uuid);
                const data = result.data;
                if (result.status === 200 && data != null && !Array.isArray(data)) {
                    setStand(data);
                } else {
                    setError('Stand no encontrado.');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar el stand.');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [uuid]);

    if (loading) {
        return (
            <div className='full-page-container'>
                <p className='stand-detail-loading'>Cargando stand...</p>
            </div>
        );
    }

    if (error || !stand) {
        return (
            <>
                <Header
                    title={t('STANDS')}
                    subtitle={t('STANDS_SUBTITLE')}
                    showAccount={true}
                />
                <div className='container-form stand-detail'>
                    <button type="button" className='stand-detail-btn-back' onClick={() => navigate('/stands')}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Volver a stands
                    </button>
                    <p className='error-text stand-detail-error'>{error || 'Stand no encontrado.'}</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Header
                title={stand.name}
                subtitle={t('STANDS_SUBTITLE')}
                showAccount={true}
            />
            <div className='container-form stand-detail'>
                <div className='stand-detail-actions'>
                    <button type="button" className='stand-detail-btn-back' onClick={() => navigate('/stands')}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Volver a stands
                    </button>
                    <button type="button" className='stand-detail-btn-edit' onClick={() => navigate(`/edit-stands/${stand.uuid}`)}>
                        <FontAwesomeIcon icon={faPen} /> Editar stand
                    </button>
                </div>

                <div className='stand-detail-hero form-card'>
                    <div className='stand-detail-hero-content'>
                        {(stand.portada || stand.image) && (
                            <div className='stand-detail-hero-image'>
                                <img src={stand.portada || stand.image} alt={stand.name} />
                            </div>
                        )}
                        <div className='stand-detail-hero-text'>
                            {(stand.category || stand.typeOfStand) && (
                                <div className='stand-detail-badges'>
                                    {stand.category && <span className='stand-detail-badge'>{stand.category}</span>}
                                    {stand.typeOfStand && <span className='stand-detail-badge'>{stand.typeOfStand}</span>}
                                </div>
                            )}
                            {stand.description && <p className='stand-detail-desc'>{stand.description}</p>}
                        </div>
                    </div>
                </div>

                {(stand.email || stand.whatsapp || stand.instagram || stand.facebook) && (
                <div className='form-card stand-detail-info'>
                    <h3 className='stand-detail-section-title'>Información del stand</h3>
                    <dl className='stand-detail-fields'>
                        {stand.email && (
                            <div className='stand-detail-field'>
                                <dt>{t('EMAIL')}</dt>
                                <dd><a href={`mailto:${stand.email}`}>{stand.email}</a></dd>
                            </div>
                        )}
                        {stand.whatsapp && (
                            <div className='stand-detail-field'>
                                <dt>{t('WHATSAPP')}</dt>
                                <dd><a href={`https://wa.me/${stand.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">{stand.whatsapp}</a></dd>
                            </div>
                        )}
                        {stand.instagram && (
                            <div className='stand-detail-field'>
                                <dt>{t('INSTAGRAM')}</dt>
                                <dd><a href={stand.instagram.startsWith('http') ? stand.instagram : `https://instagram.com/${stand.instagram}`} target="_blank" rel="noopener noreferrer">{stand.instagram}</a></dd>
                            </div>
                        )}
                        {stand.facebook && (
                            <div className='stand-detail-field'>
                                <dt>Facebook</dt>
                                <dd><a href={stand.facebook.startsWith('http') ? stand.facebook : `https://facebook.com/${stand.facebook}`} target="_blank" rel="noopener noreferrer">{stand.facebook}</a></dd>
                            </div>
                        )}
                    </dl>
                </div>
                )}

                <StandProductsSection stand={stand} />
            </div>
        </>
    );
}

function StandProductsSection({ stand }: { stand: any }) {
    const [productsData, setProductsData] = useState<Record<string, ProductItem[]>>({});
    const [categories, setCategories] = useState<ProductCategoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
    const [formTitle, setFormTitle] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formImage, setFormImage] = useState('');
    const [formPrice, setFormPrice] = useState('');
    const [formCurrency, setFormCurrency] = useState('USD');
    const [formCategory, setFormCategory] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [saving, setSaving] = useState(false);

    const storeUuid = stand.uuid;
    const fair = stand.fair || '';

    const loadProducts = async () => {
        if (!storeUuid) return;
        setLoading(true);
        try {
            const [prods, cats] = await Promise.all([
                fetchProductsByStore(storeUuid),
                fetchCategoriesByStore(storeUuid),
            ]);
            setProductsData(prods);
            setCategories(cats);
        } catch (err) {
            console.error('Error cargando productos:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [storeUuid]);

    const allProducts: ProductItem[] = Object.values(productsData).flat();

    const openCreate = () => {
        setEditingProduct(null);
        setFormTitle('');
        setFormDescription('');
        setFormImage('');
        setFormPrice('');
        setFormCurrency('USD');
        setFormCategory(categories[0]?.uuid || '');
        setNewCategoryName('');
        setShowForm(true);
    };

    const openEdit = (p: ProductItem) => {
        setEditingProduct(p);
        setFormTitle(p.title);
        setFormDescription(p.description || '');
        setFormImage(p.image || '');
        setFormPrice(String(p.price ?? ''));
        setFormCurrency(p.currency || 'USD');
        setFormCategory(p.category || '');
        setNewCategoryName('');
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingProduct(null);
    };

    const handleSubmit = async () => {
        if (!formTitle.trim()) return;
        setSaving(true);
        try {
            let categoryUuid = formCategory;
            if (newCategoryName.trim()) {
                const created = await createCategory({
                    name: newCategoryName.trim(),
                    store: storeUuid,
                    fair,
                });
                categoryUuid = created.uuid;
            } else if (!categoryUuid && categories.length === 0) {
                const created = await createCategory({
                    name: 'General',
                    store: storeUuid,
                    fair,
                });
                categoryUuid = created.uuid;
            }

            const price = parseFloat(formPrice) || 0;

            if (editingProduct) {
                await updateProduct(editingProduct.uuid, {
                    title: formTitle.trim(),
                    description: formDescription.trim(),
                    image: formImage,
                    price,
                    currency: formCurrency,
                    category: categoryUuid,
                    store: storeUuid,
                    fair,
                });
            } else {
                await createProduct({
                    title: formTitle.trim(),
                    description: formDescription.trim(),
                    image: formImage,
                    price,
                    currency: formCurrency,
                    category: categoryUuid,
                    store: storeUuid,
                    fair,
                });
            }
            closeForm();
            loadProducts();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (p: ProductItem) => {
        if (!window.confirm(`¿Eliminar "${p.title}"?`)) return;
        try {
            await deleteProduct(p.uuid);
            loadProducts();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error al eliminar');
        }
    };

    return (
        <div className='form-card stand-detail-products'>
            <div className='stand-detail-products-header'>
                <h3 className='stand-detail-section-title'>Productos</h3>
                <button type="button" className='stand-detail-btn-add' onClick={openCreate}>
                    <FontAwesomeIcon icon={faPlus} /> Agregar producto
                </button>
            </div>

            {loading ? (
                <p className='stand-detail-products-placeholder'>Cargando productos...</p>
            ) : allProducts.length === 0 ? (
                <p className='stand-detail-products-placeholder'>
                    No hay productos. Haz clic en "Agregar producto" para crear uno.
                </p>
            ) : (
                <div className='stand-detail-products-list'>
                    {allProducts.map((p) => (
                        <div key={p.uuid} className='stand-detail-product-row'>
                            {p.image && (
                                <div className='stand-detail-product-thumb'>
                                    <img src={p.image} alt={p.title} />
                                </div>
                            )}
                            <div className='stand-detail-product-info'>
                                <strong>{p.title}</strong>
                                {p.description && <span className='stand-detail-product-desc'>{p.description}</span>}
                                <span className='stand-detail-product-price'>${p.price} {p.currency}</span>
                            </div>
                            <div className='stand-detail-product-actions'>
                                <button type="button" className='stand-detail-btn-edit-sm' onClick={() => openEdit(p)}>
                                    <FontAwesomeIcon icon={faPen} />
                                </button>
                                <button type="button" className='stand-detail-btn-delete' onClick={() => handleDelete(p)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <div className='stand-detail-product-form-overlay' onClick={closeForm}>
                    <div className='stand-detail-product-form' onClick={(e) => e.stopPropagation()}>
                        <h4>{editingProduct ? 'Editar producto' : 'Nuevo producto'}</h4>
                        <div className='container-input'>
                            <label>Título</label>
                            <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Nombre del producto" />
                        </div>
                        <div className='container-input'>
                            <label>Descripción</label>
                            <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Descripción" rows={3} />
                        </div>
                        <div className='container-input'>
                            <ImageUpload
                                label="Foto"
                                value={formImage}
                                onChange={setFormImage}
                                placeholder="Subir imagen"
                                uploadFn={uploadProductImage}
                            />
                        </div>
                        <div className='container-input' style={{ display: 'flex', gap: 12 }}>
                            <div style={{ flex: 1 }}>
                                <label>Precio</label>
                                <input type="number" step="0.01" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="0" />
                            </div>
                            <div style={{ width: 100 }}>
                                <label>Moneda</label>
                                <select value={formCurrency} onChange={(e) => setFormCurrency(e.target.value)}>
                                    <option value="USD">USD</option>
                                    <option value="UYU">UYU</option>
                                    <option value="ARS">ARS</option>
                                </select>
                            </div>
                        </div>
                        <div className='container-input'>
                            <label>Categoría</label>
                            <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
                                <option value="">-- Nueva categoría --</option>
                                {categories.map((c) => (
                                    <option key={c.uuid} value={c.uuid}>{c.name}</option>
                                ))}
                            </select>
                            {(!formCategory || formCategory === '') && (
                                <input
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Nombre de la nueva categoría"
                                    style={{ marginTop: 8 }}
                                />
                            )}
                        </div>
                        <div className='stand-detail-product-form-actions'>
                            <button type="button" onClick={closeForm}>Cancelar</button>
                            <button type="button" className='btn-primary' onClick={handleSubmit} disabled={saving}>
                                {saving ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StandDetail;
