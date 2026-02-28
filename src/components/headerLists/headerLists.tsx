import './style.css';

type HeaderProps = {
    title: string,
    showOptions?: boolean,
}

function HeaderLists({ title, showOptions }: HeaderProps) {
    return (
        <div className='header-lists'>
            <div className='container-header-lists-left'>
                <div>

                </div>
                <h3>{title}</h3>
            </div>
            {showOptions && (
                <div className='container-header-lists-right'>
                    <div className='container-header-right-value'>
                        <span>40/100</span>
                        <span>Entradas vendidas</span>
                    </div>

                    <div className='container-header-right-value'>
                        <span>$100</span>
                        <span>Dinero generado</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HeaderLists
