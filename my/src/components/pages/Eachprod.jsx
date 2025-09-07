import React, { useState } from "react";
import white from "../../img/white.jpeg";
import black from "../../img/black.jpeg";
import { useNavigate } from "react-router-dom";

const Eachprod = ({ selectedProduct, setSelectedProduct }) => {
    const [quantity, setQuantity] = useState(1);
    const [coupon, setCoupon] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const navigate = useNavigate()
    const deliveryCharge = 40;
    const isFirstOrder = true;

    const imageMap = { white, black };

    if (!selectedProduct) return null;

    const productTotal = (selectedProduct.price || 0) * quantity;

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

                                    {/* Summary */}
                                    <div className="border rounded p-3 bg-light mt-3">
                                        <h6 className="fw-bold mb-2">Order Summary</h6>
                                        <p className="mb-1">Unit Price: ₹ {selectedProduct.price}</p>
                                        <p className="mb-1">Quantity: {quantity} KG</p>
                                        <p className="mb-1">Product Total: ₹ {productTotal}</p>
                                        <p className="mb-1">Delivery Charges: ₹ {deliveryCharge}</p>
                                        {discount > 0 && (
                                            <p className="mb-1 text-success">
                                                Discount: -₹ {discount.toFixed(2)}
                                            </p>
                                        )}
                                        <hr />
                                        <h5 className="fw-bold">
                                            Grand Total: ₹ {grandTotal.toFixed(2)}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={() => setSelectedProduct(null)}
                            >
                                Close
                            </button>
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
                                        <input type="text" className="form-control" required />
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label">Address Line 1</label>
                                        <input type="text" className="form-control" required />
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label">Address Line 2</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">City</label>
                                        <input type="text" className="form-control" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">State</label>
                                        <input type="text" className="form-control" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Phone Number</label>
                                        <input type="tel" className="form-control" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email (optional)</label>
                                        <input type="email" className="form-control" />
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
                                        setShowCheckout(false);
                                        setSelectedProduct(null);
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
