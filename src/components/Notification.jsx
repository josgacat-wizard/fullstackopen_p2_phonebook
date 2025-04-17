const Notification = ({ message, typeOfNotification }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className={typeOfNotification === "error" ? "error" : "success"}>
      {message}
    </div>
  );
};

export default Notification;
