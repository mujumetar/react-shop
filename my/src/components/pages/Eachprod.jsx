import React, { useState } from "react";
import white from "../../img/white.jpeg";
import contains from "../../img/contains.png"
import black from "../../img/black.jpeg";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Eachprod = ({ selectedProduct, setSelectedProduct }) => {
    const [quantity, setQuantity] = useState(1);
    const [coupon, setCoupon] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const navigate = useNavigate()
    const [address, setAddress] = useState({
        pincode: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        phone: "",
        email: "",
    });

    const deliveryCharge = 40;
    let isFirstOrder = true;

    const imageMap = { white, black };

    if (!selectedProduct) return null;

    const productTotal = (selectedProduct.price || 0) * quantity;

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    let discount = 0;
    if (isFirstOrder) {
        discount = productTotal * 0.2;
    } else if (appliedCoupon === "FIRST20") {
        discount = productTotal * 0.2;
    }

    const grandTotal = productTotal + deliveryCharge - discount;

    const applyCoupon = () => {
        if (coupon.trim().toUpperCase() === "FIRST20") {
            setAppliedCoupon("FIRST20");
        } else {
            setAppliedCoupon("INVALID");
        }
    };

    const sendToWhatsApp = () => {
        // Collect order details from state
        const orderDetails = `
            *New Order Received! 📦*

            *Product*: ${selectedProduct.name}
            *Variant*: ${selectedProduct.varient}
            *Quantity*: ${quantity} KG
            *Unit Price*: ₹ ${selectedProduct.price}
            *Delivery Charges*: ₹ ${deliveryCharge}
            *Discount*: ₹ ${discount.toFixed(2)}
            *Grand Total*: *₹ ${grandTotal.toFixed(2)}*

            *Delivery Info:*
            *Pincode*: ${address.pincode}
            *Address*: ${address.address1}, ${address.address2}
            *City*: ${address.city}, State: ${address.state}
            *Phone*: ${address.phone}
            *Email*: ${address.email || "N/A"}
                `;


        const adminNumber = "+917874536227";
        const url = `https://wa.me/${adminNumber}?text=${encodeURIComponent(orderDetails)}`;


        window.open(url, "_blank");
    };


    return (
        <>
            {/* Product Modal */}
            <div
                className="modal modal-fullscreen fade border-2 show"
                id="productModal"
                data-bs-backdrop="false"
                tabIndex="-1"
                aria-hidden="true"
                style={{ display: "block" }}
            >
                <div className="modal-dialog modal-fullscreen">

                    <div className="modal-content">
                        <div className="modal-header">

                            <h5 className="modal-title">{selectedProduct.name}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => setSelectedProduct(null)}
                            ></button>
                        </div>

                        <div className="modal-body">
                            <div className="row g-3">
                                {/* Image */}
                                <div className="col-lg-6 col-md-12 d-flex justify-content-center align-items-center">
                                    <div className="zoom-container">
                                        <img
                                            src={imageMap[selectedProduct.img_url] || white}
                                            alt={selectedProduct.name}
                                            className="img-fluid zoom-image"
                                        />
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="col-lg-6 col-md-12">
                                    <p className="fw-bold">Price: ₹ {selectedProduct.price}</p>
                                    <p className="p-0 my-3">
                                        {selectedProduct.description || "No description available"}
                                    </p>

                                    {/* Variant */}
                                    <label>
                                        <b>Choose the Variant</b>
                                    </label>
                                    <select className="form-select my-2">
                                        <option value="default">Choose Variant</option>
                                        <option value="dryfruit">{selectedProduct.varient?.[0]}</option>
                                        <option value="plain">{selectedProduct.varient?.[1]}</option>
                                    </select>

                                    {/* Quantity */}
                                    <label>
                                        <b>Enter Quantity in KG</b>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="form-control my-2"
                                        placeholder="Enter Quantity in KG"
                                    />

                                    {/* Coupon */}
                                    <div className="my-3">
                                        <label>
                                            <b>Have a Coupon?</b>
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Coupon Code"
                                                value={coupon}
                                                onChange={(e) => setCoupon(e.target.value)}
                                            />
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={applyCoupon}
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {appliedCoupon === "FIRST20" && (
                                            <p className="text-success mt-1">
                                                Coupon applied! 20% discount
                                            </p>
                                        )}
                                        {appliedCoupon === "INVALID" && (
                                            <p className="text-danger mt-1">Invalid coupon code</p>
                                        )}
                                    </div>

                                    <div>
                                        <marquee className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background" behavior="" direction="">  <b>25 years of trust</b></marquee>
                                        <marquee behavior="" direction="">   <b>we belive in quality not in quantity</b></marquee>
                                        <p> <b>Latest Products</b>
                                            <br />
                                            {selectedProduct.name} kachariyu/saani


                                            <ul>
                                                <li> No added flavours.</li>
                                                <li> No harmful Chemicals.</li>
                                                <li>Best for winters.</li>
                                                <li> No additional colours.</li>
                                                <li>  100% natural and healthy.</li>
                                                <li> Healthy for everyone ☺️.</li>
                                            </ul>
                                        </p>
                                        <b> It contains</b>
                                        <img className="img-fluid" src={contains} alt="" />

                                        <b>✅ Health Review</b>
                                        <br />
                                        Energy-dense (~474 kcal per 100 g) → great for winters, boosts energy.
                                        <br />
                                        Balanced macros → Carbs from jaggery + healthy fats & protein from sesame.
                                        <br />
                                        Rich in minerals → especially Calcium (good for bones), Iron (blood health), Magnesium, and Potassium.
                                        <br />
                                        Fiber content (6 g/100 g) → supports digestion.
                                        <br />
                                        Antioxidants → Sesamin & sesamolin from sesame + minerals from jaggery.
                                        <br />
                                        <b>🏆 Why This Mixture is Powerful</b>
                                        <br />
                                        Gives instant energy (from jaggery).
                                        <br />
                                        Provides long-lasting satiety & strength (from sesame protein & fats).
                                        <br />
                                        Traditional wisdom = perfect winter superfood 🌿.
                                    </div>
                                    {/* Summary */}
                                    <div className="border rounded p-3 bg-light mt-3">
                                        <h6 className="fw-bold mb-2">Order Summary</h6>
                                        <p className="mb-1">Unit Price: ₹ {selectedProduct.price}</p>
                                        <p className="mb-1">Quantity: {quantity} KG</p>
                                        <p className="mb-1">Product Total: ₹ {productTotal}</p>
                                        <p className="mb-1">Delivery Charges: ₹ {deliveryCharge}</p>
                                        {discount > 0 && (
                                            <p className="mb-1 text-success">
                                                Discount: -₹ {discount.toFixed(2)} (20%)
                                            </p>
                                        )}
                                        <hr />

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="modal-footer">
                            <h5 className="fw-bold">
                                Grand Total: ₹ {grandTotal.toFixed(2)}
                            </h5>

                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => setShowCheckout(true)}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Checkout Modal */}
            {showCheckout && (
                <div
                    className="modal fade show"
                    style={{ display: "block" }}
                    tabIndex="-1"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Delivery Details</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowCheckout(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Pincode</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            className="form-control"
                                            value={address.pincode}
                                            onChange={handleAddressChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-12">
                                        <label className="form-label">Address Line 1</label>
                                        <input
                                            type="text"
                                            name="address1"
                                            className="form-control"
                                            value={address.address1}
                                            onChange={handleAddressChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-12">
                                        <label className="form-label">Address Line 2</label>
                                        <input
                                            type="text"
                                            name="address2"
                                            className="form-control"
                                            value={address.address2}
                                            onChange={handleAddressChange}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            className="form-control"
                                            value={address.city}
                                            onChange={handleAddressChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            className="form-control"
                                            value={address.state}
                                            onChange={handleAddressChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="form-control"
                                            value={address.phone}
                                            onChange={handleAddressChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Email (optional)</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={address.email}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                </form>

                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowCheckout(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        sendToWhatsApp();
                                        // setShowCheckout(false);
                                        // setSelectedProduct(null);
                                        navigate("/order-success");
                                    }}
                                >
                                    Place Order
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Eachprod;
