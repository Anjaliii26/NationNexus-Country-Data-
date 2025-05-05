import axios from "axios";

const api = axios.create({
  baseURL: "https://restcountries.com/v3.1",
});

// HTTP GET METHOD
export const getCountryData = () => {
  return api.get("/all?fields=name,population,region,capital,flags");
};

// HTTP GET METHOD fro the indvi. country name
export const getCountryIndData = (name) => {
  return api.get(
    `/name/${name}?fullText=true&fields=name,population,region,subregion,capital,tld,currencies,languages,borders,flags`
  );
};
export const BASE_URL = "http://localhost:5000"; // Your backend API base URL

export const addToFavourites = async (countryName) => {
  try {
    const token = localStorage.getItem("token"); // Get token
    if (!token) throw new Error("User not logged in");

    const response = await fetch(`http://localhost:5000/favourite/add/${countryName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Attach token
      },
    });

    if (!response.ok) throw new Error("Failed to add");

    return await response.json();
  } catch (error) {
    console.error("Error adding to favourites:", error);
    return { message: "Failed to add country to favourites" };
  }
};
