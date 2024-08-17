import { useState, useSearchParams, useRouter } from "react";
import { Typography, Box, Container, CircularProgress } from "@mui/material";
// This section sets up the component, initializing state variables for loading, session data, and potential errors.
//  It also extracts the `session_id` from the URL parameters.
const ResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  // fetch the checkout session data from our API when the component mounts or when the `session_id` changes.
  // It updates the component’s state based on the API response.
  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!session_id) return;
      try {
        const res = await fetch(
          `/api/checkout_sessions?session_id=${session_id}`
        );
        const sessionData = await res.json();
        if (res.ok) {
          setSession(sessionData);
        } else {
          setError(sessionData.error);
        }
      } catch (err) {
        setError("An error occurred while retrieving the session.");
      } finally {
        setLoading(false);
      }
    };
    fetchCheckoutSession();
  }, [session_id]);
  // While the session data is being fetched, a loading indicator is displayed to the user.
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Container>
    );
  }
  if (error) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
      {session.payment_status === "paid" ? (
        <>
          <Typography variant="h4">Thank you for your purchase!</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Session ID: {session_id}</Typography>
            <Typography variant="body1">
              We have received your payment. You will receive an email with the
              order details shortly.
            </Typography>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h4">Payment failed</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              Your payment was not successful. Please try again.
            </Typography>
          </Box>
        </>
      )}
    </Container>
  );
};
