import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const placeOrder = async () => {
    setLoading(true);
    const orderData = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com', // Replace with a real email
      customerAddress: '123 Main St',
      products: [{ productId: '68bd5526169aa18b3a04d6a9', quantity: 1 }],
    };
    console.log('Sending order data:', orderData);

    try {
      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.status} - ${responseData.error || response.statusText}`);
      }

      const options = responseData;

      const rzp = new window.Razorpay({
        key: options.key,
        order_id: options.orderId,
        amount: options.amount,
        currency: options.currency,
        name: options.name,
        description: options.description,
        prefill: options.prefill,
        theme: options.theme,
        handler: async function (response) {
          try {
            const verifyResponse = await fetch('http://localhost:3000/payment-verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: options.notes.orderId,
              }),
            });

            const verifyData = await verifyResponse.json();
            console.log('Verification response:', verifyData);
            if (verifyData.message === 'Payment successful') {
              navigate('/success');
            } else {
              alert('Payment verification failed: ' + verifyData.error);
              navigate('/cancel');
            }
          } catch (error) {
            alert('Error verifying payment: ' + error.message);
            navigate('/cancel');
          }
        },
      });

      rzp.on('payment.failed', function (response) {
        alert('Payment failed: ' + response.error.description);
        navigate('/cancel');
      });

      rzp.open();
    } catch (error) {
      console.error('Error:', error);
      alert('Error placing order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <button onClick={placeOrder} disabled={loading}>
        {loading ? 'Processing...' : 'Pay with Razorpay'}
      </button>
    </div>
  );
};

export default Checkout;