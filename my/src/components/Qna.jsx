import React from 'react'

const Qna = () => {
    return (
        <>
            <section>
                <div className="container">
                    <div className="accordion accordion-flush shadow" id="accordionFlushExample">
                        <div className="accordion-item ">
                            <h2 className="accordion-header" id="flush-headingOne">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                    why we ?
                                </button>
                            </h2>
                            <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne"
                                data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body">Placeholder content for this accordion, which is intended to
                                    demonstrate
                                    the <code>.accordion-flush</code> className. This is the first item's accordion body.</div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="flush-headingTwo">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                                    What it gives ?
                                </button>
                            </h2>
                            <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo"
                                data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body">Placeholder content for this accordion, which is intended to
                                    demonstrate
                                    the <code>.accordion-flush</code> className. This is the second item's accordion body. Let's
                                    imagine
                                    this being filled with some actual content.</div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="flush-headingThree">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#flush-collapseThree" aria-expanded="false"
                                    aria-controls="flush-collapseThree">
                                    what is the Benefits of kachariya ?
                                </button>
                            </h2>
                            <div id="flush-collapseThree" className="accordion-collapse collapse"
                                aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body">Placeholder content for this accordion, which is intended to
                                    demonstrate
                                    the <code>.accordion-flush</code> className. This is the third item's accordion body. Nothing
                                    more
                                    exciting happening here in terms of content, but just filling up the space to make it look,
                                    at
                                    least at first glance, a bit more representative of how this would look in a real-world
                                    application.</div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="flush-headingThree">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#flush-collapsefour" aria-expanded="false"
                                    aria-controls="flush-collapsefour">
                                    is healthy for everyone ?
                                </button>
                            </h2>
                            <div id="flush-collapsefour" className="accordion-collapse collapse"
                                aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body">Placeholder content for this accordion, which is intended to
                                    demonstrate
                                    the <code>.accordion-flush</code> className. This is the third item's accordion body. Nothing
                                    more
                                    exciting happening here in terms of content, but just filling up the space to make it look,
                                    at
                                    least at first glance, a bit more representative of how this would look in a real-world
                                    application.</div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </>
    )
}

export default Qna