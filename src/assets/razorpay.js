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

export const startPayment = async (
    amount,
    { interestId = null, assetId = null, quantity = null, reservationId = null, buyerName = "User", buyerEmail = "" } = {},
    onSuccess = null,
    onFailure = null
) => {
    try {
        const { data: order } = await api.post('/payment/create-order', {
            amount,
            interestId,
            assetId,
            quantity,
            reservationId
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
                    // response contains: razorpay_payment_id, razorpay_order_id, razorpay_signature
                    const { data: result } = await api.post('/payment/verify', {
                        ...response,
                        interestId,
                        assetId,
                        quantity,
                        reservationId
                    });

                    if (result.success) {
                        if (onSuccess) {
                            onSuccess(result);
                        } else {
                            // Minimal fallback if no callback provided
                            alert("Payment Successful!");
                        }
                    } else {
                        const errorMsg = result.message || "Payment Verification Failed.";
                        alert(errorMsg);
                        if (onFailure) onFailure(errorMsg);
                    }
                } catch (error) {
                    console.error("Verification Error:", error);
                    const errorMsg = error.response?.data?.message || "An error occurred during payment verification.";
                    alert(errorMsg);
                    if (onFailure) onFailure(errorMsg);
                }
            },
            modal: {
                ondismiss: function () {
                    console.log("Checkout form closed");
                    if (onFailure) onFailure("Payment Cancelled");
                }
            },
            prefill: {
                name: buyerName,
                email: buyerEmail,
            },
            theme: {
                color: "#10b981", 
            }
        };

        if (!window.Razorpay) {
            throw new Error("Razorpay SDK not loaded. Please refresh the page.");
        }

        const rzp = new window.Razorpay(options);
        rzp.open();
    } catch (error) {
        console.error("Payment Error:", error);
        const errorMsg = error.response?.data?.message || error.message || "Failed to initiate payment. Please try again.";
        alert(errorMsg);
        if (onFailure) onFailure(errorMsg);
    }
};

export const startAgentPayment = async (
    paymentOrder,
    { buyerName = "User", buyerEmail = "" } = {},
    onSuccess = null,
    onFailure = null
) => {
    try {
        if (!paymentOrder?.razorpayOrderId) {
            throw new Error("Missing agent payment order details.");
        }

        const options = {
            key: paymentOrder.keyId || import.meta.env.VITE_RAZORPAY_KEY,
            amount: paymentOrder.amountPaise || Math.round(Number(paymentOrder.amount || 0) * 100),
            currency: paymentOrder.currency || "INR",
            name: "TrustTrade",
            description: "Strategic Agent Checkout",
            order_id: paymentOrder.razorpayOrderId,
            handler: (response) => {
                // response contains: razorpay_payment_id, razorpay_order_id, razorpay_signature
                if (onSuccess) {
                    onSuccess(response);
                }
            },
            modal: {
                ondismiss: function () {
                    if (onFailure) onFailure("Payment Cancelled");
                }
            },
            prefill: {
                name: buyerName,
                email: buyerEmail,
            },
            theme: {
                color: "#10b981",
            }
        };

        if (!window.Razorpay) {
            throw new Error("Razorpay SDK not loaded.");
        }

        const rzp = new window.Razorpay(options);
        rzp.open();
    } catch (error) {
        console.error("Agent Payment Error:", error);
        alert(error.message || "Failed to initiate agent payment.");
        if (onFailure) onFailure(error);
    }
};

