import React from 'react'

const Offersect = () => {
    return (
        <>
            <section>
                <div className="container">
                    <h2 className="section-title">Special offer of this week</h2>
                    <div className="offer-container">
                        <h3 className="offer-title">Save using delivery without connecting the routine</h3>
                        <div className="countdown">
                            <div className="countdown-item">
                                <div className="countdown-number">04</div>
                                <div className="countdown-label">Days</div>
                            </div>
                            <div className="countdown-item">
                                <div className="countdown-number">12</div>
                                <div className="countdown-label">Hours</div>
                            </div>
                            <div className="countdown-item">
                                <div className="countdown-number">23</div>
                                <div className="countdown-label">Minutes</div>
                            </div>
                            <div className="countdown-item">
                                <div className="countdown-number">06</div>
                                <div className="countdown-label">Seconds</div>
                            </div>
                        </div>
                        <ul className="offer-list">
                            <li><i className="fas fa-check-circle"></i> Enjoy the special offer up to 40% with Wuxwell</li>
                            <li><i className="fas fa-check-circle"></i> Enjoy the special offer up to 30% with Wuxwell</li>
                            <li><i className="fas fa-check-circle"></i> Enjoy the special offer up to 40% with Wuxwell</li>
                        </ul>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Offersect