import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripePackage from "stripe";
import User from "../models/User.js";

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    
    if (!address || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Address and items are required" 
      });
    }

    // Calculate Amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: `Product ${item.product} not found` 
        });
      }
      amount += product.offerPrice * item.quantity;
    }

    // Add Tax (2%)
    const tax = Math.floor(amount * 0.02);
    amount += tax;

    // Create Order
    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
      status: "Placed",
      isPaid: false
    });

    // Clear user's cart (if needed)
    await User.findByIdAndUpdate(userId, { $set: { cartItems: [] } });

    return res.status(201).json({ 
      success: true, 
      message: "COD Order Placed Successfully",
      order 
    });

  } catch (error) {
    console.error("COD Order Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: error.message 
    });
  }
};

// Place Order Stripe : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const { origin } = req.headers;

    if (!address || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Address and items are required" 
      });
    }

    // Calculate Amount
    let amount = 0;
    const productData = [];
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: `Product ${item.product} not found` 
        });
      }
      amount += product.offerPrice * item.quantity;
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
    }

    // Add Tax (2%)
    const tax = Math.floor(amount * 0.02);
    amount += tax;

    if (amount < 50) {
      return res.status(400).json({
        success: false,
        message: "Minimum order amount must be at least ₹50 for online payments.",
      });
    }

    // Create Order
    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
      status: "Placed",
      isPaid: false
    });

    // Create Stripe Line Items
    const line_items = [
      ...productData.map(item => ({
        price_data: {
          currency: "inr",
          product_data: { name: item.name },
          unit_amount: Math.floor(item.price * 100), // in paise
        },
        quantity: item.quantity,
      })),
      {
        price_data: {
          currency: "inr",
          product_data: { name: "Tax (2%)" },
          unit_amount: tax * 100,
        },
        quantity: 1,
      }
    ];

    // Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: "payment",
      success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
    });

    return res.json({ 
      success: true, 
      url: session.url,
      sessionId: session.id 
    });

  } catch (error) {
    console.error("Stripe Order Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error processing payment",
      error: error.message 
    });
  }
};

// Stripe Webhook : /api/order/webhook
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      // Verify payment was successful
      if (session.payment_status !== 'paid') {
        throw new Error('Payment not completed');
      }

      // Update Order
      const order = await Order.findByIdAndUpdate(
        session.metadata.orderId,
        { 
          isPaid: true,
          status: 'Placed',
          paymentId: session.payment_intent
        },
        { new: true }
      );

      if (!order) {
        throw new Error(`Order ${session.metadata.orderId} not found`);
      }

      // Clear User's Cart
      await User.findByIdAndUpdate(
        session.metadata.userId,
        { $set: { cartItems: [] } }
      );

      console.log(`Order ${order._id} payment confirmed`);

    } catch (err) {
      console.error(`Webhook Processing Error: ${err.message}`);
      return res.status(400).json({ error: err.message });
    }
  }

  res.json({ received: true });
};

// Get User Orders : /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const orders = await Order.find({ userId })
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 });

    return res.json({ 
      success: true, 
      orders 
    });

  } catch (error) {
    console.error("Get User Orders Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error fetching orders",
      error: error.message 
    });
  }
};

// Get All Orders (Admin) : /api/order/all
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product")
      .populate("address")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.json({ 
      success: true, 
      orders 
    });

  } catch (error) {
    console.error("Get All Orders Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error fetching orders",
      error: error.message 
    });
  }
};

// Update Order Status : /api/order/status/:orderId
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    )
    .populate("items.product")
    .populate("address");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // If order is delivered, mark as paid if COD
    if (status === "Delivered" && order.paymentType === "COD") {
      order.isPaid = true;
      await order.save();
    }

    return res.json({
      success: true,
      message: "Order status updated",
      order
    });

  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message
    });
  }
};

// Cancel Order (User) : /api/order/cancel/user/:orderId
export const cancelOrderByUser = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.body;

    const order = await Order.findOne({ 
      _id: orderId, 
      userId 
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or not authorized"
      });
    }

    if (!["Placed", "Processing"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status ${order.status}`
      });
    }

    order.status = "Cancelled";
    await order.save();

    return res.json({
      success: true,
      message: "Order cancelled successfully",
      order
    });

  } catch (error) {
    console.error("Cancel Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message
    });
  }
};

// Cancel Order (Admin) : /api/order/cancel/admin/:orderId
export const cancelOrderByAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel delivered order"
      });
    }

    order.status = "Cancelled";
    await order.save();

    return res.json({
      success: true,
      message: "Order cancelled by admin",
      order
    });

  } catch (error) {
    console.error("Admin Cancel Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message
    });
  }
};

// Verify Stripe Session : /api/order/verify-session
export const verifyStripeSession = async (req, res) => {
  try {
    const { session_id } = req.query;

    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        message: 'Session not found' 
      });
    }

    if (session.payment_status === 'paid') {
      // Verify order exists and is paid
      const order = await Order.findOne({ 
        _id: session.metadata.orderId,
        isPaid: true
      });

      if (!order) {
        return res.status(404).json({ 
          success: false, 
          message: 'Order not found or not paid' 
        });
      }

      return res.json({ 
        success: true,
        orderId: order._id
      });
    }

    return res.json({ 
      success: false, 
      message: 'Payment not completed' 
    });

  } catch (error) {
    console.error('Session Verification Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error verifying session',
      error: error.message 
    });
  }
};