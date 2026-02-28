import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.css';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

type HeaderProps = {
    title: string
    buttonTitle?: string
    actionCancelButton?: () => void
    actionSaveButton?: () => void
}

function HeaderPopupFullPage({ title, buttonTitle, actionSaveButton, actionCancelButton }: HeaderProps) {
    return (
        <div className='container-header-popup-full-page'>
            <button className='button-close' onClick={actionCancelButton}>
                <FontAwesomeIcon icon={faXmark} />
            </button>
            <div className='container-title-header'>
                <h3>{title}</h3>
            </div>
            {actionSaveButton != null && buttonTitle != null ? (
                <button className='button-save' onClick={actionSaveButton}>
                    {buttonTitle}
                </button>
            ) : null}
        </div>
    )
}

export default HeaderPopupFullPage
