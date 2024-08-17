import { NextResponse } from "next/server";
import Stripe from "stripe"; // Stripe.js is a JS library that allows to easily integrate Stripe payment processing into their Next. js applications.

const formatAmountForStripe = (amount, currency) => {
  return Math.round(amount * 100);
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// Basic structure for our POST request handler.
export async function POST(req) {
  try {
    // Params contain information for checkout session
    const params = {
      mode: "subscription", // `mode` is set to ‘subscription’ for recurring payments
      payment_method_types: ["card"], // only accept card payments
      line_items: [
        // a single line item for the Pro subscription, priced at $10 per month.
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Pro subscription",
            },
            unit_amount: formatAmountForStripe(10, "usd"), // $10.00
            recurring: {
              interval: "month",
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ], // success and cancel URLs, which will be used to redirect the user after the payment process.
      success_url: `${req.headers.get(
        "Referer"
      )}result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get(
        "Referer"
      )}result?session_id={CHECKOUT_SESSION_ID}`,
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);

    return NextResponse.json(checkoutSession, {
      status: 200,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new NextResponse(
      JSON.stringify({ error: { message: error.message } }),
      {
        status: 500,
      }
    );
  }
}

// GET route for retrieving session details
export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const session_id = searchParams.get("session_id"); // extract the `session_id` from the query parameters of the request

  try {
    if (!session_id) {
      throw new Error("Session ID is required");
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id); // use the Stripe API to retrieve the checkout session details

    return NextResponse.json(checkoutSession); // return the session details as a JSON response
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}
