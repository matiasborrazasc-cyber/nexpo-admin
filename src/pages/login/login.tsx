import { useEffect, useState } from 'react';
import './style.css';
import { login } from '../../services/auth.service';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faEye, faEyeSlash, faChevronDown } from '@fortawesome/free-solid-svg-icons';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const { isAuthenticated, login: loginContext } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            const response = await login({ email, password });
            const { token, user } = response.data ?? {};
            if (!token || !user) {
                throw new Error(response.message || 'Error al iniciar sesión');
            }
            loginContext(token, user);
            setMessage({ type: 'success', text: '¡Operación exitosa!' });
            setTimeout(() => navigate('/'), 800);
        } catch (err: any) {
            const text = err?.message || 'No se pudo iniciar sesión. Revisa tu email y contraseña.';
            setMessage({ type: 'error', text });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">Nexpo</div>
                <h2 className="login-title">Accede a tu cuenta</h2>
                <p className="login-tagline">Creemos en el poder transformador de los eventos</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="field">
                        <label htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="login-password">Contraseña</label>
                        <div className="password-wrapper">
                            <input
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword((s) => !s)}
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>

                    <div className="login-links">
                        <a href="#">¿Olvidaste tu contraseña?</a>
                        <a href="#">Iniciar sesión con SSO</a>
                    </div>

                    {message && (
                        <div className={`login-message ${message.type}`} role="alert">
                            <span className="login-message-icon">
                                {message.type === 'success' ? (
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                ) : (
                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                )}
                            </span>
                            <span>{message.text}</span>
                        </div>
                    )}

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Iniciando sesión…' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="login-footer">
                    <button type="button" className="login-language" aria-label="Idioma">
                        Español <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
