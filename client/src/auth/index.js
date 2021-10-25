const authHeader = () => {
  return {
    headers: { Authorization: "Bearer " + localStorage.getItem("n64-jwt") },
  };
};

export default authHeader;
