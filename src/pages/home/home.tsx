import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore, faUsers, faCalendarDays, faMicrophone, faNewspaper, faGift, faCopy } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './style.css';
import Header from '../../components/header/header';
import { useAuth } from '../../contexts/AuthContext';
import { fetchDashboardStats, type DashboardStats } from '../../services/dashboard.service';
import { fetchInfluencers } from '../../services/influencers.service';
import { FAIR_API_BASE } from '../../services/auth.service';

function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [copyToast, setCopyToast] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, influencersRes] = await Promise.all([
          fetchDashboardStats(),
          fetchInfluencers(),
        ]);
        if (statsRes.status === 200 && statsRes.data) {
          setStats(statsRes.data);
        }
        if (influencersRes.status === 200 && Array.isArray(influencersRes.data)) {
          setInfluencers(influencersRes.data);
        }
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const dashboardInfluencers = influencers.slice(0, 4);

  const getInitials = (name: string): string => {
    if (!name) return '';
    const parts = name.trim().split(' ').filter(Boolean);
    return parts.slice(0, 2).map(p => p[0]).join('').toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return { day: '—', month: '—' };
    const d = new Date(dateStr);
    const day = d.getDate();
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return { day: String(day), month: months[d.getMonth()] };
  };

  const formatHour = (hour: string | null) => {
    if (!hour) return '';
    const h = String(hour);
    if (h.length <= 5) return h;
    return h.substring(0, 5);
  };

  const copyInfluencerLink = async (influencer: { link?: string }) => {
    const link = influencer?.link;
    if (!link) return;
    const fullUrl = `${FAIR_API_BASE}/influencers/${link}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopyToast('Link copiado al portapapeles');
      setTimeout(() => setCopyToast(null), 2000);
    } catch {
      setCopyToast('No se pudo copiar');
      setTimeout(() => setCopyToast(null), 2000);
    }
  };

  return (
    <div className="padding-left-30">
      <Header
        title={user ? `Hola, ${user.name}` : 'Hola'}
        showAccount={true}
        subtitle="Resumen de tu feria en un vistazo"
      />

      {loading ? (
        <div className="dashboard-loading">Cargando estadísticas…</div>
      ) : (
        <>
          <div className="dashboard-stats-grid">
            <Link to="/stands" className="dashboard-stat-card">
              <div className="dashboard-stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
                <FontAwesomeIcon icon={faStore} />
              </div>
              <div className="dashboard-stat-content">
                <span className="dashboard-stat-value">{stats?.totalStands ?? 0}</span>
                <span className="dashboard-stat-label">Stands cargados</span>
              </div>
            </Link>
            <Link to="/clients" className="dashboard-stat-card">
              <div className="dashboard-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div className="dashboard-stat-content">
                <span className="dashboard-stat-value">{stats?.totalClients ?? 0}</span>
                <span className="dashboard-stat-label">Clientes registrados</span>
              </div>
            </Link>
            <Link to="/events" className="dashboard-stat-card">
              <div className="dashboard-stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                <FontAwesomeIcon icon={faCalendarDays} />
              </div>
              <div className="dashboard-stat-content">
                <span className="dashboard-stat-value">{stats?.totalEvents ?? 0}</span>
                <span className="dashboard-stat-label">Eventos programados</span>
              </div>
            </Link>
            <Link to="/speakers" className="dashboard-stat-card">
              <div className="dashboard-stat-icon" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' }}>
                <FontAwesomeIcon icon={faMicrophone} />
              </div>
              <div className="dashboard-stat-content">
                <span className="dashboard-stat-value">{stats?.totalSpeakers ?? 0}</span>
                <span className="dashboard-stat-label">Artistas / Speakers</span>
              </div>
            </Link>
            <Link to="/blog" className="dashboard-stat-card">
              <div className="dashboard-stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                <FontAwesomeIcon icon={faNewspaper} />
              </div>
              <div className="dashboard-stat-content">
                <span className="dashboard-stat-value">{stats?.totalArticles ?? 0}</span>
                <span className="dashboard-stat-label">Artículos del blog</span>
              </div>
            </Link>
            <Link to="/giveaway" className="dashboard-stat-card">
              <div className="dashboard-stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}>
                <FontAwesomeIcon icon={faGift} />
              </div>
              <div className="dashboard-stat-content">
                <span className="dashboard-stat-value">{stats?.totalGiveaways ?? 0}</span>
                <span className="dashboard-stat-label">Sorteos activos</span>
              </div>
            </Link>
          </div>

          <div className="dashboard-row">
            <div>
              <div className="dashboard-calendar-card">
                <h4 className="dashboard-card-title">Próximos eventos</h4>
                {stats?.upcomingEvents && stats.upcomingEvents.length > 0 ? (
                  <div className="dashboard-events-list">
                    {stats.upcomingEvents.map((ev) => {
                      const { day, month } = formatDate(ev.date);
                      const hourStr = formatHour(ev.hour);
                      return (
                        <Link key={ev.uuid} to="/events" className="dashboard-event-item">
                          <div className="dashboard-event-date">
                            <span className="dashboard-event-day">{day}</span>
                            <span className="dashboard-event-month">{month}</span>
                          </div>
                          <div className="dashboard-event-details">
                            <span className="dashboard-event-name">{ev.name}</span>
                            <span className="dashboard-event-meta">
                              {[hourStr, ev.place].filter(Boolean).join(' • ') || 'Sin horario'}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 14, padding: '20px 0', margin: 0 }}>
                    No hay eventos próximos
                  </p>
                )}
              </div>
            </div>
            <div className="dashboard-influencers-card">
              <h4 className="dashboard-card-title">Influencers</h4>
              {dashboardInfluencers.length > 0 ? (
                dashboardInfluencers.map((influencer: any) => (
                  <div
                    key={influencer.uuid}
                    className="dashboard-influencer-item"
                    role="button"
                    tabIndex={0}
                    onClick={() => copyInfluencerLink(influencer)}
                    onKeyDown={(e) => e.key === 'Enter' && copyInfluencerLink(influencer)}
                  >
                    <div className="dashboard-influencer-info">
                      <div className="dashboard-influencer-avatar">
                        {getInitials(influencer.name)}
                      </div>
                      <span className="dashboard-influencer-name">{influencer.name}</span>
                    </div>
                    <span className="dashboard-influencer-share" title="Copiar link">
                      <FontAwesomeIcon icon={faCopy} />
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--color-text-muted)', fontSize: 14, padding: '20px 0' }}>No hay influencers aún</p>
              )}
            </div>
          </div>
        </>
      )}
      {copyToast && (
        <div className="dashboard-copy-toast">{copyToast}</div>
      )}
    </div>
  );
}

export default Home;
