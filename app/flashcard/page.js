import React from "react";
import { Container, Box, Typography } from "@mui/material";
// This component uses Clerk’s `useUser` hook for authentication, React’s `useState`
// for managing the flashcardsand their flip states
// and Next.js’s `useSearchParams` to get the flashcard set ID from the URL
export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // useEffect` hook helps to fetch the specific flashcard set when the component mounts
  // or when the user or search parameter changes
  useEffect(() => {
    // This function retrieves all flashcards in the specified set from Firestore and updates the `flashcards` state.
    async function getFlashcard() {
      if (!search || !user) return;

      const colRef = collection(doc(collection(db, "users"), user.id), search);
      const docs = await getDocs(colRef);
      const flashcards = [];
      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(flashcards);
    }
    getFlashcard();
  }, [search, user]);

  // The component renders a grid of flashcards.
  // Each flashcard is displayed as a card that flips when clicked, revealing the back of the card.
  // The flip animation is achieved using CSS transforms and transitions.
  return (
    <Container maxWidth="md">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard) => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                <CardContent>
                  <Box
                    sx={
                      {
                        /* Styling for flip animation */
                      }
                    }
                  >
                    <div>
                      <div>
                        <Typography variant="h5" component="div">
                          {flashcard.front}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="h5" component="div">
                          {flashcard.back}
                        </Typography>
                      </div>
                    </div>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
