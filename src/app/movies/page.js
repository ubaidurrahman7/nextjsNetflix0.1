"use client";

import Layout from "@/components/Layout";
import CircleLoader from "@/components/circle-loader";
import ManageAccounts from "@/components/manage-accounts";
import Unauthpage from "@/components/unauth-page";
import { GlobalContext } from "@/context";
import { getAllfavorites, getTVorMoviesByGenre } from "@/utils";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";

export default function Movies() {
  const {
    loggedInAccount,
    mediaData,
    setMediaData,
    setPageLoader,
    pageLoader,
  } = useContext(GlobalContext);
  const { data: session } = useSession();

  useEffect(() => {
    async function getAllMedias() {
      const action = await getTVorMoviesByGenre("movie", 28);
      const adventure = await getTVorMoviesByGenre("movie", 12);
      const crime = await getTVorMoviesByGenre("movie", 80);
      const comedy = await getTVorMoviesByGenre("movie", 35);
      const family = await getTVorMoviesByGenre("movie", 10751);
      const mystery = await getTVorMoviesByGenre("movie", 9648);
      const romance = await getTVorMoviesByGenre("movie", 10749);
      const scifiAndFantasy = await getTVorMoviesByGenre("movie", 878);
      const war = await getTVorMoviesByGenre("movie", 10752);
      const history = await getTVorMoviesByGenre("movie", 36);
      const drama = await getTVorMoviesByGenre("movie", 18);
      const thriller = await getTVorMoviesByGenre("movie", 53);
      const horror = await getTVorMoviesByGenre("movie", 27);
      const allFavorites = await getAllfavorites(
        session?.user?.uid,
        loggedInAccount?._id
      );
      setMediaData([
        ...[
          {
            title: "Action",
            medias: action,
          },
          {
            title: "Adventure",
            medias: adventure,
          },
          {
            title: "Crime",
            medias: crime,
          },
          {
            title: "Comedy",
            medias: comedy,
          },
          {
            title: "Family",
            medias: family,
          },
          {
            title: "Mystery",
            medias: mystery,
          },
          {
            title: "Romance",
            medias: romance,
          },
          {
            title: "Scifi and Fantasy",
            medias: scifiAndFantasy,
          },
          {
            title: "War",
            medias: war,
          },
          {
            title: "History",
            medias: history,
          },
          {
            title: "Drama",
            medias: drama,
          },
          {
            title: "Thriller",
            medias: thriller,
          },
          {
            title: "Horror",
            medias: horror,
          },
        ].map((item) => ({
          ...item,
          medias: (item.medias || []).map((mediaItem) => ({
            ...mediaItem,
            type: "movie",
            addedToFavorites:
              allFavorites && allFavorites.length
                ? allFavorites.map((fav) => fav.movieID).indexOf(mediaItem.id) >
                  -1
                : false,
          })),
        })),
      ]);
      setPageLoader(false);
    }
    getAllMedias();
  }, [loggedInAccount]);

  if (session === null) return <Unauthpage />;
  if (loggedInAccount === null) return <ManageAccounts />;

  if (pageLoader) return <CircleLoader />;
  return (
    <main className="flex min-h-screen flex-col">
      <Layout mediaData={mediaData} />
    </main>
  );
}
