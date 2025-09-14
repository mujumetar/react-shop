import React from 'react'

const Gallery = () => {
    return (
    <>

            <section className="hero-section">
                <h1>Creative visual experience</h1>
                <div className="mini-gallery animation-init">
                    <picture>
                        <img src="https://images.unsplash.com/photo-1637088660675-6930e63e51a7?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="image"/>
                    </picture>
                    <picture>
                        <img src="https://images.unsplash.com/photo-1655400108350-80022d39d06d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="image"/>
                    </picture>
                    <picture>
                        <img src="https://plus.unsplash.com/premium_photo-1706727289730-cffaa60fd29e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="image"/>
                    </picture>
                    <picture>
                        <img src="https://plus.unsplash.com/premium_photo-1747852228961-37e4705335d0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="image"/>
                    </picture>
                    <picture>
                        <img src="https://plus.unsplash.com/premium_photo-1696959082289-bb0266dfd241?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="image"/>
                    </picture>
                    <picture>
                        <img src="https://plus.unsplash.com/premium_photo-1678935941799-7e69cac90719?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="image"/>
                    </picture>
                    <picture>
                        <img src="https://plus.unsplash.com/premium_photo-1678937611513-720220f9105e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="image"/>
                    </picture>
                    <picture>
                        <img src="https://plus.unsplash.com/premium_photo-1747851578327-11ae3ca0b189?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="image"/>
                    </picture>
                </div>
                <div className="double-image">
                    <div className="double-image-item">
                        <picture>
                            <img src="https://images.unsplash.com/photo-1637088660675-6930e63e51a7?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="image"/>
                                <img src="https://images.unsplash.com/photo-1655400108350-80022d39d06d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="image" className="top-move"/>
                                </picture>
                            </div>
                            <div className="double-image-item">
                                <picture>
                                    <img src="https://plus.unsplash.com/premium_photo-1706727289730-cffaa60fd29e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="image"/>
                                        <img src="https://plus.unsplash.com/premium_photo-1747852228961-37e4705335d0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="image" className="bottom-move"/>
                                        </picture>
                                    </div>
                            </div>
                        </section>
                        <section className="about-section">
                            <div className="about-section-content">
                                <h2>Visual creativity redefined through stunning imagery.</h2>
                            </div>
                        </section>
                    </>
                    )
}

                    export default Gallery