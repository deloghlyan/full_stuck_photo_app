import { client, urlFor } from "../client";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchUser } from "../utilities/fetchUser";

const Pin = ({ pin: { image, destination, _id, postedBy, save } }) => {
  const [postHovered, setPostHovered] = useState(false);

  const [savingPost, setSavingPost] = useState(false);

  // navigating the user to the pin-detail page when the user clicks the pin
  const navigate = useNavigate();

  // using fetchUser function to fetch user data we need
  const user = fetchUser();

  // check if the lenght of save is 0 return false and if is grater than 0 return true
  const alreadySaved = !!save?.filter((item) => item.postedBy._id === user.sub)
    ?.length;

  // create a function to save a pin
  const savePin = (id) => {
    if (!alreadySaved) {
      setSavingPost(true);

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user.sub,
            postedBy: {
              _type: "postedBy",
              _ref: user.sub,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
          setSavingPost(false);
        });
    }
  };

  // create a function to delete a pin
  const deletePin = (id) => {
    client
      .delete(id)
      .then(() => {
        window.location.reload();
      });
  };

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img
          src={urlFor(image).width(250).url()}
          alt="user-post"
          className="rounded-lg w-full"
        />
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-2 pl-1 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-3xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                  disabled
                >
                  {save?.length} Saved
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                >
                  Save
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white flex items-center gap-2 text-black p-1 px-2 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                  onClick={(e) => {e.stopPropagation()}}
                >
                  <BsFillArrowUpRightCircleFill fontSize={20} />
                  {destination.length > 16
                    ? `${destination.slice(0, 16)}...`
                    : destination}
                </a>
              )}
              {postedBy?._id === user.sub && (
                <button
                  type="button"
                  className="bg-white rounded-full p-1.5 opacity-70 hover:opacity-100"
                  onClick={(e) => {e.stopPropagation(); deletePin(_id)}}
                >
                  <AiTwotoneDelete fontSize={20} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link to={`user-profile/${postedBy?._id}`} className="flex gap-2 items-center mt-2">
        <img src={postedBy?.image} alt="user photo" className="w-8 h-8 rounded-full object-cover" />
        <p className="font-semibold">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
