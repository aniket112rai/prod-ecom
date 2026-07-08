import crypto from "crypto";
import Razorpay from "razorpay";

const getRazorpayConfig = () => {
  const keyId = process.env.RAZORPAY_API_KEY ;
  const keySecret = process.env.RAZORPAY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured");
  }

  return { keyId, keySecret };
};

export const getRazorpayKeyId = () => getRazorpayConfig().keyId;

export const getRazorpayInstance = () => {
  const { keyId, keySecret } = getRazorpayConfig();

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

export const verifyRazorpaySignature = ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  const { keySecret } = getRazorpayConfig();
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");

  return expectedSignature === razorpaySignature;
};

export const refundRazorpayPayment = async ({ paymentId, amount }) => {
  const razorpay = getRazorpayInstance();

  return razorpay.payments.refund(paymentId, {
    amount: Math.round(Number(amount) * 100),
    speed: "normal",
  });
};
