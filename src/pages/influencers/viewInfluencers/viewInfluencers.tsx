import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderPopupFullPage from '../../../components/headerPopupFullPage/headerPopupFullPage';
import '../style.css';
import { getInfluencer, getInfluencerViews } from '../../../services/influencers.service';
import { FAIR_API_BASE } from '../../../services/auth.service';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

function ViewInfluencers() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { uuid } = useParams<{ uuid: string }>();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [link, setLink] = useState('');
    const [redirection, setRedirection] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [totalViews, setTotalViews] = useState(0);
    const [dailyViews, setDailyViews] = useState<{ date: string; count: number }[]>([]);

    useEffect(() => {
        async function load() {
            if (!uuid) return;
            setLoadError(null);
            try {
                const [result, viewsResult] = await Promise.all([
                    getInfluencer(uuid),
                    getInfluencerViews(uuid).catch(() => ({ data: { totalViews: 0, dailyViews: [] } })),
                ]);
                const data = result.data;
                if (result.status === 200 && data != null && !Array.isArray(data)) {
                    setName(data.name ?? '');
                    setEmail(data.email ?? '');
                    setLink(data.link ?? '');
                    setRedirection(data.redirection ?? '');
                } else if (data == null) {
                    setLoadError('Influencer no encontrado.');
                }
                if (viewsResult?.data) {
                    setTotalViews(viewsResult.data.totalViews);
                    setDailyViews(viewsResult.data.dailyViews ?? []);
                }
            } catch (e) {
                setLoadError(e instanceof Error ? e.message : 'Error al cargar.');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [uuid]);

    const redirectUrl = link ? `${FAIR_API_BASE}/influencers/${encodeURIComponent(link)}` : '';

    if (loading) {
        return (
            <div className='full-page-container'>
                <p style={{ padding: 24 }}>Cargando...</p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className='full-page-container'>
                <HeaderPopupFullPage
                    actionCancelButton={() => navigate('/influencers')}
                    title="Ver influencer"
                />
                <div className='container-form'>
                    <p className='error-text'>{loadError}</p>
                </div>
            </div>
        );
    }

    return (
        <div className='full-page-container'>
            <HeaderPopupFullPage
                actionCancelButton={() => navigate('/influencers')}
                title="Ver influencer"
            />
            <div className='container-form'>
                <div className='form-card' style={{ marginBottom: 24 }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600 }}>Visitas al enlace</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 20 }}>
                        <span style={{ fontSize: 32, fontWeight: 700, color: '#2563eb' }}>{totalViews}</span>
                        <span style={{ color: '#64748b' }}>personas entraron a tu link</span>
                    </div>
                    {dailyViews.length > 0 ? (
                        <div style={{ height: 220 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dailyViews.map(d => ({ ...d, fecha: d.date }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorVisitasView" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                                    <Tooltip formatter={(v) => [v ?? 0, 'Visitas']} labelFormatter={(v) => `Fecha: ${v}`} />
                                    <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitasView)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p style={{ color: '#94a3b8', fontSize: 14 }}>Aún no hay visitas registradas. Comparte tu enlace para empezar a ver las estadísticas.</p>
                    )}
                </div>
                <div className='form-card'>
                    <div className='container-input'>
                        <label>{t('NAME')}</label>
                        <p style={{ margin: 0, padding: '8px 0' }}>{name}</p>
                    </div>
                    <div className='container-input'>
                        <label>{t('EMAIL')}</label>
                        <p style={{ margin: 0, padding: '8px 0' }}>{email}</p>
                    </div>
                    <div className='container-input'>
                        <label>{t('LINK')}</label>
                        <p style={{ margin: 0, padding: '8px 0' }}>{link}</p>
                    </div>
                    {redirectUrl && (
                        <div className='container-input'>
                            <label>URL de entrada (compartir este enlace)</label>
                            <input readOnly value={redirectUrl} type="text" className='input-readonly' />
                        </div>
                    )}
                    <div className='container-input'>
                        <label>{t('LINK_REDIRECTION')}</label>
                        <p style={{ margin: 0, padding: '8px 0' }}>{redirection}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewInfluencers;
