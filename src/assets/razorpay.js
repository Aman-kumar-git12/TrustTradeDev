import api from '../utils/api';

export const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export const startPayment = async (amount, { interestId = null, assetId = null, quantity = null } = {}, onSuccess = null, onFailure = null) => {
    try {
        const { data: order } = await api.post('/payment/create-order', {
            amount,
            interestId,
            assetId,
            quantity
        });

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            amount: order.amount,
            currency: "INR",
            name: "TrustTrade",
            description: "Asset Purchase Payment",
            order_id: order.id,

            handler: async (response) => {
                try {
                    const { data: result } = await api.post('/payment/verify', {
                        ...response,
                        interestId,
                        assetId,
                        quantity
                    });
                    if (result.success) {
                        if (onSuccess) {
                            onSuccess(result);
                        } else {
                            alert("Payment Successful!");
                            window.location.href = "/home"; // Redirect on success
                        }
                    } else {
                        alert("Payment Verification Failed. Please contact support.");
                        if (onFailure) onFailure("Verification Failed");
                    }
                } catch (error) {
                    console.error("Verification Error:", error);
                    alert("An error occurred during payment verification.");
                    if (onFailure) onFailure(error);
                }
            },
            modal: {
                ondismiss: function () {
                    console.log("Checkout form closed");
                    if (onFailure) onFailure("Payment Cancelled");
                }
            },
            prefill: {
                name: "User Name", // Ideally get from AuthContext
                email: "user@example.com",
            },
            theme: {
                color: "#10b981", // Emerald Green to match Dark Mode
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    } catch (error) {
        console.error("Payment Error:", error);
        alert(error.message || "Failed to initiate payment. Please try again.");
        if (onFailure) onFailure(error);
    }
};
