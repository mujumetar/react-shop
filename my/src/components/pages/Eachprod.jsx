import React from 'react'
import white from "../../img/white.jpeg"
import black from "../../img/black.jpeg"

const Eachprod = () => {
    return (
        <>
            <div className="container my-5 shadow text-start">
                <h2 className="section-title ">
                    white sani
                </h2>
                <div
                    class="row justify-content-center align-items-center g-2"
                >

                    <div class="col-lg-6 col-md-12  d-flex justify-content-center align-items-center p-2">
                        <img src={white} alt="" className='img-fluid' />
                    </div>



                    <div class="col-lg-6 col-md-12 border h-100">
                        <p>saani</p>
                        <select name="varient" id="">
                            <option value="dryfruit">white dryfruit</option>
                            <option value="nulll">white plain</option>
                        </select>

                    </div>


                </div>

            </div>



        </>
    )
}

export default Eachprod