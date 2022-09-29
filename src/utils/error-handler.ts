const errorHandler = (message = "", error: any) => {
  console.log("Cached error:", error);
  alert(message);
};

export { errorHandler };
