import { useEffect, useState, useTransition } from "react";
import { NavLink, useParams } from "react-router-dom";
import { getCountryIndData } from "../../api/postApi";
import { Loader } from "../UI/Loader";

export const CountryDetails = () => {
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const [country, setCountry] = useState();
  const [isFavourite, setIsFavourite] = useState(false); // Track favourite state

  useEffect(() => {
    startTransition(async () => {
      const res = await getCountryIndData(params.id);
      if (res.status === 200) {
        setCountry(res.data[0]);
      }
    });
  }, [params.id]); // Add params.id dependency

  // Function to handle adding to favourites
  const handleFavourite = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/favourites/add/${country.name.common}`, // Fixed URL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        setIsFavourite(true); // Update UI
        console.log("Added to favourites");
      } else {
        console.error("Failed to add to favourites");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (isPending || !country) return <Loader />; // Display loader while fetching

  return (
    <section className="card country-details-card container">
      <div className="container-card bg-white-box">
        {country && (
          <div className="country-image grid grid-two-cols">
            <img
              src={country.flags?.svg || ""}
              alt={country.flags?.alt || "Flag"}
              className="flag"
            />
            <div className="country-content">
              <p className="card-title"> {country.name.official} </p>

              <div className="infoContainer">
                <p>
                  <span className="card-description"> Native Names:</span>
                  {country.name.nativeName
                    ? Object.keys(country.name.nativeName)
                        .map((key) => country.name.nativeName[key].common)
                        .join(", ")
                    : "N/A"}
                </p>
                <p>
                  <span className="card-description"> Population: </span>
                  {country.population?.toLocaleString() || "N/A"}
                </p>
                <p>
                  <span className="card-description"> Region:</span>
                  {country.region || "N/A"}
                </p>
                <p>
                  <span className="card-description"> Sub Region:</span>
                  {country.subregion || "N/A"}
                </p>
                <p>
                  <span className="card-description"> Capital:</span>
                  {country.capital?.join(", ") || "N/A"}
                </p>

                <p>
                  <span className="card-description">Top Level Domain:</span>
                  {country.tld?.[0] || "N/A"}
                </p>
                <p>
                  <span className="card-description"> Currencies: </span>
                  {country.currencies
                    ? Object.keys(country.currencies)
                        .map((curElem) => country.currencies[curElem].name)
                        .join(", ")
                    : "N/A"}
                </p>
                <p>
                  <span className="card-description">Languages: </span>
                  {country.languages
                    ? Object.keys(country.languages)
                        .map((key) => country.languages[key])
                        .join(", ")
                    : "N/A"}
                </p>
              </div>

              {/* Add Favourite Button */}
              <button onClick={handleFavourite} disabled={isFavourite} className="favourite-btn">
                {isFavourite ? "Added to Favourites ✅" : "Add to Favourites"}
              </button>

            </div>
          </div>
        )}
        <div className="country-card-backBtn">
          <NavLink to="/country" className="backBtn">
            <button>Go Back</button>
          </NavLink>
        </div>
      </div>
    </section>
  );
};
