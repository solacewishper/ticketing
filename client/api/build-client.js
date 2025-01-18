import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server!
    return axios.create({
      baseURL: "https://multik8s.site",
      headers: req.headers,
    });
  } else {
    // We are on the browser!
    return axios.create({
      baseURL: "https://multik8s.site",
    });
  }
};

export default buildClient;
