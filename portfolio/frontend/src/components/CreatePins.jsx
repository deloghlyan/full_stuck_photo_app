// import state hook
import { useState } from "react";

// import navigation
import { useNavigate } from "react-router-dom";

// import the icons to be used
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

// import a spinner
import Spinner from "./Spinner";

// import client to deal with the backend
import { client } from "../client";

// import categories
import { categories } from "../utilities/data";

const CreatePins = ({ user }) => {
  // create all the states we will need to create the component
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  // create a variable for navigation
  const navigate = useNavigate();

  // function to upload images
  const uploadImage = (e) => {
    const selectedFile = e.target.files[0];
    const { type, name } = selectedFile;

    // if (
    //   type === "image/jpeg" ||
    //   type === "image/gif" ||
    //   type === "image/png" ||
    //   type === "image/svg" ||
    //   type === "image/tiff"
    // ) {
    //   setWrongImageType(false);
    //   setLoading(true);

    //   client.assets
    //     .upload("image", selectedFile, { contentType: type, filename: name })
    //     .then((document) => {
    //       setImageAsset(document);
    //       setLoading(false);
    //     })
    //     .catch((error) => {
    //       console.log("Image upload error ", error);
    //     });
    // } else {
    //   setWrongImageType(true);
    // }

    // or with switch case
    switch (type) {
      case "image/jpeg":
      case "image/gif":
      case "image/png":
      case "image/svg":
      case "image/tiff":
        setWrongImageType(false);
        setLoading(true);

        client.assets
          .upload("image", selectedFile, { contentType: type, filename: name })
          .then((document) => {
            setImageAsset(document);
            setLoading(false);
          })
          .catch((error) => {
            console.log("Image upload error ", error);
          });
        break;

      default:
        setWrongImageType(false);
    }
  };

  // function to save created pins
  const savePin = () => {
    if (title && about && destination && imageAsset?._id && category) {
      const document = {
        _type: "pin",
        title,
        about,
        destination,
        category,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
      };

      client.create(document)
        .then(() => navigate("/"))
    } else {
      setFields(true);

      setTimeout(() => setFields(false), 2000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in">
          Please fill-in all the fields.
        </p>
      )}
      <div className="flex flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && <Spinner message={"Loading..."} />}
            {wrongImageType && <p>Cannot load. Wrong image type!</p>}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-4xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload</p>
                    <p className="mt-32 text-gray-400 text-sm">
                      Use high-quality images less than 20 MB
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-picture"
                  className="h-full w-full"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out opacity-70 hover:opacity-100"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title here"
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
          />
          {user && (
            <div className="flex gap-2 item-center bg-white rounded-lg">
              <img
                src={user.image}
                alt="user-profile"
                className="w-10 h-10 rounded-full"
              />
              <p className="font-bold flex justify-center items-center">
                {user.userName}
              </p>
            </div>
          )}
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="What is your pin about?"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add the destionation link"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          <div className="flex flex-col">
            <div>
              <p className="mb-2 font-semibold text-lg sm:text-xl">
                Choose Pin Category
              </p>
              <select
                name=""
                id=""
                onChange={(e) => setCategory(e.target.value)}
                className="outline-none w-full text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="other" className="bg-white" disabled selected>
                  Select Category
                </option>

                {categories.map((category) => (
                  <option
                    className="text-base border-0 outline-none capitalize bg-white text-black"
                    value={category.name}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end items-end mt-5">
              <button
                type="button"
                onClick={savePin}
                className="bg-red-500 text-white font-bold p-2 rounded-lg w-28 outline-none hover:bg-red-600 hover:shadow-md"
              >
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePins;
