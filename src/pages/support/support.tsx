import "./support.css";

/**
 * Página pública de soporte para la app Nexpo.
 * Requerida por App Store Connect - debe ser accesible sin login.
 */
export default function Support() {
  return (
    <div className="support-page">
      <div className="support-container">
        <h1>Soporte - Nexpo</h1>
        <p className="support-intro">
          ¿Necesitás ayuda con la app Nexpo? Estamos aquí para asistirte.
        </p>

        <section className="support-section">
          <h2>Contacto</h2>
          <p>
            Para consultas, reportar problemas o solicitar asistencia, podés
            contactarnos por:
          </p>
          <ul>
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:soporte@nexpo.uy">soporte@nexpo.uy</a>
            </li>
            <li>
              <strong>Web:</strong>{" "}
              <a href="https://www.nexpo.uy" target="_blank" rel="noopener noreferrer">
                www.nexpo.uy
              </a>
            </li>
          </ul>
        </section>

        <section className="support-section">
          <h2>Preguntas frecuentes</h2>
          <dl>
            <dt>¿Cómo creo una cuenta?</dt>
            <dd>
              Abrí la app Nexpo, tocá "Registrarse" e ingresá tu nombre, email y
              contraseña.
            </dd>

            <dt>¿Olvidé mi contraseña?</dt>
            <dd>
              Contactanos por email a soporte@nexpo.uy con el correo de tu cuenta
              y te ayudaremos a recuperar el acceso.
            </dd>

            <dt>¿Cómo elimino mi cuenta?</dt>
            <dd>
              En la app, andá a Perfil → Eliminar cuenta. La eliminación es
              permanente.
            </dd>
          </dl>
        </section>

        <p className="support-footer">
          © {new Date().getFullYear()} Nexpo. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
