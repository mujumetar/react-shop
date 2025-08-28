import React from 'react'

const Navbars = () => {
    return (
        <>
            <header>
                <div className="container">
                    <nav className="navbar navbar-expand-lg navbar-dark">
                        <div className="container-fluid">
                            <a className="navbar-brand logo" href="#">
                                <i className="fas fa-shopping-basket"></i>
                                Dilkhush
                            </a>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav ms-auto">
                                    <li className="nav-item">
                                        <a className="nav-link active" href="#">Home</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Products</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/offers.html">Offers</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/Benefits.html">Benefits</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Contact</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>


        </>
    )
}

export default Navbars