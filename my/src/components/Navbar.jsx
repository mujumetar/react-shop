import React from 'react'
import logo from "../img/logo2.jpg"
import { Link } from 'react-router-dom'


const Navbars = () => {
    return (
        <>
            <header className='py-0'>
                <div className="container">
                    <nav className="navbar navbar-expand-lg navbar-light">
                        <div className="container-fluid">
                            <a className="navbar-brand logo" >
                                <i className="fas fa-shopping-basket"></i>
                                <img src={logo} className='img-fluid' style={{ width: '6rem' }} alt="" />
                            </a>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav ms-auto">
                                    <li className="nav-item">
                                        <Link className="nav-link active" to='/'>Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/Products"  >Products</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/about">About</Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link className="nav-link" to="/offers" >Offers</Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link className="nav-link" to="/contact" >Contact</Link>
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