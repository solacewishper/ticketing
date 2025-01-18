const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // Server side
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: {
        ...req.headers,
        Host: "multik8s.site", // Add this line
      },
    });
  } else {
    // Browser side
    return axios.create({
      baseURL: "https://multik8s.site",
    });
  }
};
