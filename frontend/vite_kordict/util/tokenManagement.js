export const setTokenFromResponse = (response) => {
  localStorage.setItem("token", response.token);
  localStorage.setItem("username", response.user["username"]);
  localStorage.setItem("expiry", response.expiry);
};

export const isLoggedIn = () => {
  return localStorage.getItem("token") != null;
};

export const loginIsExpired = () => {
  if (
    !localStorage.getItem("loginInfo") ||
    !localStorage.getItem("loginInfo").expiry
  ) {
    return false;
  } else {
    return (
      utcMSFromString(localStorage.getItem("loginInfo").expiry) >
      new Date().getTime()
    );
  }
};

const utcMSFromString = (dateString) => {
  // Extract date and time components
  const dateTimeParts = dateString.split(/[T+-]/);
  const datePart = dateTimeParts[0];
  const timePart = dateTimeParts[1];

  // Parse date and time separately
  const dateComponents = datePart.split("-");
  const timeComponents = timePart.split(":");

  // Create a new Date object
  const utcDate = new Date(
    Date.UTC(
      dateComponents[0], // Year
      dateComponents[1] - 1, // Month (zero-based)
      dateComponents[2], // Day
      timeComponents[0], // Hour
      timeComponents[1], // Minute
      timeComponents[2].split(".")[0], // Second
      timeComponents[2].split(".")[1], // Millisecond
    ),
  );

  // Get the UTC time in milliseconds
  const utcTimeInMillis = utcDate.getTime();

  // Extract time zone offset
  const offsetMinutes =
    parseInt(dateTimeParts[2].substring(0, 3)) * 60 +
    parseInt(dateTimeParts[2].substring(3));

  // Adjust for the time zone offset
  const localTimeInMillis = utcTimeInMillis - offsetMinutes * 60 * 1000;

  return localTimeInMillis;
};
