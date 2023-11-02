"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  PlusIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { GlobalContext } from "@/context";
import { useSession } from "next-auth/react";
import { getAllfavorites } from "@/utils";

const baseUrl = "https://image.tmdb.org/t/p/w500";

export default function MediaItem({
  media,
  searchView = false,
  similarMediaView = false,
  listView = false,
  title,
}) {
  const pathName = usePathname();
  const router = useRouter();
  const {
    setShowDetailsPopup,
    setCurrentMediaInfoIdAndType,
    setFavorites,
    loggedInAccount,
    similarMedias,
    searchResults,
    setSearchResults,
    setSimilarMedias,
    mediaData,
    setMediaData,
  } = useContext(GlobalContext);

  const { data: session } = useSession();

  async function updateFavorites() {
    const res = await getAllfavorites(session?.user?.uid, loggedInAccount?._id);
    if (res)
      setFavorites(res.map((item) => ({ ...item, addedToFavorites: true })));
  }

  async function handleAddToFav(item) {
    const { backdrop_path, poster_path, id, type } = item;
    const res = await fetch("/api/favorites/add-favorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        backdrop_path,
        poster_path,
        movieID: id,
        type,
        uid: session?.user?.uid,
        accountID: loggedInAccount._id,
      }),
    });

    const data = await res.json();

    if (data && data.success) {
      if (pathName.includes("my-list")) updateFavorites();
      if (searchView) {
        let updatedSearchResults = [...searchResults];
        const indexOfCurrentAddedMedia = updatedSearchResults.findIndex(
          (item) => item.id === id
        );
        updatedSearchResults[indexOfCurrentAddedMedia] = {
          ...updatedSearchResults[indexOfCurrentAddedMedia],
          addedToFavorites: true,
        };

        setSearchResults(updatedSearchResults);
      } else if (similarMediaView) {
        let updatedSimilarMedias = [...similarMedias];
        const indexOfCurrentAddedMedia = updatedSimilarMedias.findIndex(
          (item) => item.id === id
        );
        updatedSimilarMedias[indexOfCurrentAddedMedia] = {
          ...updatedSimilarMedias[indexOfCurrentAddedMedia],
          addedToFavorites: true,
        };

        setSimilarMedias(updatedSimilarMedias);
      } else {
        let updatedMediaData = [...mediaData];

        const findIndexOfRowItem = updatedMediaData.findIndex(
          (item) => item.title === title
        );
        let currentMediArrayFromRowItem =
          updatedMediaData[findIndexOfRowItem].medias;

        const findIndexOfCurrentMedia = currentMediArrayFromRowItem.findIndex(
          (item) => item.id === id
        );

        currentMediArrayFromRowItem[findIndexOfCurrentMedia] = {
          ...currentMediArrayFromRowItem[findIndexOfCurrentMedia],
          addedToFavorites: true,
        };
        setMediaData(updatedMediaData);
      }
    }
  }

  async function handleRemoveFav(item) {
    const res = await fetch(`/api/favorites/remove-favorite?id=${item._id}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (data.success) updateFavorites();
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.02],
      }}
      style={{ position: "relative" }}
    >
      <div
        className="relative cardWrapper h-28 md:h-32 min-w-[180px]
       cursor-pointer md:min-w-[260px] transform transition
        duration-500 hover:scale-110 hover:z-[999]"
      >
        <Image
          src={`${baseUrl}${media?.backdrop_path || media?.poster_path}`}
          alt="Media"
          layout="fill"
          className="rounded-sm object-cover md:rounded hover:rounded-sm"
          onClick={() => {
            if (media?.type && media?.id) {
              const formattedType = media.type.trim();
              const formattedId = media.id.toString().trim();
              router.push(
                `/watch/${formattedType}/${
                  listView ? media.movieID : formattedId
                }`
              );
            }
          }}
        />
        <div className="space-x-3 hidden absolute p-2 bottom-0 buttonWrapper">
          <button
            onClick={() => {
              if (media?.addedToFavorites) {
                if (listView) {
                  handleRemoveFav(media);
                }
              } else {
                handleAddToFav(media);
              }
            }}
            className={`${
              !listView && media?.addedToFavorites ? "cursor-not-allowed" : ""
            } cursor-pointer border flex p-2 items-center gap-x-2 rounded-full text-sm font-semibold transition hover:opacity-90 border-white bg-black opacity-75 text-black relative`}
          >
            {media?.addedToFavorites ? (
              <motion.div whileHover={{ scale: 1.1 }} className="relative">
                <CheckIcon color="white" className={`h-4 w-4 md:h-5 md:w-5`} />
                {!listView && (
                  <>
                    <PlusIcon
                      color="white"
                      className={`h-4 w-4 md:h-5 md:w-5 hidden`}
                    />
                    {/* <div className="text-xs font-semibold text-white -top-6 absolute left-1/2 transform -translate-x-1/2">
                      Remove from Favorites
                    </div> */}
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.1 }} className="relative">
                <PlusIcon color="white" className="h-4 w-4 md:h-5 md:w-5" />
                {/* <div className="text-[12px] font-semibold text-black w-[70px] -bottom-6 border rounded-sm inline bg-white absolute left-1/2 transform -translate-x-1/2">
                  Add to Favorites
                </div> */}
              </motion.div>
            )}
          </button>

          <button
            onClick={() => {
              setShowDetailsPopup(true);
              setCurrentMediaInfoIdAndType({
                type: media?.type,
                id: listView ? media?.movieID : media?.id,
              });
            }}
            className="cursor-pointer border flex p-2 items-center gap-x-2 
        rounded-full text-sm font-semibold transition hover:opacity-90
         border-white bg-black opacity-75 text-black"
          >
            <ChevronDownIcon color="white" className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
