const errorHandler = (message = "", error: any) => {
  if (error["name"] && error["name"] === "BACKEND_ERROR") {
    alert(error["message"]["message"]);
  } else {
    alert(message);
  }
};

export { errorHandler };
