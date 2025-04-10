const Footer = function(){
     
    return(
        <footer className="footer">
        <div className="container-fluid">
            <div className="row text-muted">
                <div className="col-6 text-start">
                    <p className="mb-0">
                        <a className="text-muted" href="https://adminkit.io/" target="_blank"><strong>AdminKit</strong></a> - <a className="text-muted" href="https://adminkit.io/" target="_blank"><strong>Bootstrap Admin Template</strong></a>								&copy;
                    </p>
                </div>
                <div className="col-6 text-end">
                    <ul className="list-inline">
                        <li className="list-inline-item">
                            <a className="text-muted" href="https://adminkit.io/" target="_blank" rel="noreferrer noopener" >Support</a>
                        </li>
                        <li className="list-inline-item">
                            <a className="text-muted" href="https://adminkit.io/" target="_blank" rel="noreferrer noopener">Help Center</a>
                        </li>
                        <li className="list-inline-item">
                            <a className="text-muted" href="https://adminkit.io/" target="_blank" rel="noreferrer noopener">Privacy</a>
                        </li>
                        <li className="list-inline-item">
                            <a className="text-muted" href="https://adminkit.io/" target="_blank" rel="noreferrer noopener">Terms</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </footer> 
    )
}

export default Footer;